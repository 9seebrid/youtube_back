const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

const PORT = process.env.PORT || 8002; // 환경변수 PORT 사용
const API_URL = process.env.API_URL; // API_URL 환경변수 사용

app.use(
  cors({
    origin: API_URL, // 환경 변수로부터 API URL을 가져옴
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('youtube-back'); // get 요청 시 Hello World! 출력
});

app.post('/search', (req, res) => {
  const artistName = req.body.artist;

  // Python 스크립트를 실행하여 가수 정보를 가져옵니다.
  const pythonPath = path.join(__dirname, 'venv', 'bin', 'python3');
  const scriptPath = path.join(__dirname, 'search_artist.py');
  const pythonProcess = spawn(pythonPath, [scriptPath, artistName]);

  let resultData = '';

  // Python 스크립트에서 데이터를 받습니다.
  pythonProcess.stdout.on('data', (data) => {
    resultData += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.json(JSON.parse(resultData));
    } else {
      res.status(500).json({ error: 'Python script failed' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
