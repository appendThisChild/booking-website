const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const express = require('express')
const emailRouter = express.Router()
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

emailRouter.route('/contact')
    .post((req, res, next) => {
        const { to, from, subject, message } = req.body
        fs.readFile('credentials.json', (err, content) => {
            if (err) {
              res.status(500)
              return next(err)
            }
            authorize(res, next, JSON.parse(content), (auth) => {
                const raw = makeBody(to || companyEmail, from || companyEmail, subject, message)
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

module.exports = emailRouter;