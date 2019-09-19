const express = require('express')
const appointmentRouter = express.Router()
const Appointment = require('../models/appointment.js')

appointmentRouter.route('/')
    .post((req, res, next) => {
        const newAppointment = new Appointment(req.body)
        newAppointment.save((err, newAppointmentObj) => {
            if (err){
                res.status(500)
                return next(err)
            }
            return res.status(201).send(newAppointmentObj)
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