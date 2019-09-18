const express = require('express')
const appointmentRouter = express.Router()
const Appointment = require('../models/appointment.js')

// appointmentRouter.route('/')
//     .get((req, res, next) => {
//         Appointment.find((err, appointments) => {
//             if (err){
//                 res.status(500)
//                 return next(err)
//             }
//             return res.status(200).send(appointments)
//         })
//     })
//     .post((req, res, next) => {
//         const newAppointment = new Appointment(req.body)
//         newAppointment.save((err, newAppointmentObj) => {
//             if (err){
//                 res.status(500)
//                 return next(err)
//             }
//             return res.status(201).send(newAppointmentObj)
//         })
//     })

// appointmentRouter.route('/:_id')
//     .put((req, res, next) => {
//         Appointment.findOneAndUpdate(
//             {_id: req.params._id},
//             req.body,
//             {new: true},
//             (err, updatedAppointment) => {
//                 if (err){
//                     res.status(500)
//                     return next(err)
//                 }
//                 return res.status(201).send(updatedAppointment)
//             }
//         )
//     })
//     .delete((req, res, next) => {
//         Appointment.findOneAndRemove(
//             {_id: req.params._id},
//             (err, deletedAppointment) => {
//                 if (err){
//                     res.status(500)
//                     return next(err)
//                 }
//                 return res.status(202).send(`Successfully removed the Appointment!`)
//             }
//         )
//     })

module.exports = appointmentRouter;