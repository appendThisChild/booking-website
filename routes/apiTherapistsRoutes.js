const express = require('express')
const Appointment = require('../models/appointment.js')
const BlackoutDate = require('../models/blackoutDate.js')
const therapistRouter = express.Router()

// When client is using the backend for booking appointments

therapistRouter.route('/:id')
    .get((req, res, next) => {
        Appointment.find({
            therapistID: req.params.id,
            canceled: false
        }, 
            (err, foundAppointments) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const newerAppointments = foundAppointments.filter(arr => arr.appDate > new Date())
            const stillVaildApp = newerAppointments.filter(arr => arr.appointmentCreatedAt.setMinutes(arr.appointmentCreatedAt.getMinutes() + 10) > new Date() && arr.status === "Pending")
            const paidApp = newerAppointments.filter(arr => arr.status === "Paid")
            const apps = paidApp.concat(stillVaildApp)
            apps.forEach(app => {
                app.appointmentCreatedAt = null
                app.canceled = null
                app.clientID = null
                app.clientName = null
                app.status = null
                app.therapistID = null
                app.therapistName = null
                app.amount = null
                app.address = null
                app.packageChoice = null
            })
            return res.status(200).send(apps)
        })
    })

therapistRouter.route('/blackout/:id')
    .get((req, res, next) => {
        BlackoutDate.find({ therapistID: req.params.id },
            (err, foundBlackoutDates) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const futureDates = foundBlackoutDates.filter(arr => arr.blackoutDate > new Date())
            return res.status(200).send(futureDates)
        })
    })

module.exports = therapistRouter;