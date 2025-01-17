const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 2686;

app.use(cors({
  origin: ['http://localhost:5173', 'https://fast-and-furious-9bnf.vercel.app'],
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Range', 'Content-Type', 'Accept', 'Origin']
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static("/public"));

const videoFileMap = {
  'The Fast and Furious': 'videos/the-fast-and-furious.mp4',
  '2 Fast 2 Furious': 'videos/2-fast-furious.mp4',
  'The Fast and Furious: Tokyo Drift': 'videos/tokyo-drift.mp4',
  'Fast and Furious': 'videos/fast-furious-4.mp4',
  'Fast Five': 'videos/fast-5.mp4',
  'Fast and Furious 6': 'videos/fast-furious-6.mp4',
  'Furious 7': 'videos/furious-7.mp4',
  'The Fate of the Furious': 'videos/furious-8.mp4',
  'F9': 'videos/fast-furious-9.mp4',
  'Fast X': 'videos/fast-x.mp4',
};

app.get('/videos/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const relativeFilePath = videoFileMap[filename];

  if (!relativeFilePath) {
    return res.status(404).send('File Not Found');
  }

  const filePath = path.join(__dirname, 'public', relativeFilePath);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File Not Found');
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const parts = range.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

  if (start >= fileSize || end >= fileSize || start > end) {
    return res.status(416).send('Requested range not satisfiable');
  }

  const chunkSize = (end - start) + 1;
  const fileStream = fs.createReadStream(filePath, { start, end });

  const head = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'video/mp4',
  };

  res.writeHead(206, head);
  fileStream.pipe(res);
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
