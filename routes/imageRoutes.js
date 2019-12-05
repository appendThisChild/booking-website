const express = require('express');
const User = require('../models/user.js')
const ImageRouter = express.Router();
const mongoose = require('mongoose') 
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const { mongoURI, options } = require("../utils/app.js")
const jwt = require('jsonwebtoken')

const bucket = "uploads"
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

ImageRouter.route('/upload/:_id')
    .post(upload.single('image'), (req, res, next) => {
        // add the file name to the user account 
        User.findOneAndUpdate(
            {_id: req.params._id},
            {profileImgName: req.file.filename},
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

ImageRouter.route('/:_id/:filename')
    .put(upload.single('image'), (req, res, next) => {
        const _id = req.params._id
        const filename = req.params.filename
        const newFilename = req.file.filename
        gfs.remove({filename: filename, root: bucket}, (err, gridStore) => {
            if (err){
                res.status(404)
                return next(err)
            }
            User.findOneAndUpdate(
                {_id: _id},
                {profileImgName: newFilename},
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
    })

ImageRouter.route('/download/:filename')
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

module.exports = ImageRouter;