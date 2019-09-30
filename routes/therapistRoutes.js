const express = require('express')
const therapistRouter = express.Router()
const Appointment = require('../models/appointment.js')
const BlackoutDate = require('../models/blackoutDate.js')

// When therapist is using the backend

therapistRouter.route('/appointment/:id')
    .get((req, res, next) => {
        Appointment.find({
            therapistID: req.params.id,
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

therapistRouter.route('/blackout/:id')
    .get((req, res, next) => {
        BlackoutDate.find({ therapistID: req.params.id },
            (err, foundBlackoutDates) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const futureDates = foundBlackoutDates.filter(arr => arr.blackoutDate > new Date())
            // get old dates
            // loops through and delete
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