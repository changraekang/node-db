const mysql = require("mysql2");
// Check if the environment is local (development) and load dotenv

const dbConfig = {
  host: "database-1.cax59lekyebg.ap-northeast-2.rds.amazonaws.com",
  user: "lckfantasy",
  password: "asdasd",
  database: "lckfantasy",
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
