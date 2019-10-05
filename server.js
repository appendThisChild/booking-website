const express = require('express')
const app = express()

require('dotenv').config()
const morgan = require('morgan')
const mongoose = require('mongoose')
const expressJwt = require('express-jwt')
const { checkIfOwner, checkIfTherapist, mongoURI, options } = require("./utils/app.js")
const PORT = process.env.PORT || 6350

app.use(express.json())
app.use(morgan('dev'))
app.use("/api", expressJwt({secret: process.env.SECRET}))
app.use("/api/owner", (req, res, next) => checkIfOwner(req, res, next))
app.use("/api/therapist", (req, res, next) => checkIfTherapist(req, res, next))


const conn = mongoose.connect(mongoURI, options)
conn.then(() => console.log('[o] Connected to the DB'), (err) => console.log(err))

// login portals
app.use("/auth", require('./routes/authRoutes.js'))
// personal info portal
app.use("/api/info", require('./routes/apiInfoRoutes.js'))
// booking structure portals
app.use("/therapists", require('./routes/therapistsRoutes.js'))
app.use("/api/therapists", require('./routes/apiTherapistsRoutes.js'))
// client portal
app.use("/api/appointment", require('./routes/appointmentRoutes.js'))
// therapist portal
app.use("/api/therapist", require('./routes/therapistRoutes.js'))
// owner portal
app.use("/api/owner", require('./routes/ownerRoutes.js'))
// image portal
app.use('/image', require('./routes/imageRoutes.js'))

app.use((err, req, res, next) => {
    console.log('Caught Error')
    console.log(err)
    if (err.name === "UnauthorizedError"){
        res.status(err.status)
    }
    return res.send({errMsg: err.message})
})

app.listen(PORT, () => {
    console.log(`[+] Server is running on PORT ${PORT}`)
})