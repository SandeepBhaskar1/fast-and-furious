const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const videoFileMap = {
    'The Fast and Furious': 'the-fast-and-furious.mp4',
    '2 Fast 2 Furious': '2-fast-furious.mp4',
    'The Fast and Furious: Tokyo Drift': 'tokyo-drift.mp4',
    'Fast and Furious': 'fast-furious-4.mp4',
    'Fast Five': 'fast-5.mp4',
    'Fast and Furious 6': 'fast-furious-6.mp4',
    'Furious 7': 'furious-7.mp4',
    'The Fate of the Furious': 'furious-8.mp4',
    'F9': 'fast-furious-9.mp4',
    'Fast X': 'fast-x.mp4',
  };

  const { filename } = req.query;

  if (!filename || !videoFileMap[filename]) {
    return res.status(404).send('Video not found');
  }

  const videoPath = path.join(__dirname, '../public/videos', videoFileMap[filename]);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('File not found');
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

  const parts = range.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

  if (start >= fileSize || end >= fileSize || start > end) {
    return res.status(416).send('Requested range not satisfiable');
  }

  const chunkSize = (end - start) + 1;
  const fileStream = fs.createReadStream(videoPath, { start, end });

  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'video/mp4',
  });
  fileStream.pipe(res);
};
