const express = require('express')
const GeneralInfo = require('../models/generalInfo.js')
const infoRouter = express.Router()

infoRouter.route('/')
    .get((req, res, next) => {
        GeneralInfo.find((err, info) => {
            if (err){
                res.status(500)
                return next(err)
            }
            return res.status(200).send(info)
        })
    })

module.exports = infoRouter;