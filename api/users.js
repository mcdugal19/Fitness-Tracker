const { requireUser } = require("./utils");
const express = require("express");
const apiRouter = express.Router();
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { createUser, getUserByUsername, getUserById } = require("../db");
const { JWT_SECRET } = process.env;
usersRouter.use((req, res, next) => {
  console.log("Request from users");
  next();
});

usersRouter.get("/me", async (req, res, next) => {
  const userId = req.user.id;
  const user = await getUserById(userId);
  next({ user });
});

// usersRouter.post("/register", async (req, res, next) => {
//   const { username, password } = req.body;
//   const existingUser = await getUserByUsername({ username });
//   try {
//     if (password.length < 8) {
//       res.status(401);
//       next({
//         name: "Password Error",
//         message: "Password must be longer than 8 characters",
//       });
//     } else if (existingUser) {
//       res.status(401);
//       next({
//         name: "User Exists Error",
//         message: "This User already exists",
//       });
//     } else {
//       const newUser = await createUser({ username, password });
//       res.send({ user });
//     }
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (password.length < 8) {
      res.status(401);
      next({
        name: "Password Error",
        message: "Password must be longer than 8 characters",
      });
    }
    const _user = await getUserByUsername(username);

    if (_user) {
      throw new Error("duplicate");
      res.status(401);
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    }

    const user = await createUser({
      username,
      password,
    });

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

    res.send({
      message: "thank you for signing up",
      token,
      user,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
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
      // create token & return to user
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

module.exports = usersRouter;
