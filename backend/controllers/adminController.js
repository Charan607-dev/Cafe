import { all, get, run } from "../database/database.js";

export async function getDashboardStats(req, res) {
    try {
        const stats = await get(`
            SELECT
                COUNT(*) AS total_orders,

                SUM(
                    CASE
                        WHEN date(created_at, '+5 hours', '+30 minutes') = date('now', '+5 hours', '+30 minutes')
                        THEN 1
                        ELSE 0
                    END
                ) AS today_orders,

                SUM(
                    CASE
                        WHEN date(created_at, '+5 hours', '+30 minutes') = date('now', '+5 hours', '+30 minutes')
                        AND status IN ('Completed')
                        THEN 1
                        ELSE 0
                    END
                ) AS today_completed,

                SUM(
                    CASE
                        WHEN date(created_at, '+5 hours', '+30 minutes') = date('now', '+5 hours', '+30 minutes')
                        AND status IN ('Completed')
                        THEN total
                        ELSE 0
                    END
                ) AS today_income,

                SUM(
                    CASE
                        WHEN status IN ('Pending', 'Confirmed', 'Preparing', 'Ready')
                        THEN 1
                        ELSE 0
                    END
                ) AS pending_orders

            FROM orders
        `);

        res.json({
            success: true,
            stats: {
                todayOrders: stats.today_orders || 0,
                todayCompleted: stats.today_completed || 0,
                todayIncome: stats.today_income || 0,
                pendingOrders: stats.pending_orders || 0,
                totalOrders: stats.total_orders || 0,
            },
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics.",
        });
    }
}

export async function getOrderHistory(req, res) {
    try {
        // Daily financial summary grouped by IST date
        const dailySummary = await all(`
            SELECT
                date(created_at, '+5 hours', '+30 minutes') AS date_ist,
                COUNT(*) AS total_orders,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_orders,
                SUM(CASE WHEN status = 'Completed' THEN total ELSE 0 END) AS total_income
            FROM orders
            GROUP BY date_ist
            ORDER BY date_ist DESC
        `);

        res.json({
            success: true,
            dailySummary: dailySummary.map((d) => ({
                date: d.date_ist,
                orders: d.total_orders,
                completed: d.completed_orders,
                income: d.total_income || 0,
            })),
        });
    } catch (error) {
        console.error("Order history error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order history.",
        });
    }
}

export async function getAdminOrders(req, res) {
    try {
        const orders = await all(`
            SELECT
                order_id,
                customer_name,
                phone,
                table_number,
                order_type,
                total,
                status,
                preparation_time,
                created_at
            FROM orders
            ORDER BY created_at DESC
        `);

        const ordersWithItems = [];

        for (const order of orders) {
            const items = await all(
                `
                SELECT
                    food_id AS id,
                    food_name AS name,
                    price,
                    quantity,
                    emoji
                FROM order_items
                WHERE order_id = ?
                `,
                [order.order_id]
            );

            ordersWithItems.push({
                orderId: order.order_id,

                customer: {
                    name: order.customer_name,
                    phone: order.phone,
                    tableNumber: order.table_number,
                    orderType: order.order_type,
                },

                items,

                total: order.total,

                status: order.status,

                preparationTime: order.preparation_time,

                createdAt: order.created_at,
            });
        }

        res.json({
            success: true,
            orders: ordersWithItems,
        });
    } catch (error) {
        console.error("Admin orders error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch admin orders.",
        });
    }
}

export async function updateOrderStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Preparing",
            "Ready",
            "Completed",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status.",
            });
        }

        const existingOrder = await get(
            `
            SELECT order_id
            FROM orders
            WHERE order_id = ?
            `,
            [orderId]
        );

        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        await run(
            `
            UPDATE orders
            SET status = ?
            WHERE order_id = ?
            `,
            [status, orderId]
        );

        const updatedOrder = await get(
            `
            SELECT
                order_id,
                status
            FROM orders
            WHERE order_id = ?
            `,
            [orderId]
        );

        res.json({
            success: true,
            message: "Order status updated successfully.",
            order: updatedOrder,
        });
    } catch (error) {
        console.error("Update order status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update order status.",
        });
    }
}