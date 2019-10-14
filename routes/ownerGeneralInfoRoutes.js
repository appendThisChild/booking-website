const express = require('express')
const ownerRouter = express.Router()
const GeneralInfo = require('../models/generalInfo.js')

ownerRouter.route('/')
    .post((req, res, next) => {
        const newInfo = new GeneralInfo()
        newInfo.save((err, newInfoObj) => {
            if (err){
                res.status(500)
                return next(err)
            }
            return res.status(201).send(newInfoObj)
        })
    })

ownerRouter.route('/:_id')
    .put((req, res, next) => {
        GeneralInfo.findOneAndUpdate(
            {_id: req.params._id},
            req.body,
            {new: true},
            (err, updatedInfo) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                return res.status(201).send(updatedInfo)
            }
        )
    })

module.exports = ownerRouter;