const mongoose = require('mongoose')
const Schema = mongoose.Schema

const affiliateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    visitsUsing: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: [
            [0, 0],
            [0, 0],
            [0, 0]
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Affiliate", affiliateSchema)