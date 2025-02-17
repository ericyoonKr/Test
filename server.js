const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// ✅ 기본 CSV 파일 경로
const filePath = path.join(__dirname, "소프트웨어학과_시간표.csv");

// ✅ 서버 시작 시 CSV 파일 존재 여부 확인
if (!fs.existsSync(filePath)) {
    console.error("🚨 CSV 파일이 없습니다: 소프트웨어학과_시간표.csv");
    process.exit(1); // 파일이 없으면 서버 종료
}

// ✅ 정적 파일 제공 (index.html, CSS 등)
app.use(express.static("public"));

// ✅ CSV 데이터 제공 API (웹사이트에서 사용)
app.get("/timetable", (req, res) => {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("파일을 읽는 중 오류 발생");
        }

        const tableData = data.split("\n").map(row => row.split(","));
        res.json({ timetable: tableData });
    });
});

// ✅ 서버 실행
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});
