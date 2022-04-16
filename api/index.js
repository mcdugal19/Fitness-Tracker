// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router



const { getUserById } = require("../db/users");
const { JWT_SECRET } = process.env;
const express = require("express");
const appRouter = express.Router();
const jwt = require("jsonwebtoken");

appRouter.get('/health', (req, res, next)=> {
    res.send({ message: 'Server is healthy...'});
});

const usersRouter = require('./users');
appRouter.use('/users', usersRouter);




// appRouter.use(async (req, res, next) => {
//     const prefix = "Bearer ";
//     const auth = req.header("Authorization");

//     if (!auth) {
//         next();
//     } else if (auth.startsWith(prefix)) {
//         const token = auth.slice(prefix.length);

//         try {
//             const { id } = jwt.verify(token, JWT_SECRET);

//             if (id) {
//                 req.user = await getUserById(id);
//                 next();
//             }
//         } catch ({ name, message }) {
//             next({ name, message });
//         }
//     } else {
//         next({
//             name: "AuthorizationHeaderError",
//             message: `Authorization token must start with ${prefix}`,
//         });
//     }
// });

// appRouter.use((req, res, next) => {
//     if (req.user) {
//         console.log("user is set:", req.user);
//     }
//     next();
// });

module.exports = appRouter;