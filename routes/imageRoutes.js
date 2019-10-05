const express = require('express');

const ImageRouter = express.Router();
const mongoose = require('mongoose') 
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const { mongoURI, options } = require("../utils/app.js")
const bucket = "uploads"

const conn = mongoose.connection

// Grid.mongo = mongoose.mongo
// const gfs = Grid(conn)
// gfs.collection(bucket)

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
    options: { useNewUrlParser: true }
})
const upload = multer({ storage })

ImageRouter.route('/')
    .post(upload.single('image'), (req, res, next) => {
        console.log(req.file)
        // console.log(res)
        res.send(req.file)
    })


        // gfs.files.find().toArray((err, files) => {
        //     console.log(files)
        // })


ImageRouter.route('/:id')
    .get((req, res, next) => {
        const id = req.params.id
        gfs.files.find({filename: id}).toArray((err, files) => {
            if(!files || files.length === 0){
                return res.status(404).json({
                    responseCode: 1,
                    responseMessage: "error"
                });
            }
            const readstream = gfs.createReadStream({ filename: files[0].filename });
            readstream.setEncoding('base64');
            // let data = ''
            // readstream.on('data', (chunk) => data += chunk)
            // readstream.on('end', () => res.send(data))
            readstream.pipe(res)
        });
    })
module.exports = ImageRouter;