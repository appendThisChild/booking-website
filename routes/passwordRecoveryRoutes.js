const express = require('express')
const passwordRecoveryRouter = express.Router()
const User = require('../models/user.js')
const PasswordRecovery = require('../models/passwordRecovery.js')

passwordRecoveryRouter.route('/')
    .post((req, res, next) => {
        const { email } = req.body
        console.log(email)
        // find account
            // if account, create recovery instance 
            // if all goes well, send email with link for recovery
        
        // no account by that email, don't create instance. 
        
    })

module.exports = passwordRecoveryRouter;