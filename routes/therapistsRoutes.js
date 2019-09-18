const express = require('express')
const User = require('../models/user.js')
const therapistRouter = express.Router()

therapistRouter.get("/", (req, res, next) => {
    User.find({isTherapist: true}, (err, users) => {
        if (err){
            res.status(500)
            return next(err)
        }
        users.forEach(user => {
            user.password = null
            user.isOwner = null
            user.isTherapist = null
            user.visitsRemaining = null
            user.signedWavier = null
        });
        return res.status(200).send(users)
    })
})
module.exports = therapistRouter;