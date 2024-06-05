const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const validUrl = require('valid-url');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const app = express();

// Enable CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle YouTube download
app.get('/download', async (req, res) => {
    try {
        const URL = req.query.URL;

        if (!URL) {
            return res.status(400).send('URL parameter is required');
        }

        if (!validUrl.isUri(URL)) {
            return res.status(400).send('Invalid URL');
        }

        if (!ytdl.validateURL(URL)) {
            return res.status(400).send('Invalid YouTube URL');
        }

        const info = await ytdl.getInfo(URL);
        const title = info.videoDetails.title;
        const filename = `${title}.mp3`;

        res.header('Content-Disposition', `attachment; filename="${filename}"`);

        const stream = ytdl(URL, {
            quality: 'highestaudio',
            filter: 'audioonly'
        });

        // Compress and limit the size of the audio file using ffmpeg
        ffmpeg(stream)
            .audioBitrate(128)
            .format('mp3')
            .on('end', () => {
                console.log('File has been converted successfully');
            })
            .on('error', (err) => {
                console.error('Error converting file:', err);
                res.status(500).send('Error downloading the video');
            })
            .pipe(res, { end: true });

    } catch (error) {
        console.log(error);
        res.status(500).send('An unexpected error occurred');
    }
});

// Start the server
app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});
