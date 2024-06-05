const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const validUrl = require('valid-url');

const app = express();

app.use(cors());
app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});
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

        res.header('Content-Disposition', 'attachment; filename="video.mp3"');

        ytdl(URL, {
            format: 'mp3',
            filter: 'audioonly'
        }).pipe(res).on('error', (err) => {
            res.status(500).send('Error downloading the video');
        });
    } catch (error) {
        console.log(error)
        res.status(500).send('An unexpected error occurred');
    }
});