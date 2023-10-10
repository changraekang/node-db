const db = require('../db.js');
const { createClient } = require("redis");

let client;

async function run() {
    client = createClient();

    client.on("error", (err) => console.log("Redis Client Error", err));

    try {
        await client.connect();
        console.log("Connected to Redis");

        await save();
    } catch (err) {
        console.error("Could not connect to Redis:", err);
    }
}

async function save() {
    const now = new Date();

    for (let i = 0; i < 86400; i++) {
        const time = new Date(now);
        time.setSeconds(now.getSeconds() + i);
        const value = time.toISOString().split('T')[1].split('.')[0];

        await client.rPush('covi-back', value);

        const length = await client.lLen('covi-back');
        if (length === 100) {
            const items = await client.lRange('covi-back', 0, 99);
            const combinedItems = items.join(","); // 1000개의 아이템을 하나의 문자열로 조인
            await insertToDB(combinedItems);
            await client.rPush('covi-back-array', combinedItems);
            await client.lTrim('covi-back', 100, -1);
        }
    }

    client.quit();
}

async function insertToDB(combinedItems) {
    console.log(combinedItems, ":: DB row")
    const query = "INSERT INTO covision (covisionName) VALUES (?)";

    try {
        await db.query(query, [combinedItems]);
    } catch (error) {
        console.error("Error inserting into database:", error);
    }
}

run();
