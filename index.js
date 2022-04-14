// create the express server here
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    const token = req.header('token')
    console.log('TOKEN->', token)
    if(!token){
        res.status(404).send('You are un-authorized!')
        return
    }
})

app.use('/users', require('../api/users'))

app.use((error, req, res, next) => {
    res.send({ success: false, message: error.message })
})

app.get('*', function (req, res, next) {
  res.status(404).send("Sorry, we could'nt find that route!")
})

app.listen(PORT, function () {
  console.log(`CORS-enabled web server listening on port ${PORT}`)
})