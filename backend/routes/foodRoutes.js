import express from "express";
import {
    getFoods,
    addFood,
    removeFood,
} from "../controllers/foodController.js";

const router = express.Router();

router.get("/", getFoods);
router.post("/", addFood);
router.delete("/:id", removeFood);

export default router;
