const express = require('express')
const app = express()

require('dotenv').config()
const morgan = require('morgan')
const mongoose = require('mongoose')
const expressJwt = require('express-jwt')
const { checkIfOwner, checkIfTherapist } = require("./utils/app.js")
const PORT = process.env.PORT || 6350


app.use(express.json())
app.use(morgan('dev'))
app.use("/api", expressJwt({secret: process.env.SECRET}))
app.use("/api/owner", (req, res, next) => checkIfOwner(req, res, next))
app.use("/api/therapist", (req, res, next) => checkIfTherapist(req, res, next))

mongoose.connect('mongodb://localhost:27017/matthew-sweetness', {
    useNewUrlParser: true, 
    useFindAndModify: false, 
    useCreateIndex: true 
}, () => { console.log('[o] Connected to the DB') })

app.use("/auth", require('./routes/authRoutes.js'))
// personal info portal
app.use("/api/info", require('./routes/apiInfoRoutes.js'))
// booking structure portals
app.use("/therapists", require('./routes/therapistsRoutes.js'))
app.use("/api/therapists", require('./routes/apiTherapistRoutes.js'))
// client portal
app.use("/api/appointment", require('./routes/appointmentRoutes.js'))
// therapist portal
app.use("/api/therapist/appointment", require('./routes/appointmentTherapistRoutes'))
// owner portal
app.use("/api/owner", require('./routes/ownerRoutes.js'))


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