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
    clientPhoneNumber: {
        type: Number,
        default: 1111111111
    },
    clientEmail: {
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
    therapistPhoneNumber: {
        type: Number,
        required: true
    },
    therapistEmail: {
        type: String,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    packageChoice: {
        type: Number,
        enum: [0, 1, 2],
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