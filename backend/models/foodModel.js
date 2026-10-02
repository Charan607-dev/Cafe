import { run, get, all } from "../database/database.js";

export async function createFood({
    name,
    category,
    price,
    emoji,
    description,
    image,
}) {
    const result = await run(
        `
        INSERT INTO foods
        (
            name,
            category,
            price,
            emoji,
            description,
            image
        )
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING id
        `,
        [
            name,
            category,
            price,
            emoji || "🍽️",
            description || "",
            image || null,
        ]
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

export async function updateFoodById(
    id,
    {
        name,
        category,
        price,
        emoji,
        description,
        image,
    }
) {
    const existing = await getFoodById(id);

    if (!existing) {
        return null;
    }

    const updatedName =
        name !== undefined ? name : existing.name;

    const updatedCategory =
        category !== undefined
            ? category
            : existing.category;

    const updatedPrice =
        price !== undefined
            ? price
            : existing.price;

    const updatedEmoji =
        emoji !== undefined
            ? emoji
            : existing.emoji;

    const updatedDescription =
        description !== undefined
            ? description
            : existing.description;

    const updatedImage =
        image !== undefined
            ? image
            : existing.image;

    await run(
        `
        UPDATE foods
        SET
            name = ?,
            category = ?,
            price = ?,
            emoji = ?,
            description = ?,
            image = ?
        WHERE id = ?
        `,
        [
            updatedName,
            updatedCategory,
            updatedPrice,
            updatedEmoji,
            updatedDescription,
            updatedImage,
            id,
        ]
    );

    return await getFoodById(id);
}

export async function deleteFoodById(id) {
    const food = await getFoodById(id);

    if (!food) {
        return null;
    }

    await run(
        `
        DELETE FROM foods
        WHERE id = ?
        `,
        [id]
    );

    return food;
}