// create the express server here

require("dotenv").config();


const express = require("express");
const cors = require('cors');
const morgan = require("morgan");
// const client = require('./')

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const apiRouter = require("./api");
app.use("/api", apiRouter);


app.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});


const client = require('./db/index');
client.connect();
const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`CORS-enabled web server listening on port`, PORT);
})