// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router

const express = require("express");
const { getUserById } = require("../db/users");
const { JWT_SECRET } = process.env;

const apiRouter = express.Router();
// require("dotenv").config();

const jwt = require("jsonwebtoken");

apiRouter.use(async (req, res, next) => {
    const prefix = "Bearer ";
    const auth = req.header("Authorization");
  
    if (!auth) {
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
  
      try {
        const { id } = jwt.verify(token, JWT_SECRET);
  
        if (id) {
          req.user = await getUserById(id);
          next();
        }
      } catch ({ name, message }) {
        next({ name, message });
      }
    } else {
      next({
        name: "AuthorizationHeaderError",
        message: `Authorization token must start with ${prefix}`,
      });
    }
  });


apiRouter.get("/health", (req, res, next) => {
  res.send({ message: "Server is healthy..." });
  next();
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);
const activitiesRouter = require("./activities");
apiRouter.use('/activities', activitiesRouter);
const routinesRouter = require("./routines");
apiRouter.use('/routines', routinesRouter);


// apiRouter.use((error, req, res, next) => {
//   res.send({
//     name: error.name,
//     message: error.message,
//   });
// });

module.exports = apiRouter;
