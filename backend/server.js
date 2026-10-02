import express from "express";
import cors from "cors";

import { initializeDatabase } from "./database/initDatabase.js";

import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://campus-cafe-customer.onrender.com",
            "https://campus-cafe-admin.onrender.com",
        ],
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Campus Café API is running.",
    });
});

app.use("/api/orders", orderRoutes);

app.use("/api/admin", adminRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found.",
    });
});

async function startServer() {
    try {
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(
                `Campus Café backend running on port ${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Failed to start server:",
            error.message
        );

        process.exit(1);
    }
}

startServer();