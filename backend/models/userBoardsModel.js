const mongoose = require('mongoose');


function generateBoardUrlID() {
    let boardUrlID = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 7; i++) {
        boardUrlID += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return boardUrlID;
}


function generateBoardNameUrl(boardName) {

    if (!boardName) return;
    if (typeof boardName !== 'string') {
        boardName = boardName.toString();
    }
    return boardName
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-");
}


const subtasksSchema = new mongoose.Schema({
    subtaskTitle: { type: String, required: true },
    subtaskDone: { type: Boolean, default: false },
});

const tasksSchema = new mongoose.Schema({
    taskTitle: { type: String },
    description: { type: String },
    subtasks: { type: [subtasksSchema] },
});

const colsSchema = new mongoose.Schema({
    colTitle: { type: String },
    tasks: { type: [tasksSchema] }
});

const boardsSchema = new mongoose.Schema({
    boardName: {
        type: String, required: true, set: function (value) {
            this.boardNameUrl = generateBoardNameUrl(value);
            return value;
        }
    },
    cols: { type: [colsSchema], default:[]}, // TO DO: if issue, revert back to required: true, omit default
    boardUrlID: { type: String, unique: true, default: generateBoardUrlID },
    boardNameUrl: { type: String,  default: generateBoardNameUrl },

});

const userBoardsSchema = new mongoose.Schema({
    displayName: { type: String, unique: true, required: true },
    fbaseUID: { type: String, required: true, unique: true },
    boards: { type: [boardsSchema], validate: {
        validator: function(v,x,z) {
            return !(this.boards.length > 8);  
        }, 
        message: props => `Maximum boards allowed: 8.`
      }, required: true },
    createdAt: { type: Date, default: Date.now }
});

const userBoard = mongoose.model('userBoard', userBoardsSchema, 'user_boards');
module.exports = userBoard;