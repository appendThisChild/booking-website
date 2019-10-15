const express = require('express')
const GeneralInfo = require('../models/generalInfo.js')
const infoRouter = express.Router()
const mongoose = require('mongoose') 
const Grid = require('gridfs-stream')

const bucket = "wavier"
const conn = mongoose.connection
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection(bucket)
})

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

infoRouter.route('/download/:filename')
    .get((req, res, next) => {
        const filename = req.params.filename
        gfs.files.find({filename: filename}).toArray((err, files) => {
            if (err){
                res.status(500)
                return next(err)
            }
            if(!files || files.length === 0){
                res.status(404)
                return next("No files Exist")
            }
            const readstream = gfs.createReadStream({ filename: files[0].filename });
            readstream.setEncoding('base64');
            readstream.pipe(res)
        });
    })

module.exports = infoRouter;