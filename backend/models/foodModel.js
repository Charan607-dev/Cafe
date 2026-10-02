import { run, get, all } from "../database/database.js";

export async function createFood({ name, category, price, emoji, description, image }) {
    const result = await run(
        `
        INSERT INTO foods (name, category, price, emoji, description, image)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [name, category, price, emoji || "🍽️", description || "", image || null]
    );

    return await getFoodById(result.id);
}

export async function getAllFoods() {
    return await all(
        `
        SELECT *
        FROM foods
        ORDER BY id ASC
        `
    );
}

export async function getFoodById(id) {
    return await get(
        `
        SELECT *
        FROM foods
        WHERE id = ?
        `,
        [id]
    );
}

export async function deleteFoodById(id) {
    const food = await getFoodById(id);
    if (!food) return null;

    await run(`DELETE FROM foods WHERE id = ?`, [id]);
    return food;
}
