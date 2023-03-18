const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

module.exports = db;