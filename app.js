const db = require("./db.js");

async function saveUser() {
  const insertQuery =
    "INSERT INTO users (user_id, username, password, email) VALUES (?, ?, ?, ?)";
  const values = ["crkang", "kang", "Covi@2020", "crkang@covision.co.kr"];

  try {
    await new Promise((resolve, reject) => {
      db.query(insertQuery, values, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
    console.log("User saved successfully.");
  } catch (error) {
    console.error("Error saving user:", error);
  }
}

saveUser();
