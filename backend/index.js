const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 2686;

// Configure CORS more specifically
app.use(cors({
  origin: '*',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Range', 'Content-Type', 'Accept', 'Origin']
}));

const BACKEND_URL = 'https://fast-and-furious-puce.vercel.app';

const videoFileMap = {
    'The Fast and Furious': `${BACKEND_URL}/videos/the-fast-and-furious.mp4`,
    '2 Fast 2 Furious': `${BACKEND_URL}/videos/2-fast-furious.mp4`,
    'The Fast and Furious: Tokyo Drift': `${BACKEND_URL}/videos/tokyo-drift.mp4`,
    'Fast and Furious': `${BACKEND_URL}/videos/fast-furious-4.mp4`,
    'Fast Five': `${BACKEND_URL}/videos/fast-5.mp4`,
    'Fast and Furious 6': `${BACKEND_URL}/videos/fast-furious-6.mp4`,
    'Furious 7': `${BACKEND_URL}/videos/furious-7.mp4`,
    'The Fate of the Furious': `${BACKEND_URL}/videos/furious-8.mp4`,
    'F9': `${BACKEND_URL}/videos/fast-furious-9.mp4`,
    'Fast X': `${BACKEND_URL}/videos/fast-x.mp4`,
};

app.get('/videos/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = videoFileMap[filename];

    if (!filePath) {
        return res.status(404).send('File Not Found');
    }

    try {
        const stat = fs.statSync(filePath);
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
                'Access-Control-Allow-Origin': '*'
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
                'Access-Control-Allow-Origin': '*'
            };

            res.writeHead(200, head);
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});