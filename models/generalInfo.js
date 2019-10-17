const mongoose = require('mongoose')
const Schema = mongoose.Schema

const generalInfoSchema = new Schema({
    homeTitle: {
        type: String,
        default: "Our Mission"
    },
    homeInfo: {
        type: Array,
        default: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur in doloremque ipsum ipsa cum dignissimos aperiam voluptas, modi aut excepturi ducimus magnam reiciendis eos vitae quos praesentium enim sit corporis.",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur in doloremque ipsum ipsa cum dignissimos aperiam voluptas, modi aut excepturi ducimus magnam reiciendis eos vitae quos praesentium enim sit corporis.",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur in doloremque ipsum ipsa cum dignissimos aperiam voluptas, modi aut excepturi ducimus magnam reiciendis eos vitae quos praesentium enim sit corporis."
        ]
    },
    homeTherapistSubtitle: {
        type: String,
        default: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur in doloremque ipsum ipsa cum dignissimos aperiam voluptas, modi aut excepturi ducimus magnam reiciendis eos vitae quos praesentium enim sit corporis."
    },
    pricing: {
        type: Array,
        default: [
            [9999, 19998],
            [14998, 29997],
            [19997, 39996]
        ]
    },
    cancelationPolicy: {
        type: Array,
        default: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur in doloremque ipsum ipsa cum dignissimos aperiam voluptas, modi aut excepturi ducimus magnam reiciendis eos vitae quos praesentium enim sit corporis.",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur in doloremque ipsum ipsa cum dignissimos aperiam voluptas, modi aut excepturi ducimus magnam reiciendis eos vitae quos praesentium enim sit corporis.",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur in doloremque ipsum ipsa cum dignissimos aperiam voluptas, modi aut excepturi ducimus magnam reiciendis eos vitae quos praesentium enim sit corporis."
        ]
    },
    liabilityWavierId: {
        type: String,
        default: 'none'
    },
    connected_stripe_account: {
        type: String,
        default: ''
    },
    connected: {
        type: Boolean,
        default: false
    },
    FAQs: {
        type: Array,
        default: [
            {
                question: "Cancelation Policy",
                answer: "Something"
            }
        ]
    }
});

module.exports = mongoose.model("GeneralInfo", generalInfoSchema)