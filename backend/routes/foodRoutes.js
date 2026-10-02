import express from "express";
import {
    getFoods,
    addFood,
    editFood,
    removeFood,
} from "../controllers/foodController.js";

const router = express.Router();

router.get("/", getFoods);
router.post("/", addFood);
router.put("/:id", editFood);
router.delete("/:id", removeFood);

export default router;
