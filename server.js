const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

// 정적 파일 제공 (index.html 등)
app.use(express.static("public"));

// 기본 루트 라우트
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// 서버 실행
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});
