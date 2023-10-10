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

        await client.rpush('covi-back', value);

        const length = await client.llen('covi-back');
        if (length === 1000) {
            const items = await client.lrange('covi-back', 0, 999); // 처음부터 999번째 아이템까지 가져옵니다.
            await client.rpush('covi-back-array', JSON.stringify(items)); // 배열을 문자열로 변환하여 저장
            await client.ltrim('covi-back', 1000, -1); // 처음 1000개 아이템 제거
        }
    }

    // 리스트 추가 완료 후 Redis 연결 종료
    client.quit();
}

// run 함수 호출로 프로그램 시작
run();
