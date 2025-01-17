const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 2686;

app.use(cors({
  origin: '*',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Range', 'Content-Type', 'Accept', 'Origin']
}));



const path = require('path'); 

const videoFileMap = {
  'The Fast and Furious': path.resolve(__dirname, 'videos', 'the-fast-and-furious.mp4'),
  '2 Fast 2 Furious': path.resolve(__dirname, 'videos', '2-fast-furious.mp4'),
  'The Fast and Furious: Tokyo Drift': path.resolve(__dirname, 'videos', 'tokyo-drift.mp4'),
  'Fast and Furious': path.resolve(__dirname, 'videos', 'fast-furious-4.mp4'),
  'Fast Five': path.resolve(__dirname, 'videos', 'fast-5.mp4'),
  'Fast and Furious 6': path.resolve(__dirname, 'videos', 'fast-furious-6.mp4'),
  'Furious 7': path.resolve(__dirname, 'videos', 'furious-7.mp4'),
  'The Fate of the Furious': path.resolve(__dirname, 'videos', 'furious-8.mp4'),
  'F9': path.resolve(__dirname, 'videos', 'fast-furious-9.mp4'),
  'Fast X': path.resolve(__dirname, 'videos', 'fast-x.mp4'),
};

app.get('/videos/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = videoFileMap[filename];

    if (!filePath) {
        return res.status(404).send('File Not Found');
    }

    try {
        const stat = fs.statSync(filePath); // Ensure the file exists
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            if (start >= fileSize || start < 0 || end >= fileSize) {
                return res.status(416).send('Requested range not satisfiable');
            }

            const chunkSize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(200, head);
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});