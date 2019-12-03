const express = require('express')
const app = express()

require('dotenv').config()
const morgan = require('morgan')
const mongoose = require('mongoose')
// added this line below for deployment
const path = require('path')
const expressJwt = require('express-jwt')
const { checkIfOwner, checkIfTherapist, mongoURI, options } = require("./utils/app.js")
const PORT = process.env.PORT || 6350

app.use(express.json())
app.use(morgan('dev'))
app.use("/api", expressJwt({secret: process.env.SECRET}))
app.use("/api/owner", (req, res, next) => checkIfOwner(req, res, next))
app.use("/api/therapist", (req, res, next) => checkIfTherapist(req, res, next))
// added this line below for deployment
app.use(express.static(path.join(__dirname, "client", "build")))

const conn = mongoose.connect(process.env.MONGODB_URI || mongoURI, options)
conn.then(() => console.log('[o] Connected to the DB'), (err) => console.log(err))

// generalInfo
app.use('/generalInfo', require('./routes/generalInfoRoutes.js'))
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
// owner portals
app.use("/api/owner", require('./routes/ownerRoutes.js'))
app.use("/api/owner/generalInfo", require('./routes/ownerGeneralInfoRoutes.js'))
// image portal
app.use('/images', require('./routes/imageRoutes.js'))
// payment portal
app.use('/payment', require('./routes/stripeRoutes.js'))
// google portal
app.use('/api', require('./routes/googleCalendarRoutes.js'))
// email portal 
app.use('/email', require('./routes/emailRoutes.js'))
// reviews portal
app.use('/reviews', require('./routes/reviewRoutes.js'))
// password recovery
app.use('/recover', require('./routes/passwordRecoveryRoutes.js'))
// affiliate 
app.use('/affiliate', require('./routes/affiliateRoutes.js'))

app.use((err, req, res, next) => {
    console.log('Caught Error')
    console.log(err)
    if (err.name === "UnauthorizedError"){
        res.status(err.status)
    }
    return res.send({errMsg: err.message})
})
// added this line below for deployment
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html") )
})

app.listen(PORT, () => {
    console.log(`[+] Server is running on PORT ${PORT}`)
})