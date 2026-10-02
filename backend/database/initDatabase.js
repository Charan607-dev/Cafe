import { exec, run, get } from "./database.js";

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
        image TEXT,
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
    )
`;

const createFoodsTable = `
    CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        emoji TEXT DEFAULT '🍽️',
        description TEXT,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`;

const initialFoods = [
    {
        name: "Classic Burger",
        category: "Burgers",
        price: 99,
        emoji: "🍔",
        description: "Juicy burger with fresh vegetables and special sauce.",
        image: null,
    },
    {
        name: "Cheese Burger",
        category: "Burgers",
        price: 119,
        emoji: "🍔",
        description: "Classic burger loaded with melted cheese.",
        image: null,
    },
    {
        name: "Margherita Pizza",
        category: "Pizza",
        price: 149,
        emoji: "🍕",
        description: "Classic pizza topped with cheese and tomato.",
        image: null,
    },
    {
        name: "Paneer Pizza",
        category: "Pizza",
        price: 179,
        emoji: "🍕",
        description: "Delicious pizza topped with spicy paneer.",
        image: null,
    },
    {
        name: "Veg Fried Rice",
        category: "Meals",
        price: 110,
        emoji: "🍚",
        description: "Flavorful fried rice with fresh vegetables.",
        image: null,
    },
    {
        name: "Chicken Rice",
        category: "Meals",
        price: 140,
        emoji: "🍗",
        description: "Tasty chicken rice prepared with aromatic spices.",
        image: null,
    },
    {
        name: "Cold Coffee",
        category: "Drinks",
        price: 70,
        emoji: "🥤",
        description: "Refreshing chilled coffee with a creamy finish.",
        image: null,
    },
    {
        name: "Fresh Lime Soda",
        category: "Drinks",
        price: 50,
        emoji: "🍋",
        description: "Refreshing lime soda perfect for a hot day.",
        image: null,
    },
    {
        name: "Chocolate Brownie",
        category: "Desserts",
        price: 80,
        emoji: "🍫",
        description: "Soft and rich chocolate brownie.",
        image: null,
    },
    {
        name: "Ice Cream",
        category: "Desserts",
        price: 60,
        emoji: "🍨",
        description: "Creamy and delicious ice cream.",
        image: null,
    },
];

export async function initializeDatabase() {
    try {
        await exec(createOrdersTable);
        await exec(createOrderItemsTable);
        await exec(createFoodsTable);

        // Migration: add customer_id column for existing databases
        try {
            await exec(
                `ALTER TABLE orders ADD COLUMN customer_id TEXT`
            );
        } catch (error) {
            // Column already exists — safe to ignore
        }

        // Migration: add image column to order_items for existing databases
        try {
            await exec(
                `ALTER TABLE order_items ADD COLUMN image TEXT`
            );
        } catch (error) {
            // Column already exists — safe to ignore
        }

        // Seed default foods if foods table is empty
        const countRow = await get(`SELECT COUNT(*) AS count FROM foods`);
        if (countRow && countRow.count === 0) {
            for (const item of initialFoods) {
                await run(
                    `INSERT INTO foods (name, category, price, emoji, description, image) VALUES (?, ?, ?, ?, ?, ?)`,
                    [item.name, item.category, item.price, item.emoji, item.description, item.image]
                );
            }
            console.log("Seeded initial foods into database.");
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