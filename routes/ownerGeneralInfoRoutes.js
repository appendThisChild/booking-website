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

const bucket = "wavier"
const conn = mongoose.connection
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection(bucket)
})

const storage = new GridFsStorage({
    url: mongoURI,
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
        useUnifiedTopology: true 
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
                    return res.status(200).send(updatedInfo)
                }
            )
        })
    })

module.exports = ownerRouter;