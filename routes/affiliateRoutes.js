const express = require('express')
const router = express.Router()
const Affiliate = require('../models/affiliate.js')

router.route('/')
    .get((req, res, next) => {
        Affiliate.find((err, foundAffiliates) => {
            if (err){
                res.status(500)
                return next(err)
            }
            return res.status(200).send(foundAffiliates)
        })
    })
    .post((req, res, next) => {
        const newAffiliate = new Affiliate(req.body)
        newAffiliate.save((err, newAffiliateObj) => {
            if (err){
                res.status(500)
                return next(err)
            }
            return res.status(201).send(newAffiliateObj)
        })
    })

router.route('/:id')
    .delete((req, res, next) => {
        Affiliate.findOneAndRemove(
            {_id: req.params.id},
            (err, deletedAffiliate) => {
                if (err){
                    res.status(500)
                    return next(err)
                }
                return res.status(203).send(deletedAffiliate)
            }
        )
    })

router.route('/visits/:id')
    .put((req, res, next) => {
        Affiliate.findOne({_id: req.params.id}, (err, foundAffiliate) => {
            if (err){
                res.status(500)
                return next(err)
            }
            Affiliate.findOneAndUpdate(
                {_id: req.params.id},
                { visitsUsing: (foundAffiliate.visitsUsing + 1) },
                {new: true},
                (err, updatedAffiliate) => {
                    if (err){
                        res.status(500)
                        return next(err)
                    }
                    return res.status(202).send(updatedAffiliate)
                }
            )
        })
    })

router.route('/purchase/:id')
    .put((req, res, next) => {
        const { index } = req.body
        Affiliate.findOne({_id: req.params.id}, (err, foundAffiliate) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const mappedPurchases = foundAffiliate.purchases.map((lengthArr, i) => {
                if (i === index[0]){
                    const mappedInnerArr = lengthArr.map((package, i) => {
                        if (i === index[1]){
                            return package + 1
                        } else {
                            return package
                        }
                    })
                    return mappedInnerArr
                } else {
                    return lengthArr
                }
            })
            Affiliate.findOneAndUpdate(
                {_id: req.params.id},
                { purchases: mappedPurchases},
                {new: true},
                (err, updatedAffiliate) => {
                    if (err){
                        res.status(500)
                        return next(err)
                    }
                    return res.status(202).send(updatedAffiliate)
                }
            )
        })
    })

module.exports = router;