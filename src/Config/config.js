const doenv = require("dotenv");
const { Pool } = require("pg");

doenv.config({ path: "./config.env" });

const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Create a connection pool
const pool = new Pool(config);

// Function to test the database connection
async function testDatabaseConnection(req, res, next) {
  try {
    const client = await pool.connect();
    console.log("Database connection successful!");
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit the application with an error code
  }
}

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);

  next(err);
});

module.exports = { testDatabaseConnection, pool };
