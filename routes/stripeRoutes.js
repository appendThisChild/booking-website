const express = require('express')
const paymentRouter = express.Router()
const { stripeSecret } = require('../utils/imp.js')
const stripe = require("stripe")(stripeSecret)
const uuid = require('uuid/v4')

paymentRouter.route('/charge')
    .post((req, res, next) => {
        const { product, token } = req.body
        const idempotency_key = uuid()
        stripe.customers.create({
            email: token.email,
            source: token.id
        }, (err, customer) => {
            if (err){
                res.status(500)
                return next(err)
            }
            stripe.charges.create({
                amount: product.price,
                currency: "usd",
                customer: customer.id,
                receipt_email: token.email,
                description: `Purchase of ${product.name}`
                //, application_fee_amount: parseInt(product.price * .1)
            }, (err, charge) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                const { status } = charge
                return res.status(201).send(status)
            })
        })
    }) 

    // {
    //     stripe_account: "{{CONNECTED_STRIPE_ACCOUNT_ID}}",
    //   }

module.exports = paymentRouter;