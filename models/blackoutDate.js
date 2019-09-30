const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blackoutDateSchema = new Schema({
    therapistID: {
        type: String,
        required: true
    },
    blackoutDate: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model("BlackoutDate", blackoutDateSchema)