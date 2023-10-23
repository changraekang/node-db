const db = require("./db.js");

async function saveUser() {
  const insertQuery =
    "INSERT INTO users (user_id, username, password, email) VALUES (?, ?, ?, ?)";
  const values = ["test2", "test2", "Covi@2020", "test2@covision.co.kr"];

  try {
    await db.execute(insertQuery, values);
    console.log("User saved successfully.");
  } catch (error) {
    console.error("Error saving user:", error);
  }
}

saveUser();
