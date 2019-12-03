const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const express = require('express')
const passwordRecoveryRouter = express.Router()
const User = require('../models/user.js')
const PasswordRecovery = require('../models/passwordRecovery.js')
const bcrypt = require('bcrypt')
const companyEmail = process.env.EMAIL
const GeneralInfo = require('../models/generalInfo.js')

const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/gmail.send'];

const makeBody = (to, from, subject, message) => {
    const str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');
    const encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
    return encodedMail;
}

passwordRecoveryRouter.route('/change/:id')
    .put((req, res, next) => {
        // delete the recovery instance
        PasswordRecovery.findOneAndRemove({ _id: req.params.id }, (err, foundInstance) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const { accountId } = foundInstance
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) return next(err)
                User.findOneAndUpdate(
                    { _id: accountId },
                    { password: hash },
                    {new: true},
                    (err, newUser) => {
                        if (err){
                            res.status(500)
                            return next(err)
                        }
                        console.log(newUser)
                        return res.status(202).send("Password changed!")
                    }
                )
            })
        })
    })

passwordRecoveryRouter.route('/request/:id')
    .get((req, res, next) => {
        const id = req.params.id
        PasswordRecovery.findOne({ _id: id }, (err, foundInstance) => {
            if (err){
                return res.status(203).send({ live: false })
            } else if (foundInstance){
                const now = new Date()
                const date = foundInstance.createdAt
                const newTime = new Date(date.setMinutes(date.getMinutes() + 60))
                if (now < newTime) {
                    return res.status(200).send({ live: true })
                } else {
                    PasswordRecovery.findOneAndRemove({ _id: id }, (err, deletedInstance) => {
                        if (err){
                            res.status(500)
                            return next(err)
                        }
                        return res.status(202).send({ live: false })
                    })
                }
            } else {
                return res.status(204).send({ live: false, msg: "No Reponse" })
            }
        })
    })

passwordRecoveryRouter.route('/request')
    .post((req, res, next) => {
        const { email } = req.body
        User.findOne({ email }, (err, foundUser) => {
            if (err){
                res.status(500)
                return next(err)
            }
            if (foundUser){
                const newPasswordRecovery = new PasswordRecovery({ accountId: foundUser._id})
                newPasswordRecovery.save((err, newPasswordRecoveryObj) => {
                    if (err){
                        res.status(500)
                        return next(err)
                    }
                    const to = email;
                    const subject = "Password Reset Request"
                    const message = 
`Greetings!
                    
We've received a request for a password reset for the account attached to this email. If you've found this to be false, no need to continue any further. If true, follow the link below to reset your password.
                    
Link for reset: https://www.mtmscheduling.com/recovery/change/${newPasswordRecoveryObj._id}

Thanks!
Automated Message - Blissed Out Body Works`
                    fs.readFile('credentials.json', (err, content) => {
                        if (err) {
                          res.status(500)
                          return next(err)
                        }
                        authorize(res, next, JSON.parse(content), (auth) => {
                            const raw = makeBody(to, companyEmail, subject, message)
                            const gmail = google.gmail({version: 'v1', auth});
                            gmail.users.messages.send({
                                userId: 'me',
                                resource: {
                                    raw: raw
                                }
                            }, (err, data) => {
                                if (err){
                                    res.status(500)
                                    return next(err)
                                }
                                return res.status(200).send("Message Received! We will get back to you soon!")
                            });
                        });
                    });
                })
            } else {
                return res.status(203).send("No user by that email.")
            }
        })
    })

    // 

    const authorize = (res, next, credentials, callback) => {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        GeneralInfo.find((err, info) => {
            if (err){
                res.status(500)
                return next(err)
            }
            const googleTokens = info[0].googleTokens
            const tokenObj = googleTokens.find((obj) => {
                return obj.title === "token1"
            })
            if (!tokenObj) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(tokenObj.tokenObj);
            callback(oAuth2Client);
        })
    }
        
    const getAccessToken = (oAuth2Client, callback) =>  {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            GeneralInfo.find((err, info) => {
                if (err){
                  return console.error(err)
                }
                const googleTokens = info[0].googleTokens
                const newGoogleTokenObj = {
                  title: "token1",
                  tokenObj: token
                }
                googleTokens.push(newGoogleTokenObj)
                GeneralInfo.findOneAndUpdate(
                  {_id: info[0]._id},
                  {googleTokens: googleTokens},
                  {new: true},
                  (err, updatedGenInfo) => {
                    if (err){
                      return console.error(err)
                    }
                    console.log("Token stored in database")
                  })
            })
            callback(oAuth2Client);
            });
        });
    }

module.exports = passwordRecoveryRouter;