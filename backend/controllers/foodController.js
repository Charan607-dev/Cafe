import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
    createFood,
    getAllFoods,
    getFoodById,
    deleteFoodById,
} from "../models/foodModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads/foods");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Category to default emoji helper
function getCategoryEmoji(category) {
    switch (category) {
        case "Burgers":
            return "🍔";
        case "Pizza":
            return "🍕";
        case "Meals":
            return "🍚";
        case "Drinks":
            return "🥤";
        case "Desserts":
            return "🍨";
        default:
            return "🍽️";
    }
}

export async function getFoods(req, res) {
    try {
        const foods = await getAllFoods();
        res.json({
            success: true,
            foods,
        });
    } catch (error) {
        console.error("Get foods error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch food items.",
            error: error.message,
        });
    }
}

export async function addFood(req, res) {
    try {
        const { name, category, price, description, emoji, image } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Food name is required.",
            });
        }

        if (!category || !category.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category is required.",
            });
        }

        if (price === undefined || price === null || isNaN(Number(price))) {
            return res.status(400).json({
                success: false,
                message: "A valid price is required.",
            });
        }

        let imageUrl = null;

        // If an image was uploaded via base64 data URL
        if (image && typeof image === "string" && image.startsWith("data:image/")) {
            const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
            if (matches) {
                const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
                const base64Data = matches[2];
                const filename = `food_${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`;
                const filepath = path.join(uploadDir, filename);

                fs.writeFileSync(filepath, Buffer.from(base64Data, "base64"));
                imageUrl = `/uploads/foods/${filename}`;
            } else {
                imageUrl = image;
            }
        } else if (image && typeof image === "string") {
            imageUrl = image;
        }

        const foodEmoji = emoji || getCategoryEmoji(category);

        const newFood = await createFood({
            name: name.trim(),
            category: category.trim(),
            price: Number(price),
            emoji: foodEmoji,
            description: (description || "").trim(),
            image: imageUrl,
        });

        res.status(201).json({
            success: true,
            message: "Food item added successfully.",
            food: newFood,
        });
    } catch (error) {
        console.error("Add food error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add food item.",
            error: error.message,
        });
    }
}

export async function removeFood(req, res) {
    try {
        const { id } = req.params;
        const deletedFood = await deleteFoodById(id);

        if (!deletedFood) {
            return res.status(404).json({
                success: false,
                message: "Food item not found.",
            });
        }

        // If local uploaded file exists, delete it
        if (deletedFood.image && deletedFood.image.startsWith("/uploads/foods/")) {
            const filename = path.basename(deletedFood.image);
            const filepath = path.join(uploadDir, filename);
            if (fs.existsSync(filepath)) {
                try {
                    fs.unlinkSync(filepath);
                } catch (e) {
                    console.error("Error removing uploaded image:", e);
                }
            }
        }

        res.json({
            success: true,
            message: "Food item deleted successfully.",
            food: deletedFood,
        });
    } catch (error) {
        console.error("Delete food error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete food item.",
            error: error.message,
        });
    }
}
