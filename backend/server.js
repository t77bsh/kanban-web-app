const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
require('./db');
const crypto = require("crypto");

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api', require('./routes/usersRoute'));
app.use('/api', require('./routes/userBoardsRoute'));

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server listening on port " + port)
});