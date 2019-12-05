const express = require('express')
const ownerRouter = express.Router()
const GeneralInfo = require('../models/generalInfo.js')
const mongoose = require('mongoose') 
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const { mongoURI, options } = require("../utils/app.js")
const stripeSecret = process.env.STRIPE_SECRET
const stripe = require("stripe")(stripeSecret)

const bucket = "wavier"
const conn = mongoose.connection
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection(bucket)
})

const storage = new GridFsStorage({
    url: process.env.MONGODB_URI || mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err){
                    return reject(err)
                }
                const filename = buf.toString('hex') + path.extname(file.originalname)
                const fileInfo = {
                    filename: filename,
                    bucketName: bucket
                }
                resolve(fileInfo)
            })
        })
    },
    options: { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        retryWrites: false 
    }
})
const upload = multer({ storage })

ownerRouter.route('/')
    .post((req, res, next) => {
        const newInfo = new GeneralInfo()
        newInfo.save((err, newInfoObj) => {
            if (err){
                res.status(500)
                return next(err)
            }
            newInfoObj.connected_stripe_account = null
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
                updatedInfo.connected_stripe_account = null
                return res.status(201).send(updatedInfo)
            }
        )
    })

ownerRouter.route('/upload/:_id')
    .post(upload.single('pdf'), (req, res, next) => {
        const _id = req.params._id
        const filename = req.file.filename 
        GeneralInfo.findOneAndUpdate(
            {_id: _id},
            {liabilityWavierId: filename},
            {new: true},
            (err, updatedInfo) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                updatedInfo.connected_stripe_account = null
                return res.status(200).send(updatedInfo)
            }
        )
    })

ownerRouter.route('/upload/:_id/:filename')
    .put(upload.single('pdf'), (req, res, next) => {
        const _id = req.params._id
        const filename = req.params.filename
        const newFilename = req.file.filename
        gfs.remove({filename: filename, root: bucket}, (err, gridStore) => {
            if (err){
                res.status(404)
                return next(err)
            }
            GeneralInfo.findOneAndUpdate(
                {_id: _id},
                {liabilityWavierId: newFilename},
                {new: true},
                (err, updatedInfo) => {
                    if (err){
                        res.status(500)
                        return next(err)
                    }
                    updatedInfo.connected_stripe_account = null
                    return res.status(200).send(updatedInfo)
                }
            )
        })
    })

ownerRouter.route('/payment/auth')
    .post((req, res, next) => {
        const code = req.body.authCode
        stripe.oauth.token({
            grant_type: 'authorization_code',
            code: code
        },(err, response) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const connected_account_id = response.stripe_user_id
            GeneralInfo.find((err, info) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                const _id = info[0]._id
                GeneralInfo.findOneAndUpdate(
                    {_id: _id},
                    {
                        connected_stripe_account: connected_account_id,
                        connected: true
                    },
                    {new: true},
                    (err, updatedInfo) => {
                        if (err){
                            res.status(500)
                            return next(err)
                        }
                        updatedInfo.connected_stripe_account = null
                        return res.status(204).send(updatedInfo)
                    }
                )
            })
        })
    })

module.exports = ownerRouter;