import express from "express";

import {
    getDashboardStats,
    getAdminOrders,
    updateOrderStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);

router.get("/orders", getAdminOrders);

router.patch("/orders/:orderId/status", updateOrderStatus);

export default router;