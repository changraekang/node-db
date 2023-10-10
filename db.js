require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let db;

const connectDb = async () => {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log("MySQL Connect Success.");
  } catch (error) {
    console.error("MySQL Connect Error:", error);
    setTimeout(connectDb, 2000);
  }

  db.on("error", async (error) => {
    console.error("MySQL Error:", error);
    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      await connectDb();
    } else {
      throw error;
    }
  });
};

connectDb();

module.exports = db;
