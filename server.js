const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const logger = require('morgan');

const rfs = require('rotating-file-stream');
const fs = require('fs');

const app = express();

// ENV Config
dotenv.config({path: path.resolve(__dirname, 'client/config/.env.' + process.env.NODE_ENV)});

// Ensure log directory exists
let dirLog = path.join(__dirname, './logs');
fs.existsSync(dirLog) || fs.mkdirSync(dirLog)

// Create a rotating write stream
let accessLogStream = rfs.createStream('access.log', {
	interval: '1d', // rotate daily
	path: dirLog
});

// Setup the logger
app.use(logger('combined', {stream: accessLogStream}));

// Allow Cross-Origin
app.use(cors())

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));