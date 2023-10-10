require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 환경 변수 유효성 검사
if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
  throw new Error('Database connection details are missing from environment variables.');
}

let pool;

const connectDb = async () => {
  try {
    pool = mysql.createPool(dbConfig);
    const conn = await pool.getConnection();
    console.log("MySQL Connect Success.");
    conn.release(); // 연결 테스트 후 연결을 반환
  } catch (error) {
    console.error("MySQL Connect Error:", error);
    setTimeout(connectDb, 2000); // 재시도
  }
};

connectDb();

module.exports = pool.promise(); // 연결 풀 반환
