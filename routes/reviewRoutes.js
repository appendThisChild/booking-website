const express = require('express')
const reviewRouter = express.Router()
const Review = require("../models/review.js")

reviewRouter.route('/')
    .get((req, res, next) => {
        Review.find((err, foundReviews) => {
            if (err){
                res.status(500)
                return next(err)
            }
            // if the bad review is older than a month, delete it and filter it from the send



            foundReviews.sort((rev1, rev2) => {
                return new Date(rev1.createdAt) < new Date(rev2.createdAt)
            })
            const rating = (foundReviews.reduce((total, sum) => total + sum.rating, 0) / foundReviews.length).toFixed(2)
            return res.status(200).send({ reviews: foundReviews, rating: Number(rating) })
        })
    })
    .post((req, res, next) => {
        const newReview = new Review(req.body)
        newReview.save((err, newReviewObj) => {
            if (err){
                res.status(500)
                return next(err)
            }
            return res.status(201).send(newReviewObj)
        })
    })

module.exports = reviewRouter;