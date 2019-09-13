const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    isTherapist: {
        type: Boolean,
        default: false
    },
    isOwner: {
        type: Boolean,
        default: false
    },
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    signedWavier: {
        type: Boolean,
        default: false
    },
    visitsRemaining: {
        type: Number,
        default: 0
    },
    availabilitySundayHourStart: {
        type: Number,
        default: 0
    },
    availabilitySundayHourEnd: {
        type: Number,
        default: 0
    },
    availabilityMondayHourStart: {
        type: Number,
        default: 9
    },
    availabilityMondayHourEnd: {
        type: Number,
        default: 17
    },
    availabilityTuesdayHourStart: {
        type: Number,
        default: 9
    },
    availabilityTuesdayHourEnd: {
        type: Number,
        default: 17
    },
    availabilityWednesdayHourStart: {
        type: Number,
        default: 9
    },
    availabilityWednesdayHourEnd: {
        type: Number,
        default: 17
    },
    availabilityThursdayHourStart: {
        type: Number,
        default: 9
    },
    availabilityThursdayHourEnd: {
        type: Number,
        default: 17
    },
    availabilityFridayHourStart: {
        type: Number,
        default: 9
    },
    availabilityFridayHourEnd: {
        type: Number,
        default: 17
    },
    availabilitySaturdayHourStart: {
        type: Number,
        default: 0
    },
    availabilitySaturdayHourEnd: {
        type: Number,
        default: 0
    }
})

userSchema.pre('save', function(next){
    const user = this
    if (!user.isModified('password')) return next()
    bcrypt.hash(user.password, 10, (err,hash) => {
        if (err) return next(err)
        user.password = hash
        next()
    })
})

userSchema.methods.checkPassword = function(passwordAttempt, callback){
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
        if (err) return callback(err)
        callback(null, isMatch)
    })
}

userSchema.methods.withoutPassword = function(){
    const user = this.toObject()
    delete user.password
    return user
}

module.exports = mongoose.model("User", userSchema)