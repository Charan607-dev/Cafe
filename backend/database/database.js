import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        "DATABASE_URL environment variable is not set."
    );
}

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.on("connect", () => {
    console.log("Connected to PostgreSQL database.");
});

pool.on("error", (error) => {
    console.error(
        "Unexpected PostgreSQL pool error:",
        error.message
    );
});

function convertPlaceholders(sql) {
    let index = 0;

    return sql.replace(/\?/g, () => {
        index += 1;
        return `$${index}`;
    });
}

export async function run(sql, params = []) {
    const convertedSql = convertPlaceholders(sql);

    const result = await pool.query(
        convertedSql,
        params
    );

    return {
        id:
            result.rows[0]?.id ??
            null,
        changes: result.rowCount,
    };
}

export async function get(sql, params = []) {
    const convertedSql = convertPlaceholders(sql);

    const result = await pool.query(
        convertedSql,
        params
    );

    return result.rows[0] || undefined;
}

export async function all(sql, params = []) {
    const convertedSql = convertPlaceholders(sql);

    const result = await pool.query(
        convertedSql,
        params
    );

    return result.rows;
}

export async function exec(sql) {
    const convertedSql = convertPlaceholders(sql);

    await pool.query(convertedSql);
}

export async function withTransaction(callback) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const transactionDb = {
            async run(sql, params = []) {
                const convertedSql = convertPlaceholders(sql);

                const result = await client.query(
                    convertedSql,
                    params
                );

                return {
                    id:
                        result.rows[0]?.id ??
                        null,
                    changes: result.rowCount,
                };
            },

            async get(sql, params = []) {
                const convertedSql = convertPlaceholders(sql);

                const result = await client.query(
                    convertedSql,
                    params
                );

                return result.rows[0] || undefined;
            },

            async all(sql, params = []) {
                const convertedSql = convertPlaceholders(sql);

                const result = await client.query(
                    convertedSql,
                    params
                );

                return result.rows;
            },

            async exec(sql) {
                const convertedSql = convertPlaceholders(sql);

                await client.query(convertedSql);
            },
        };

        const result = await callback(transactionDb);

        await client.query("COMMIT");

        return result;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export default pool;