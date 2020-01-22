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
            const appWithCurrentPrice = apps.map(app => {
                app.amount = app.amountTherapistPaid
                return app
            })
            return res.status(200).send(appWithCurrentPrice)
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
            const today = new Date()
            const appsWithCurrentPrice = foundAppointments.map(app => {
                app.amount = app.amountTherapistPaid
                return app
            })
            
            const pastYearApps = appsWithCurrentPrice.filter(arr => arr.therapistPaid === true && arr.appDate.getFullYear() === year && arr.appDate < today)
            const pastYearAppsForTravelFees = appsWithCurrentPrice.filter(arr => arr.status === "Paid" && arr.appDate.getFullYear() === year && arr.appDate < today)
            const purchaseEarnings = pastYearApps.reduce((total, sum) => total + sum.amount, 0) / 100
            const travelFees = pastYearAppsForTravelFees.reduce((total, sum) => total + sum.travelFee, 0) / 100
            const pastYearEarnings =  purchaseEarnings + travelFees
            const therapistEarnings = (purchaseEarnings * .50 + travelFees).toFixed(2) 
            const serviceDeducted = (purchaseEarnings * .50).toFixed(2)
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