const express = require('express')
const app = express()

require('dotenv').config()
const morgan = require('morgan')
const mongoose = require('mongoose')
const expressJwt = require('express-jwt')
// check if owner when making changes
const PORT = process.env.PORT || 6350


app.use(express.json())
app.use(morgan('dev'))
app.use("/api", expressJwt({secret: process.env.SECRET}))
// middleware for owner check

mongoose.connect('mongodb://localhost:27017/matthew-sweetness', {useNewUrlParser: true}, () => {
    console.log('[o] Connected to the DB')
})

app.use("/auth", require('./routes/authRoutes.js'))
app.use("/api/appointment", require('./routes/appointmentRoutes.js'))
app.use("/appointment", require('./routes/appointmentRoutes.js'))

app.use((err, req, res, next) => {
    console.log(err)
    if (err.name === "UnauthorizedError"){
        res.status(err.status)
    }
    return res.send({errMsg: err.message})
})

app.listen(PORT, () => {
    console.log(`[+] Server is running on PORT ${PORT}`)
})