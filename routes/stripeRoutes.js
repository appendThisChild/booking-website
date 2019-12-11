const express = require('express')
const paymentRouter = express.Router()
const GeneralInfo = require('../models/generalInfo.js')
const stripeSecret = process.env.STRIPE_SECRET
const stripe = require("stripe")(stripeSecret)
const uuid = require('uuid/v4')

paymentRouter.route('/charge')
    .post((req, res, next) => {
        const { product, token, isInStudio } = req.body
        // const idempotency_key = uuid()
        const { length, choice } = product.price
        GeneralInfo.find((err, info) => {
            if (err){
                res.status(500)
                return next(err)
            }
            // calculates travel fee
            let travelFee = 0
            if (!isInStudio){
                travelFee = info[0].onSitePricing
            }
            const price = info[0].pricing[length][choice]
            // where we get the stripe_account from the database
            const stripe_account_id = info[0].connected_stripe_account
            stripe.customers.create({
                email: token.email,
                source: token.id
            // added stripe_account for creating customer on the connected account
            },{ stripe_account: stripe_account_id },
            (err, customer) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                stripe.charges.create({
                    amount: price + travelFee,
                    currency: "usd",
                    customer: customer.id,
                    receipt_email: token.email,
                    description: `Purchase of ${product.name}`,
                // added application fee of 10% of the total price in the charge
                // also added the stripe_account
                    application_fee_amount: parseInt(price * .1)
                },{ stripe_account: stripe_account_id},
                (err, charge) => {
                    if (err){
                        res.status(500)
                        return next(err)
                    }
                    const { status, id } = charge
                    return res.status(201).send({ status, id })
                })
            })
        })
    }) 

paymentRouter.route('/travelFee')
    .post((req, res, next) => {
        const { token, product } = req.body
        GeneralInfo.find((err, info) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const travelFee = info[0].onSitePricing
            const stripe_account_id = info[0].connected_stripe_account
            stripe.customers.create({
                email: token.email,
                source: token.id
            // added stripe_account for creating customer on the connected account
            },{ stripe_account: stripe_account_id },
            (err, customer) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                stripe.charges.create({
                    amount: travelFee,
                    currency: "usd",
                    customer: customer.id,
                    receipt_email: token.email,
                    description: product.name,
                // no percentage taken on travel fee
                    application_fee_amount: 0
                },{ stripe_account: stripe_account_id},
                (err, charge) => {
                    if (err){
                        res.status(500)
                        return next(err)
                    }
                    const { status, id } = charge
                    return res.status(201).send({ status, id })
                })
            })

        })
    })

module.exports = paymentRouter;