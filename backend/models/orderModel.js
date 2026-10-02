import {
    run,
    get,
    all,
    withTransaction,
} from "../database/database.js";

export async function createOrder(order) {
    return await withTransaction(async (db) => {
        await db.run(
            `
            INSERT INTO orders (
                order_id,
                customer_id,
                customer_name,
                phone,
                table_number,
                order_type,
                delivery_location,
                total,
                status,
                preparation_time
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                order.orderId,
                order.customerId || null,
                order.customer.name,
                order.customer.phone,
                order.customer.tableNumber,
                order.customer.orderType,
                order.customer.deliveryLocation || null,
                order.total,
                "Pending",
                "15–20 minutes",
            ]
        );

        for (const item of order.items) {
            await db.run(
                `
                INSERT INTO order_items (
                    order_id,
                    food_id,
                    food_name,
                    price,
                    quantity,
                    emoji,
                    image
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    order.orderId,
                    item.id,
                    item.name,
                    item.price,
                    item.quantity,
                    item.emoji || "",
                    item.image || null,
                ]
            );
        }

        const savedOrder = await getOrderById(
            order.orderId
        );

        return savedOrder;
    });
}

export async function getOrderById(orderId) {
    const order = await get(
        `
        SELECT *
        FROM orders
        WHERE order_id = ?
        `,
        [orderId]
    );

    if (!order) {
        return null;
    }

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
        [orderId]
    );

    return {
        orderId: order.order_id,

        customerId: order.customer_id || null,

        customer: {
            name: order.customer_name,
            phone: order.phone,
            tableNumber: order.table_number,
            orderType: order.order_type,
            deliveryLocation: order.delivery_location,
        },

        items,

        total: Number(order.total),

        status: order.status,

        preparationTime: order.preparation_time,

        createdAt: order.created_at,
    };
}

export async function getAllOrders() {
    const orders = await all(
        `
        SELECT *
        FROM orders
        ORDER BY created_at DESC
        `
    );

    const result = [];

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

        result.push({
            orderId: order.order_id,

            customerId:
                order.customer_id || null,

            customer: {
                name: order.customer_name,
                phone: order.phone,
                tableNumber: order.table_number,
                orderType: order.order_type,
                deliveryLocation:
                    order.delivery_location,
            },

            items,

            total: Number(order.total),

            status: order.status,

            preparationTime:
                order.preparation_time,

            createdAt: order.created_at,
        });
    }

    return result;
}

export async function getOrdersByCustomerId(
    customerId
) {
    const orders = await all(
        `
        SELECT *
        FROM orders
        WHERE customer_id = ?
        ORDER BY created_at DESC
        `,
        [customerId]
    );

    const result = [];

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

        result.push({
            orderId: order.order_id,

            customerId:
                order.customer_id || null,

            customer: {
                name: order.customer_name,
                phone: order.phone,
                tableNumber: order.table_number,
                orderType: order.order_type,
                deliveryLocation:
                    order.delivery_location,
            },

            items,

            total: Number(order.total),

            status: order.status,

            preparationTime:
                order.preparation_time,

            createdAt: order.created_at,
        });
    }

    return result;
}