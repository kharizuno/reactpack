const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const app = express();

// ENV Config
dotenv.config({path: path.resolve(__dirname, 'client/config/.env.' + process.env.NODE_ENV)});

// Allow Cross-Origin
app.use(cors())

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));