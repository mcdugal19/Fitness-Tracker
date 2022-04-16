// create the express server here

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const client = require("./db/client");
// const res = require("express/lib/response");
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

const apiRouter = require("./api");
app.use("/api", apiRouter);

// const client = require("./db/index");c

const { PORT = 3000 } = process.env;

app.use((error, req, res, next) => {
  if(res.statusCode < 400)
  res.status(500);
  res.send({ error: error.message,
    name: error.name,
    message: error.message,
    table: error.table,
   });
});

client.connect();
app.listen(PORT, () => {
  console.log(`CORS-enabled web server listening on port`, PORT);
});
