const { requireUser } = require("./utils");
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const {
  createUser,
  getUserByUsername,
  getUserById,
  getPublicRoutinesByUser,
} = require("../db");
const { JWT_SECRET } = process.env;

usersRouter.use((req, res, next) => {
  console.log("Request from users");
  next();
});

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (password.length >= 8) {
      const _user = await getUserByUsername(username);
      console.log('_user: ', _user)
      if (!_user) {
        const user = await createUser({ username, password });
            console.log('user: create: ', user)
        const token = jwt.sign(
          {
            id: user.id,
            username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1w",
          }
        );
        console.log('token from Users: ', token)
        res.send({
          message: "thank you for signing up",
          token,
          user,
        });
      } else {
          next({name: "Username Taken", message: "Username already exists"})
      }
    } else {
        next({name: "Password too short", message: "Password must be 8 characters or longer"})
    }
  } catch ( error ) {
    next( error );
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status = 400;
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);
    console.log("user", user);
    if (user && user.password == password) {
      const token = jwt.sign(
        { username: username, id: user.id },
        process.env.JWT_SECRET
      );
      res.send({ message: "you're logged in!", token: token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.get("/me", requireUser, async (req, res, next) => {
    try {
        const user = await getUserById(req.user.id);
        res.send(user);
    } catch (error) {
        next(error);
    }
});

usersRouter.get("/:username/routines", async (req, res, next) => {
    const { username } = req.params
  try {
    const userRoutines = await getPublicRoutinesByUser({ username });
    res.send( userRoutines );
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
