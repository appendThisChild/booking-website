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
            const oldBadReviews = foundReviews.filter(review => {
                return review.rating < 3 && new Date(review.createdAt).setMonth(new Date(review.createdAt).getMonth() + 1) < new Date()
            })
            const reviews = []
            foundReviews.forEach(review1 => {
                const isPresent = oldBadReviews.some(review2 => review2._id === review1._id )
                if (!isPresent) reviews.push(review1);
            })
            oldBadReviews.forEach(review => {
                Review.findOneAndRemove(
                    {_id: review._id },
                    (err) => {
                        if (err){
                            res.status(500)
                            return next(err)
                        }
                    }
                )
            })
            reviews.sort((rev1, rev2) => rev2.createdAt - rev1.createdAt )
            const rating = (reviews.reduce((total, sum) => total + sum.rating, 0) / reviews.length).toFixed(2)
            return res.status(200).send({ reviews: reviews, rating: Number(rating) })
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