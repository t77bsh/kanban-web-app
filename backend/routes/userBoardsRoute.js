const express = require("express");
const userBoardsRouter = express.Router();
const userBoard = require("../models/userBoardsModel");

userBoardsRouter.post("/user_boards", async (req, res) => {
    const existingUser = await userBoard.findOne({ fbaseUID: req.body.fbaseUID });
    if (existingUser) {
        res.status(409).json({ error: "User exists" });
    } else {
        try {
            await userBoard.create(req.body);
        } catch (err) {
            res.status(409).json({ error: err });
            console.log(err);
        }
    };
});


userBoardsRouter.get("/user_boards/:uid", async (req, res) => {
    try {
        const requestedUserDoc = await userBoard.findOne({ fbaseUID: req.params.uid });
        res.json(requestedUserDoc);
        console.log(req.params.uid)
    } catch (err) {
        res.status(409).json({ error: err });
        console.log(err);
    }
});

// 
userBoardsRouter.get("/user_boards/:uid/:boardUrlID", async (req, res) => {
    try {
        const requestedUserDoc = await userBoard.findOne({ fbaseUID: req.params.uid });
        const board = requestedUserDoc.boards.find((board) => board.boardUrlID === req.params.boardUrlID);
        console.log(board);
        res.json(board);
    } catch (err) {
        res.status(409).json({ error: err });
        console.log(err);
    }
});

userBoardsRouter.get("/:uid/boards/:boardUrlID", async (req, res) => {
    try {
        const requestedBoard = await userBoard.findOne({ fbaseUID: req.params.uid, boards: { $elemMatch: { boardUrlID: req.params.boardUrlID } } }, { 'boards.$': 1 });
        res.json(requestedBoard.boards[0]);
    } catch (err) {
        res.status(409).json({ error: err });
        console.log(err);
    }
});

// Add a new board to a user's array of boards
userBoardsRouter.patch("/user_boards/add-board/:uid", async (req, res) => {
    try {
        const doc = await userBoard.findOne({ fbaseUID: req.params.uid });

        if (!doc) {
            return res.status(404).json({ error: "No boards found." });
        }

        if (doc.boards.length >= 8) {
            return res.status(400).json({ error: "Maximum boards allowed: 8" });
        }

        const updatedDoc = await userBoard.findOneAndUpdate(
            { fbaseUID: req.params.uid },
            { $push: { boards: req.body } },
            { new: true }
        );
        res.json(updatedDoc);
    } catch (err) {
        res.status(409).json({ error: err });
        console.log(err);
    }
});


// Update a board's name
userBoardsRouter.patch("/user_boards/update-board-name/:uid/:boardUrlID", async (req, res) => {
    try {
        const updatedDoc = await userBoard.findOneAndUpdate({ fbaseUID: req.params.uid, "boards.boardUrlID": req.params.boardUrlID }, {
            $set: {
                "boards.$.boardName": req.body.boardName,
                "boards.$.boardNameUrl": req.body.boardNameUrl,
            },
        }, { new: true });

        res.json(updatedDoc.boards.find(board => board.boardUrlID === req.params.boardUrlID));
    } catch (err) {
        res.status(409).json({ error: err });
        console.log(err);
    }
});

// Delete a board from a user's array of boards
userBoardsRouter.patch("/user_boards/delete-board/:uid/:boardUrlID", async (req, res) => {
    try {
        const updatedDoc = await userBoard.findOneAndUpdate({ fbaseUID: req.params.uid }, {
            $pull: {
                boards: { boardUrlID: req.params.boardUrlID },
            },
        }, { new: true });
        res.json(updatedDoc);
    } catch (err) {
        res.status(409).json({ error: err });
        console.log(err);
    }
});
// Delete a task from a column's array of tasks
userBoardsRouter.delete("/user_boards/delete-task/:uid/:boardUrlID/:colIndex/:taskIndex", async (req, res) => {
    try {
        let user = await userBoard.findOne({ fbaseUID: req.params.uid });
        let board = user.boards.find(board => board.boardUrlID === req.params.boardUrlID);
        let col = board.cols[req.params.colIndex];
        col.tasks.splice(req.params.taskIndex, 1);
        await user.save();
        res.status(200).send("Task deleted successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});

// Add a column to specified board's array of columns
userBoardsRouter.patch("/user_boards/add-col/:uid/:boardUrlID", async (req, res) => {
    try {
        const updatedDocument = await userBoard.findOneAndUpdate(
            { fbaseUID: req.params.uid, "boards.boardUrlID": req.params.boardUrlID },
            { $push: { "boards.$[board].cols": req.body } },
            { new: true, arrayFilters: [{ "board.boardUrlID": req.params.boardUrlID }] }
        );
        res.json(updatedDocument.boards.find(board => board.boardUrlID === req.params.boardUrlID).cols);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Update a column's name

userBoardsRouter.patch("/user_boards/update-col-name/:uid/:boardUrlID/:colID", async (req, res) => {
    try {
        await userBoard.findOneAndUpdate(
            { fbaseUID: req.params.uid },
            { $set: { "boards.$[board].cols.$[col].colTitle": req.body.colTitle } },
            { new: true, arrayFilters: [{ "board.boardUrlID": req.params.boardUrlID }, { "col._id": req.params.colID }] }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Delete a column from specified board's array of columns
userBoardsRouter.patch("/user_boards/delete-col/:uid/:boardUrlID/:colID", async (req, res) => {
    try {
        await userBoard.findOneAndUpdate(
            { fbaseUID: req.params.uid },
            { $pull: { "boards.$[board].cols": { _id: req.params.colID } } },
            { new: true, arrayFilters: [{ "board.boardUrlID": req.params.boardUrlID }] }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Update columns after drag and drop reodering of tasks
userBoardsRouter.patch("/user_boards/update-cols/:uid/:boardUrlID", async (req, res) => {
    try {
        const updatedDocument = await userBoard.findOneAndUpdate(
            { fbaseUID: req.params.uid, "boards.boardUrlID": req.params.boardUrlID },
            { $set: { "boards.$[board].cols": req.body } },
            { new: true, arrayFilters: [{ "board.boardUrlID": req.params.boardUrlID }] }
        );
        res.json(updatedDocument.boards.find(board => board.boardUrlID === req.params.boardUrlID).cols);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});



// Add a task to specified column's array of tasks
userBoardsRouter.patch("/user_boards/add-task/:uid/:boardUrlID/:colID", async (req, res) => {
    try {
        const updatedDocument = await userBoard.findOneAndUpdate(
            { fbaseUID: req.params.uid, "boards.boardUrlID": req.params.boardUrlID, "boards.cols._id": req.params.colID },
            { $push: { "boards.$[board].cols.$[col].tasks": req.body } },
            { new: true, arrayFilters: [{ "board.boardUrlID": req.params.boardUrlID }, { "col._id": req.params.colID }] }
        );
        res.json(updatedDocument);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Update a task from a specified task
userBoardsRouter.patch("/user_boards/update-task/:uid/:boardUrlID/:colID/:taskIdx", async (req, res) => {
    try {
        const updatedDocument = await userBoard.findOneAndUpdate(
            { fbaseUID: req.params.uid },
            { $set: { [`boards.$[board].cols.$[col].tasks.${req.params.taskIdx}`]: req.body } },
            { new: true, arrayFilters: [{ "board.boardUrlID": req.params.boardUrlID }, { "col._id": req.params.colID }] }
        );
        res.json(updatedDocument);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Delete a task from a specified column's array of tasks by index

// userBoardsRouter.patch("/user_boards/delete-task/:uid/:boardUrlID/:colIdx/:taskIdx", async (req, res) => {
//     try {
//         await userBoard.findOneAndUpdate(
//             { fbaseUID: req.params.uid },
//             { $pull: { [`boards.$[board].cols.${req.params.colIdx}.tasks`]: { $in: [req.params.taskIdx] } } },
//             { new: true, arrayFilters: [{ "board.boardUrlID": req.params.boardUrlID },] }
//         );
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: err.message });
//     }
// });

// userBoardsRouter.delete('/user_boards/delete-task/:uid/:boardUrlID/:colIdx/:taskIdx', async (req, res) => {
//   try {
//     const user = await userBoard.findOne({ fbaseUID: req.params.uid });

//     const board = user.boards.find(board => board.boardUrlID === req.params.boardUrlID);

//     if (!board) return res.status(404).send('Board not found');

//     const col = board.cols[req.params.colIdx];

//     if (!col) return res.status(404).send('Column not found');

//     const task = col.tasks[req.params.taskIdx];

//     if (!task) return res.status(404).send('Task not found');

//     col.tasks.splice(req.params.taskIdx, 1);

//     await user.save();

//     res.send('Task deleted successfully');

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// });




// userBoardsRouter.patch("/user_boards/add-task/:uid/:boardUrlID/:index", async (req, res) => {
//     try {
//         const updatedDocument = await userBoard.findOneAndUpdate(
//             { fbaseUID: req.params.uid, "boards.boardUrlID": req.params.boardUrlID },
//             { $push: { `boards.$[board].cols.$${req.params.index}.tasks`: req.body } },
//             { new: true, arrayFilters: [{ "board.boardUrlID": req.params.boardUrlID }] }
//         );
//         res.json(updatedDocument);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: err.message });
//     }
// });

// Delete a task from specified board's column's array of tasks
// userBoardsRouter.patch("/user_boards/delete-task/:uid/:boardUrlID/:colIdx/:taskIdx", async (req, res) => {
//     try {
//         const updatedDocument = await userBoard.findOneAndUpdate(
//             { fbaseUID: req.params.uid, "boards.boardUrlID": req.params.boardUrlID, "boards.cols._id": req.params.colID },
//             { $pull: { "boards.$[board].cols.$[col].tasks": { _id: req.params.taskID } } },
//             { new: true, arrayFilters: [{ "board.boardUrlID": req.params.boardUrlID }, { "col._id": req.params.colID }] }
//         );
//         res.json(updatedDocument);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: err.message });
//     }
// });



module.exports = userBoardsRouter;