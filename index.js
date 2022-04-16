// create the express server here

require("dotenv").config();
const { PORT = 3000 } = process.env;
const express = require("express")
const cors = require('cors')
const morgan = require("morgan");
const app = express()

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    const token = req.header('token')
    console.log('TOKEN->', token)
    if(!token){
        res.status(404).send('You are un-authorized!')
        return
    }
})

const appRouter = require("./api");
app.use("/api", appRouter);


app.use((error, req, res, next) => {
    res.send({ success: false, message: error.message })
})

app.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });

// app.get('*', (req, res, next) => {
//   res.status(404).send("Sorry, we could'nt find that route!")
// })


app.listen(PORT, () => {
  console.log(`CORS-enabled web server listening on port`, PORT);
})