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

infoRouter.route('/visits/:_id')
    .put((req, res, next) => {
        const { index, adjust } = req.body
        User.findOne({_id: req.params._id}, (err, user) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const { visitsRemaining } = user
            visitsRemaining.splice(index, 1, visitsRemaining[index] + adjust)
            User.findOneAndUpdate(
                {_id: req.params._id},
                {visitsRemaining: visitsRemaining},
                {new: true}, 
                (err, user) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                return res.status(200).send("Done")
            })
        })
    })

infoRouter.route('/visits/:_id/:int')
    .get((req, res, next) => {
        User.findOne({_id: req.params._id}, (err, user) => {
            if (err){
                res.status(500)
                return next(err)
            }
            return res.status(200).send({visitsRemaining: user.visitsRemaining[req.params.int]})
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