import {
    createFood,
    getAllFoods,
    getFoodById,
    updateFoodById,
    deleteFoodById,
} from "../models/foodModel.js";

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

        if (image && typeof image === "string") {
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

export async function editFood(req, res) {
    try {
        const { id } = req.params;
        const existingFood = await getFoodById(id);

        if (!existingFood) {
            return res.status(404).json({
                success: false,
                message: "Food item not found.",
            });
        }

        const { name, category, price, description, emoji, image } = req.body;

        if (name !== undefined && !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Food name cannot be empty.",
            });
        }

        if (category !== undefined && !category.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category cannot be empty.",
            });
        }

        if (price !== undefined && (price === null || isNaN(Number(price)) || Number(price) <= 0)) {
            return res.status(400).json({
                success: false,
                message: "A valid positive price is required.",
            });
        }

        let imageUrl = existingFood.image;

        if (image && typeof image === "string") {
            imageUrl = image;
        } else if (image === null || image === "") {
            imageUrl = null;
        }

        const foodEmoji = emoji || (category ? getCategoryEmoji(category) : existingFood.emoji);

        const updated = await updateFoodById(id, {
            name: name !== undefined ? name.trim() : undefined,
            category: category !== undefined ? category.trim() : undefined,
            price: price !== undefined ? Number(price) : undefined,
            emoji: foodEmoji,
            description: description !== undefined ? description.trim() : undefined,
            image: imageUrl,
        });

        res.json({
            success: true,
            message: "Food item updated successfully.",
            food: updated,
        });
    } catch (error) {
        console.error("Edit food error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update food item.",
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
