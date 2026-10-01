import { exec } from "./database.js";

const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT UNIQUE NOT NULL,
        customer_id TEXT,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        table_number TEXT NOT NULL,
        order_type TEXT NOT NULL,
        delivery_location TEXT,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        preparation_time TEXT NOT NULL DEFAULT '15–20 minutes',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`;

const createOrderItemsTable = `
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL,
        food_id INTEGER NOT NULL,
        food_name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        emoji TEXT,
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
    )
`;

export async function initializeDatabase() {
    try {
        await exec(createOrdersTable);
        await exec(createOrderItemsTable);

        // Migration: add customer_id column for existing databases
        try {
            await exec(
                `ALTER TABLE orders ADD COLUMN customer_id TEXT`
            );
        } catch (error) {
            // Column already exists — safe to ignore
        }

        console.log("Database tables are ready.");
    } catch (error) {
        console.error(
            "Database initialization failed:",
            error.message
        );

        throw error;
    }
}