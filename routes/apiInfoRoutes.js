const express = require('express')
const User = require('../models/user.js')
const infoRouter = express.Router()
const jwt = require('jsonwebtoken')


infoRouter.route('/email/:_id')
    .post((req, res, next) => {
        User.find((err, users) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const allOtherAccounts = users.filter(user => String(user._id) !== req.params._id )
            const isPresent = allOtherAccounts.some(user => {
                return user.email === req.body.email
            })
            return res.status(200).send({isPresent: isPresent})
        })
    })


infoRouter.route('/:_id')
    .put((req, res, next) => {
        User.findOneAndUpdate(
            {_id: req.params._id},
            req.body,
            {new: true},
            (err, updatedUser) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                const token = jwt.sign(updatedUser.withoutPassword(), process.env.SECRET)
                return res.status(201).send({user: updatedUser.withoutPassword(), token})
            }
        )
    })

module.exports = infoRouter;