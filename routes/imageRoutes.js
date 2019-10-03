const express = require('express');
// const Image = require('../models/image.js');
const ImageRouter = express.Router();
const mongoose = require('mongoose')
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')

const mongoURI = 'mongodb://localhost:27017/matthew-sweetness'
const options = {
    useNewUrlParser: true, 
    useFindAndModify: false, 
    useCreateIndex: true 
}

const conn2 = mongoose.createConnection(mongoURI, options)
let gfs;
conn2.once('open', () => {
    gfs = Grid(conn2.db, mongoose.mongo)
    gfs.collection('uploads')
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
                    bucketName: 'uploads'
                }
                resolve(fileInfo)
            })
        })
    }
})
const upload = multer({ storage })

ImageRouter.route('/upload')
    .post(upload.single('file'), (req, res, next) => {
        console.log({ file: req.file })
        
    });


ImageRouter.route('/images')
    .get((req, res, next) => {
        gfs.files.find().toArray((err, files) => {
            if (err){
                res.status(500)
                return next(err)
            }
            return res.status(200).send(files)
        })
    })

ImageRouter.route('/images/:filename')
    .get((req, res, next) => {
        gfs.files.findOne({filename: req.params.filename}, (err, file) => {
            // console.log(file)
            if (err){
                res.status(500)
                return next(err)
            }
            if (file.contentType === "image/jep" || file.contentType === "image/png"){
                const readstream = gfs.createReadStream(file.filename)
                readstream.pipe(res)

            } else {
                return res.status(404).send({ err: 'Not an image' })
            }
        })
    })

module.exports = ImageRouter;