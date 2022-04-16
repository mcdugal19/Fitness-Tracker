const express = require("express");
const usersRouter = express.Router();
const { createUser, getUserByUsername } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    const existingUser = await getUserByUsername({ username });
    try {
        if (password.length < 8) {
            res.status(401);
            next({
                name: 'Password Error',
                message: 'Password must be longer than 8 characters',
            });
        } else if (existingUser) {
            res.status(401);
            next({
                name: 'User Exists Error',
                message: 'This User already exists',
            });
        } else {
            const newUser = await createUser({ username, password });
            res.send({ user });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});