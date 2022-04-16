// create the express server here

require("dotenv").config();
const { PORT = 3000 } = process.env;

const express = require("express")
const cors = require('cors')
const app = express();
const appRouter = require("./api");
const morgan = require("morgan");



app.use(morgan("dev"));
app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

app.use("/api", appRouter);

// app.use((req, res, next) => {
//     const token = req.header('token')
//     console.log('TOKEN->', token)
//     if(!token){
//         res.status(404).send('You are un-authorized!')
//         return
//     }
// })

// app.use((error, req, res, next) => {
//     res.send({ success: false, message: error.message })
// })

const client = require('./db/client');
client.connect();

app.listen(PORT, () => {
  console.log(`CORS-enabled web server listening on port`, PORT);
})