const express = require('express')
const appointmentTherapistRouter = express.Router()
const Appointment = require('../models/appointment.js')

appointmentTherapistRouter.route('/:id')
    .get((req, res, next) => {
        Appointment.find({
            therapistID: req.params.id,
            status: "Paid"
        },
            (err, foundAppointments) => {
            if (err){
                res.status(500)
                return next(err)
            }
            return res.status(200).send(foundAppointments)
        })
    })

module.exports = appointmentTherapistRouter;