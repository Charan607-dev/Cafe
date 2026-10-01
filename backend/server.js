import express from "express";
import cors from "cors";

import "./database/initDatabase.js";

import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

const PORT = 5000;

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
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

app.listen(PORT, () => {
    console.log(
        `Campus Café backend running on http://localhost:${PORT}`
    );
});