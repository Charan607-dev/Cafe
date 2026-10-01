import express from "express";

import {
    createNewOrder,
    getOrders,
    getSingleOrder,
    getCustomerOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createNewOrder);

router.get("/", getOrders);

router.get("/customer/:customerId", getCustomerOrders);

router.get("/:orderId", getSingleOrder);

export default router;