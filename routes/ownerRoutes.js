const express = require('express')
const ownerRouter = express.Router()
const Appointment = require('../models/appointment.js')
const User = require('../models/user.js')

ownerRouter.route('/user')
    .get((req, res, next) => {
        User.find((err, users) => {
            if (err){
                res.status(500)
                return next(err)
            }
            users.forEach(user => {
                user.password = null
            });
            return res.status(200).send(users)
        })
    })
ownerRouter.route('/user/:_id')
    .put((req, res, next) => {
        User.findOneAndUpdate(
            {_id: req.params._id},
            req.body,
            {new: true},
            (err, updatedAccount) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                return res.status(201).send(updatedAccount)
            }
        )
    })



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
                Appointment.findOneAndRemove(
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
ownerRouter.route('/appointment/therapist/:_id')
    .get((req, res, next) => {
        Appointment.find({therapistID: req.params._id},(err, foundAppointments) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const paidApps = foundAppointments.filter(arr => arr.status === "Paid")
            const oldApps = foundAppointments.filter(arr => arr.appointmentCreatedAt.setMinutes(arr.appointmentCreatedAt.getMinutes() + 10) < new Date() && arr.status === "Pending")
            oldApps.forEach(app => {
                Appointment.findOneAndRemove(
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
ownerRouter.route('/appointment/client/:_id')
    .get((req, res, next) => {
        Appointment.find({therapistID: req.params._id},(err, foundAppointments) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const paidApps = foundAppointments.filter(arr => arr.status === "Paid")
            const oldApps = foundAppointments.filter(arr => arr.appointmentCreatedAt.setMinutes(arr.appointmentCreatedAt.getMinutes() + 10) < new Date() && arr.status === "Pending")
            oldApps.forEach(app => {
                Appointment.findOneAndRemove(
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