const express = require('express')
const ownerRouter = express.Router()
const Appointment = require('../models/appointment.js')

// creating route to get all of the users 


ownerRouter.route('/user')
    .get()




    
ownerRouter.route('/appointment')
    .get((req, res, next) => {
        Appointment.find((err, foundAppointments) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const paidApps = foundAppointments.filter(arr => arr.status === "Paid")
            const oldApps = foundAppointments.filter(arr => arr.appointmentCreatedAt.setMinutes(arr.appointmentCreatedAt.getMinutes() + 10) < new Date() && arr.status === "Pending")
            oldApps.forEach(app => {
                Appointment.findByIdAndRemove(
                    {_id: app._id},
                    (err) => {
                        if (err){
                            res.status(500)
                            return next(err)
                        }
                    }
                )
            })
            return res.status(200).send(paidApps)
        })
    })

module.exports = ownerRouter;