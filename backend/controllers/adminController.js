import { all, get, run } from "../database/database.js";

export async function getDashboardStats(req, res) {
    try {
        const stats = await get(`
            SELECT
                COUNT(*) AS total_orders,

                COUNT(*) FILTER (
                    WHERE
                        (created_at AT TIME ZONE 'Asia/Kolkata')::date
                        =
                        (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date
                ) AS today_orders,

                COUNT(*) FILTER (
                    WHERE
                        (created_at AT TIME ZONE 'Asia/Kolkata')::date
                        =
                        (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date
                        AND status = 'Completed'
                ) AS today_completed,

                COALESCE(
                    SUM(total) FILTER (
                        WHERE
                            (created_at AT TIME ZONE 'Asia/Kolkata')::date
                            =
                            (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date
                            AND status = 'Completed'
                    ),
                    0
                ) AS today_income,

                COUNT(*) FILTER (
                    WHERE status IN (
                        'Pending',
                        'Confirmed',
                        'Preparing',
                        'Ready'
                    )
                ) AS pending_orders

            FROM orders
        `);

        res.json({
            success: true,

            stats: {
                todayOrders:
                    Number(stats.today_orders) || 0,

                todayCompleted:
                    Number(stats.today_completed) || 0,

                todayIncome:
                    Number(stats.today_income) || 0,

                pendingOrders:
                    Number(stats.pending_orders) || 0,

                totalOrders:
                    Number(stats.total_orders) || 0,
            },
        });
    } catch (error) {
        console.error(
            "Dashboard stats error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch dashboard statistics.",
        });
    }
}

export async function getOrderHistory(req, res) {
    try {
        const dailySummary = await all(`
            SELECT
                (created_at AT TIME ZONE 'Asia/Kolkata')::date
                    AS date_ist,

                COUNT(*) AS total_orders,

                COUNT(*) FILTER (
                    WHERE status = 'Completed'
                ) AS completed_orders,

                COALESCE(
                    SUM(total) FILTER (
                        WHERE status = 'Completed'
                    ),
                    0
                ) AS total_income

            FROM orders

            GROUP BY
                (created_at AT TIME ZONE 'Asia/Kolkata')::date

            ORDER BY date_ist DESC
        `);

        res.json({
            success: true,

            dailySummary: dailySummary.map((d) => ({
                date: d.date_ist,
                orders: Number(d.total_orders),
                completed:
                    Number(d.completed_orders),
                income: Number(d.total_income) || 0,
            })),
        });
    } catch (error) {
        console.error(
            "Order history error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch order history.",
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
                    emoji,
                    image
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
                    tableNumber:
                        order.table_number,
                    orderType:
                        order.order_type,
                },

                items,

                total: Number(order.total),

                status: order.status,

                preparationTime:
                    order.preparation_time,

                createdAt: order.created_at,
            });
        }

        res.json({
            success: true,
            orders: ordersWithItems,
        });
    } catch (error) {
        console.error(
            "Admin orders error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch admin orders.",
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
            message:
                "Order status updated successfully.",
            order: updatedOrder,
        });
    } catch (error) {
        console.error(
            "Update order status error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to update order status.",
        });
    }
}