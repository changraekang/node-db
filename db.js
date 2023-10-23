const mysql = require("mysql2");
// Check if the environment is local (development) and load dotenv

const dbConfig = {
  host: "192.168.11.118",
  user: "kang",
  password: "rkdrkdtndnjffo",
  database: "kangchangrae",
};

let db;

const connectDb = () => {
  db = mysql.createConnection(dbConfig);

  db.connect((error) => {
    if (error) {
      console.error("MySQL Connect Error", error);
      setTimeout(connectDb, 2000);
    } else {
      console.log("MySQL Connect Success.");
    }
  });

  db.on("error", (error) => {
    console.error("MySQL Connect Error:", error);
    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      connectDb();
    } else {
      throw error;
    }
  });
};

connectDb();

module.exports = db;
