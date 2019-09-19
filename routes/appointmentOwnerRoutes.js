const express = require('express')
const appointmentOwnerRouter = express.Router()
const Appointment = require('../models/appointment.js')

appointmentOwnerRouter.route('/')
    .get((req, res, next) => {
        Appointment.find((err, foundAppointments) => {
            if (err){
                res.status(500)
                return next(err)
            }
            return res.status(200).send(foundAppointments)
        })
    })

module.exports = appointmentOwnerRouter;