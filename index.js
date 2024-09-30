const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 8001;

app.use(cors());
app.use(bodyParser.json());

const corsOptions = {
  origin: 'https://llm.9seebird.site ', // 클라이언트의 주소를 명시
  credentials: true, // 자격 증명 허용
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello World! youtube-back'); // get 요청 시 Hello World! 출력
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
  console.log(__dirname);
});
