const express = require('express')
const therapistRouter = express.Router()
const Appointment = require('../models/appointment.js')
const BlackoutDate = require('../models/blackoutDate.js')
const GeneralInfo = require('../models/generalInfo.js')

// When therapist is using the backend
therapistRouter.route('/appointment/present/:id')
    .post((req, res, next) => {
        const { month, year } = req.body
        Appointment.find({
            therapistID: req.params.id,
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
            GeneralInfo.find((err, info) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                const appWithCurrentPrice = apps.map(app => {
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
therapistRouter.route('/appointment/past/:id')
    .post((req, res, next) => {
        const { month, year } = req.body
        Appointment.find({
            therapistID: req.params.id,
            status: "Paid"
        },
            (err, foundAppointments) => {
            if (err){
                res.status(500)
                return next(err)
            }
            GeneralInfo.find((err, info) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                const today = new Date()
                const appsWithCurrentPrice = foundAppointments.map(app => {
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
                const pastYearApps = appsWithCurrentPrice.filter(arr => arr.canceled === false && arr.appDate.getFullYear() === year && arr.appDate < today)
                const pastYearEarnings = pastYearApps.reduce((total, sum) => total + sum.amount, 0) / 100
                const therapistEarnings = (pastYearEarnings * .80).toFixed(2)
                const serviceDeducted = (pastYearEarnings * .20).toFixed(2)
                const data = {
                    yearEarnings: pastYearEarnings,
                    therapistEarnings, 
                    serviceDeducted
                }
                const apps = appsWithCurrentPrice.filter(arr => arr.appDate.getMonth() === month && arr.appDate.getFullYear() === year && arr.appDate < today)
                apps.sort((app1, app2) => app2.appDate - app1.appDate)
                return res.status(200).send({apps, data})
            })
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
            const oldDates = foundBlackoutDates.filter(arr => arr.blackoutDate < new Date())
            oldDates.forEach(dateObj => {
                BlackoutDate.findOneAndRemove(
                    {_id: dateObj._id},
                    (err) => {
                        if (err){
                            res.status(500)
                            return next(err)
                        }
                    }
                )
            })
            return res.status(200).send(futureDates)
        })
    })
    .delete((req, res, next ) => {
        BlackoutDate.findOneAndRemove({ _id: req.params.id },
            (err, deletedBounty) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                return res.status(202).send("Blackout Date was successfully removed!")
        })
    })

therapistRouter.route('/blackout')
    .post((req, res, next) => {
        const newBlackoutDate = new BlackoutDate(req.body)
        newBlackoutDate.save((err, newBlackoutDateObj) => {
            if (err){
                res.status(500)
                return next(err)
            }
            return res.status(201).send(newBlackoutDateObj)
        })
    })


module.exports = therapistRouter;