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
    availability: {
        type: Array,
        default: [
            [0,0],
            [9,17],
            [9,17],
            [9,17],
            [9,17],
            [9,17],
            [0,0]
        ]
    },
    address: {
        type: Object,
        default: {
            street: "",
            city: "",
            state: "",
            zipcode: ""
        }
    },
    phoneNumber: {
        type: Number,
        default: 1111111111
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