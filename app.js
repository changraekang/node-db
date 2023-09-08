const db = require("../db.js");

const { createClient } = require("redis");
let client; // 전역 변수로 설정

async function run() {
  client = createClient();

  client.on("error", (err) => console.log("Redis Client Error", err));

  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Could not connect to Redis:", err);
  }
}
async function save() {
  let init = 0;
  const q = "INSERT INTO covision (covisionName) VALUES (?)";

  try {
    const num = await client.lLen("mylist");

    if (num > init) {
      const value = await client.lRange("mylist", 0, init);
      init = init + 1;
      db.query(q, [value], (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return;
      });
      return console.log("Connected to Redis");
    } else {
      return console.log("Connected to Redis");
    }
  } catch (err) {
    console.log("Connected to Redis");
  }
}
save();
run();
