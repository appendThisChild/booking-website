const express = require('express')
const paymentRouter = express.Router()
const GeneralInfo = require('../models/generalInfo.js')
const stripeSecret = process.env.STRIPE_SECRET
const stripe = require("stripe")(stripeSecret)
const uuid = require('uuid/v4')

paymentRouter.route('/charge')
    .post((req, res, next) => {
        const { product, token } = req.body
        // const idempotency_key = uuid()
        const { length, choice } = product.price
        GeneralInfo.find((err, info) => {
            if (err){
                res.status(500)
                return next(err)
            }


            // this is where I would check if it was schedule for instudio or not and add the travel fee. 

            // need to think this through. 
                // if they are purchasing a single, this should suffice
                    // adding on the travel amount if onsite
                    // when refunding the amount paid and amount therapist paid if the number to go off of
                    // the company would also receive a small amount of that fee

                        // could i make it so the therapist is the only one that gets the amount 
                            // possibly, by adding a seperate section to hold the amount and showing it separately
                            // charging for the full amount in one transation, but the fee I take is based of the massage 

                            // or I could just say, we take a percentage of that, it would be way easier 

                        // adding the seperate section, but travel fee not refundable 
                        // I'll majority need to change of the histories displace the extra value 

                    // adding the travel fee to that so it would get refunded would be correct 
                // if they are purchasing a triple, this should suffice as a add-on for the first purchase
                    // travel fee won't get refunded if cancelled, it would be added on is applicable 
                // if they are using a pre-purchase, i should send them a different window in order to refund their purchase


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
                    amount: price,
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

module.exports = paymentRouter;