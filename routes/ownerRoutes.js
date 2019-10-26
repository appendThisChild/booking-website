const express = require('express')
const ownerRouter = express.Router()
const Appointment = require('../models/appointment.js')
const User = require('../models/user.js')
const GeneralInfo = require('../models/generalInfo.js')

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



// Here
ownerRouter.route('/appointment/present')
    .post((req, res, next) => {
        const { month, year } = req.body
        Appointment.find((err, foundAppointments) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const today = new Date()
            const paidApps = foundAppointments.filter(arr => arr.status === "Paid" && arr.appDate.getMonth() === month && arr.appDate.getFullYear() === year && arr.appDate > today)
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
            paidApps.sort((app1, app2) => app1.appDate - app2.appDate)
            return res.status(200).send(paidApps)
        })
    })
ownerRouter.route('/appointment/past')
    .post((req, res, next) => {
        const { month, year } = req.body
        Appointment.find((err, foundAppointments) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const today = new Date()
            const pastYearApps = foundAppointments.filter(arr => arr.status === "Paid" && arr.appDate.getFullYear() === year && arr.appDate < today)
            const pastYearEarnings = pastYearApps.reduce((total, sum) => total + sum.amount, 0) / 100
            const therapistEarnings = (pastYearEarnings * .80).toFixed(2)
            const websiteDeductions = (pastYearEarnings * .10).toFixed(2)
            const companyEarnings = (pastYearEarnings - therapistEarnings - websiteDeductions).toFixed(2)
            const data = {
                yearEarnings: pastYearEarnings,
                therapistEarnings, 
                websiteDeductions, 
                companyEarnings
            }
            const paidApps = foundAppointments.filter(arr => arr.status === "Paid" && arr.appDate.getMonth() === month && arr.appDate.getFullYear() === year && arr.appDate < today)
            paidApps.sort((app1, app2) => app2.appDate - app1.appDate)
            return res.status(200).send({apps: paidApps, data})
        })
    })
ownerRouter.route('/appointment/therapist/:_id')
    .post((req, res, next) => {
        const { month, year } = req.body
        Appointment.find({therapistID: req.params._id},(err, foundAppointments) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const paidApps = foundAppointments.filter(arr => arr.status === "Paid" && arr.appDate.getMonth() === month && arr.appDate.getFullYear() === year)
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
            paidApps.sort((app1, app2) => app2.appDate - app1.appDate)
            GeneralInfo.find((err, info) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                const appWithCurrentPrice = paidApps.map(app => {
                    if (app.packageChoice !== 1){
                        if (app.appLengthInMinutes === 60){
                            app.amount = info[0].pricing[0][1] / 3
                        } else if (app.appLengthInMinutes === 90){
                            app.amount = info[0].pricing[1][1] / 3
                        } else if (app.appLengthInMinutes === 120) {
                            app.amount = info[0].pricing[2][1] / 3
                        }
                    } 
                    return app
                })
                return res.status(200).send(appWithCurrentPrice)
            })
        })
    })
ownerRouter.route('/appointment/client/:_id')
    .post((req, res, next) => {
        const { month, year } = req.body
        Appointment.find({clientID: req.params._id},(err, foundAppointments) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const paidApps = foundAppointments.filter(arr => arr.status === "Paid" && arr.appDate.getMonth() === month && arr.appDate.getFullYear() === year)
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
            paidApps.sort((app1, app2) => app2.appDate - app1.appDate)
            return res.status(200).send(paidApps)
        })
    })

module.exports = ownerRouter;