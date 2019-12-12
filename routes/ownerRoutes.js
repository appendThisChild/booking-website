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
    .get((req, res, next) => {
        console.log(req.params._id)
        User.findOne(
            {_id : req.params._id}, 
            (err, foundUser) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                foundUser.password = null
                return res.status(200).send(foundUser)
        })
    })
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
            const appsWithCurrentPrice = paidApps.map(app => {
                app.amount = app.amountTherapistPaid
                return app
            })
            return res.status(200).send(appsWithCurrentPrice)
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
            const appsWithCurrentPrice = foundAppointments.map(app => {
                app.amount = app.amountTherapistPaid
                return app
            })
            const today = new Date()
            const pastYearApps = appsWithCurrentPrice.filter(arr => arr.status === "Paid" && arr.therapistPaid === true && arr.appDate.getFullYear() === year && arr.appDate < today)
            const websiteDeductedAlready = pastYearApps.filter(app => app.canceled === true && app.packageChoice === 1)
            const adjustment = ((websiteDeductedAlready.reduce((total, sum) => total + sum.amount, 0) / 100) * .1).toFixed(2)
            const purchaseEarnings = pastYearApps.reduce((total, sum) => total + sum.amount, 0) / 100
            const travelFees = pastYearApps.reduce((total, sum) => total + sum.travelFee, 0) / 100
            const pastYearEarnings = purchaseEarnings + travelFees
            const therapistEarnings = (purchaseEarnings * .80 + travelFees).toFixed(2)
            const websiteDeductions = (purchaseEarnings * .10).toFixed(2) - adjustment
            const companyEarnings = (pastYearEarnings - therapistEarnings - websiteDeductions).toFixed(2)
            const data = {
                yearEarnings: pastYearEarnings,
                therapistEarnings, 
                websiteDeductions, 
                companyEarnings
            }
            const paidApps = appsWithCurrentPrice.filter(arr => arr.status === "Paid" && arr.appDate.getMonth() === month && arr.appDate.getFullYear() === year && arr.appDate < today)
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
            const appWithCurrentPrice = paidApps.map(app => {
                app.amount = app.amountTherapistPaid
                return app
            })
            return res.status(200).send(appWithCurrentPrice)
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