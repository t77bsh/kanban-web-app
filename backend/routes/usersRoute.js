const express = require("express");
const usersRouter = express.Router();
const User = require("../models/usersModel");


usersRouter.post("/users", async (req, res) => {
    const existingUser = await User.findOne({ fbaseUID: req.body.fbaseUID });
    if (existingUser) {
        res.status(409).json({ error: "User already exists" });
    } else {
        try {
            const dnExists = await User.findOne({ displayName: req.body.displayName });
            attempts = 0;
            while (dnExists) {
                attempts++;
                if (attempts <= 100) {
                    req.body.displayName += Math.floor(Math.random() * 10);
                } else if (100 < attempts <= 1000) {
                    req.body.displayName += Math.floor(Math.random() * 100);
                } else {
                    res.status(409).json({ error: "Unable to generate unique display name" });
                    return;
                }
                dnExists = await User.findOne({ displayName: req.body.displayName });
            }
            await User.create(req.body);
        } catch (err) {
            res.status(409).json({ error: err });
            console.log(err);
        }
    }
}
);

module.exports = usersRouter;