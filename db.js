require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (
  !dbConfig.host ||
  !dbConfig.user ||
  !dbConfig.password ||
  !dbConfig.database
) {
  throw new Error(
    "Database connection details are missing from environment variables."
  );
}

const pool = mysql.createPool(dbConfig);

module.exports = pool;
