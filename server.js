const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 8080;

// 업로드된 CSV 파일 저장 경로
const uploadDir = path.join(__dirname, "uploads");
const filePath = path.join(uploadDir, "timetable.csv");

// 📌 ✅ [1] 서버 시작 시 기본 CSV 파일이 없으면 자동 생성
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

if (!fs.existsSync(filePath)) {
    console.log("📌 기본 CSV 파일 생성: timetable.csv");
    fs.writeFileSync(filePath, "요일,시간,과목명,교수명,강의실\n월요일,09:00,자료구조,김교수,101호\n화요일,10:00,운영체제,이교수,202호");
}

// 📌 ✅ [2] CSV 파일 업로드 API (관리자가 새 파일 업로드 가능)
const upload = multer({ dest: uploadDir });

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("파일이 업로드되지 않았습니다.");
    }

    const tempPath = req.file.path;
    fs.rename(tempPath, filePath, (err) => {
        if (err) return res.status(500).send("파일 저장 중 오류 발생");
        res.send("✅ CSV 파일이 성공적으로 업로드되었습니다.");
    });
});

// 📌 ✅ [3] CSV 데이터 제공 API (웹사이트에서 사용)
app.get("/timetable", (req, res) => {
    if (!fs.existsSync(filePath)) {
        return res.status(404).send("CSV 파일이 존재하지 않습니다.");
    }

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("파일을 읽는 중 오류 발생");
        }

        const tableData = data.split("\n").map(row => row.split(","));
        res.json({ timetable: tableData });
    });
});

// 서버 실행
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});
