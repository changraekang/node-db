const db = require('/home/ubuntu/db/db.js');
const { createClient } = require("redis");

let client; // 전역 변수로 설정

async function run() {
    client = createClient();

    client.on("error", (err) => console.log("Redis Client Error", err));

    try {
        await client.connect();
        console.log("Connected to Redis");

        // 연결이 완료된 후 save 함수 호출
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
        if (length === 1000) {
            const items = await client.lRange('covi-back', 0, 999); // 처음부터 999번째 아이템까지 가져옵니다.
            await client.rPush('covi-back-array', JSON.stringify(items)); // 배열을 문자열로 변환하여 저장
            await client.lTrim('covi-back', 1000, -1); // 처음 1000개 아이템 제거
             // DB에 저장
        await insertToDB(items);
        }
        
    }

    // 리스트 추가 완료 후 Redis 연결 종료
    client.quit();
}

async function insertToDB(items) {
    const query = "INSERT INTO covision (covisionName) VALUES (?)";

    for (const item of items) {
        try {
            await db.query(query, [item]); // db.js에서 query 기능이 제공되는 것으로 가정
        } catch (error) {
            console.error("Error inserting into database:", error);
        }
    }

    // 데이터를 DB에 저장한 후, Redis에서 해당 데이터 삭제
    await client.lTrim('covi-back-array', items.length, -1);
}


// run 함수 호출로 프로그램 시작
run();
