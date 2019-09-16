const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appointmentSchema = new Schema({
    clientID: {
        type: String,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    appLengthInMinutes: {
        type: Number,
        required: true
    },
    appDate: {
        type: Date,
        required: true
    },
    therapistID: {
        type: String,
        required: true
    },
    therapistName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipcode: {
        type: Number,
        required: true
    },
    packageChoice: {
        type: Number,
        enum: [1, 3],
        default: 1
    },
    canceled: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["Paid", "Pending"],
        default: "Pending"
    },
    amount: {
        type: Number,
        default: 0
    },
    appointmentCreatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Appointment", appointmentSchema)