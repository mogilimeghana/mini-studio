
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

// Routes
const healthRoutes = require("./routes/healthRoutes");
const generateRoutes = require("./routes/generateRoutes");

app.use("/", healthRoutes);
app.use("/", generateRoutes);

// Create jobs table
async function createJobsTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS jobs (
            id CHAR(36) PRIMARY KEY,
            product_name TEXT NOT NULL,
            description TEXT NOT NULL,
            reference_image TEXT,
            prompt TEXT NOT NULL,
            status VARCHAR(20) NOT NULL,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("✅ Jobs table is ready");
}

// Connect to database and start server
async function startServer() {
    try {
        const connection = await pool.getConnection();

        console.log("✅ Connected to MySQL");

        connection.release();

        await createJobsTable();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Database Connection Failed:");
        console.error(error.message);
        process.exit(1);
    }
}

startServer();
