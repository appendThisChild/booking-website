const express = require('express')
const appointmentRouter = express.Router()
const Appointment = require('../models/appointment.js')
const User = require('../models/user.js')
const react_secret = process.env.REACT_APP_SECRET

appointmentRouter.route('/')
    .post((req, res, next) => {
        const newAppointment = new Appointment(req.body)
        newAppointment.save((err, newAppointmentObj) => {
            if (err){
                res.status(500)
                return next(err)
            }
            return res.status(201).send({app: newAppointmentObj, key: react_secret})
        })
    })


// Here
appointmentRouter.route('/present/:id')
    .post((req, res, next) => {
        const { month, year } = req.body
        Appointment.find({
            clientID: req.params.id,
            status: "Paid"
        }, 
            (err, foundAppointments) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const today = new Date()
            const apps = foundAppointments.filter(arr => arr.appDate.getMonth() === month && arr.appDate.getFullYear() === year && arr.appDate > today)
            apps.sort((app1, app2) => app1.appDate - app2.appDate)
            return res.status(200).send(apps)
        })
    })
appointmentRouter.route('/past/:id')
    .post((req, res, next) => {
        const { month, year } = req.body
        Appointment.find({
            clientID: req.params.id,
            status: "Paid"
        }, 
            (err, foundAppointments) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const today = new Date()
            const apps = foundAppointments.filter(arr => arr.appDate.getMonth() === month && arr.appDate.getFullYear() === year && arr.appDate < today)
            apps.sort((app1, app2) => app2.appDate - app1.appDate)
            return res.status(200).send(apps)
        })
    })
appointmentRouter.route('/:id')
    .put((req, res, next) => {
        Appointment.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new: true},
            (err, updatedAppointment) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                return res.status(201).send(updatedAppointment)
            }
        )
    })
appointmentRouter.route('/intake/:id')
    .put((req, res, next) => {
        const { clientPhoneNumber, intake, numberDidChange } = req.body 
        const updates = { clientPhoneNumber, intake }
        Appointment.findOneAndUpdate(
            {_id: req.params.id},
            updates,
            {new: true},
            (err, updatedAppointment) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                if (numberDidChange){
                    User.findOneAndUpdate(
                        {_id: updatedAppointment.clientID},
                        {phoneNumber: clientPhoneNumber},
                        {new: true},
                        (err) => {
                            if (err){
                                res.status(500)
                                return next(err)
                            }
                        }
                    )
                }
                return res.status(202).send("Success")
            }
        )
    })

module.exports = appointmentRouter;