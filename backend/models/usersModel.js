const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    displayName: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    surname: { type: String || null },
    loginProvider: { type: String, enum: ['email', 'google', 'facebook'], required: true },
    email: { type: String, required: true, unique: true },
    fbaseUID: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', usersSchema, 'users');
module.exports = User