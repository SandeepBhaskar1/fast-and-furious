const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 2686;

app.use(cors({
  origin: ["https://fast-and-furious-frontend.vercel.app", "http://localhost:5174"],
  option: ["GET", "POST", "OPTION"]
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/video/:filename', (req, res) => {
  const { filename } = req.params;
  const videoPath = path.join(__dirname, 'public', 'videos', filename);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video not found');
  }
  
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    });
    fs.createReadStream(videoPath).pipe(res);
    return;
  }

  const [start, end] = range.replace(/bytes=/, '').split('-');
  const startByte = parseInt(start, 10);
  const endByte = end ? parseInt(end, 10) : fileSize - 1;
  const chunkSize = (endByte - startByte) + 1;

  if (startByte >= fileSize || endByte >= fileSize || startByte > endByte) {
    return res.status(416).send('Requested range not satisfiable');
  }

  res.writeHead(206, {
    'Content-Range': `bytes ${startByte}-${endByte}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'video/mp4',
  });

  const stream = fs.createReadStream(videoPath, { start: startByte, end: endByte });
  stream.pipe(res);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
