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

appointmentRouter.route('/:id')
    .get((req, res, next) => {
        Appointment.find({
            clientID: req.params.id,
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
    .delete((req, res, next) => {
        Appointment.findOneAndUpdate(
            {_id: req.params.id},
            {canceled: true},
            {new: true},
            (err) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                return res.status(202).send(`Appointment Canceled!`)
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