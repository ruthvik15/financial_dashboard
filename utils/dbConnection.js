const {Pool} = require("pg");

const pool = new Pool({
    connectionString: process.env.POSTGRES_DB_URI,
});

async function connectPgDB() {
    try {
        const client = await pool.connect();
        console.log("Postgres DB connected to Supabase Cloud");
        client.release();
    } catch (err) {
        console.error("Failed to connect to Postgres DB:", err.message);
    }
}
connectPgDB();

module.exports = pool;