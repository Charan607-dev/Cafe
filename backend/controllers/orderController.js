import {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByCustomerId,
} from "../models/orderModel.js";

export async function createNewOrder(req, res) {
    try {
        const order = req.body;

        if (!order.orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required.",
            });
        }

        if (!order.customer) {
            return res.status(400).json({
                success: false,
                message: "Customer details are required.",
            });
        }

        if (!order.items || order.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one item.",
            });
        }

        const savedOrder = await createOrder(order);

        res.status(201).json({
            success: true,
            message: "Order created successfully.",
            order: savedOrder,
        });
    } catch (error) {
        console.error("Create order error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create order.",
            error: error.message,
        });
    }
}

export async function getOrders(req, res) {
    try {
        const orders = await getAllOrders();

        res.json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Get orders error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders.",
            error: error.message,
        });
    }
}

export async function getSingleOrder(req, res) {
    try {
        const { orderId } = req.params;

        const order = await getOrderById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Get order error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order.",
            error: error.message,
        });
    }
}

export async function getCustomerOrders(req, res) {
    try {
        const { customerId } = req.params;

        if (!customerId) {
            return res.status(400).json({
                success: false,
                message: "Customer ID is required.",
            });
        }

        const orders = await getOrdersByCustomerId(customerId);

        res.json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Get customer orders error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch customer orders.",
            error: error.message,
        });
    }
}