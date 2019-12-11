const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const express = require('express')
const googleRouter = express.Router()
const stripeSecret = process.env.STRIPE_SECRET
const stripe = require("stripe")(stripeSecret)
const GeneralInfo = require('../models/generalInfo.js')
const Appointment = require('../models/appointment.js')
const User = require('../models/user.js')

const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/gmail.send'];

googleRouter.route('/calendar')
  .get((req, res, next) => {
    fs.readFile('credentials.json', (err, content) => {
      if (err) {
        res.status(500)
        return next(err)
      }
      authorize(res, next, JSON.parse(content), (auth) => {
        const calendar = google.calendar({version: 'v3', auth});
        calendar.events.list({
          calendarId: 'primary',
          timeMin: (new Date()).toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime',
        }, (err, data) => {
          if (err) {
            res.status(500)
            return next(err)
          }
          const events = data.data.items;
          if (events.length) {
            return res.status(200).send(events);
          } else {
            return res.status(200).send('No upcoming events found.');
          }
        });
      });
    });          
  })
  .post((req, res, next) => {
    const { appDate, appLengthInMinutes, clientName, clientEmail, therapistName, therapistEmail, address, _id} = req.body.appointment
    const { street, city, state, zipcode } = address
    const event = {
      summary: `${appLengthInMinutes}-Minute Massage`,
      location: `${street}, ${city}, ${state} ${zipcode}`,
      description: `${appLengthInMinutes}-Minute Massage for ${clientName} by ${therapistName}`,
      start: {
        dateTime: `${appDate}`,
        timeZone: 'America/Denver'
      },
      end: {
        dateTime: `${req.body.endDate}`,
        timeZone: 'America/Denver'
      },
      attendees: [
        {
          email: `${clientEmail}`,
          displayName: `${clientName}`
        },
        {
          email: `${therapistEmail}`,
          displayName: `${therapistName}`
        }
      ],
      reminders: {
        useDefault: true
      }
    }
    fs.readFile('credentials.json', (err, content) => {
      if (err) {
        res.status(500)
        return next(err)
      }
      authorize(res, next, JSON.parse(content), (auth) => {
        const calendar = google.calendar({version: 'v3', auth});
        calendar.events.insert({
          calendarId: 'primary',
          sendNotifications: true,
          resource: event,
        }, (err, createdEvent) => {
          if (err) {
            res.status(500)
            return next(err)
          }
          Appointment.findOneAndUpdate(
            {_id: _id},
            {googleId: createdEvent.data.id},
            {new: true},
            (err) => {
              if (err){
                res.status(500)
                return next(err)
              }
              return res.status(201).send("success");
            }
          )
        });
      });
    });  
  })

googleRouter.route('/calendar/:id/:isTherapist')
  .delete((req, res, next) => {
    const isTherapist = req.params.isTherapist === "true"
    const now = new Date()
    const hour24Mark = new Date(now.setHours(now.getHours() + 24))
    Appointment.findOne(
      {_id: req.params.id},
      (err, foundAppointment) => {
        if (err) {
          res.status(500)
          return next(err)
        }
        if (!foundAppointment.canceled){
          let newAmount = foundAppointment.amountTherapistPaid
          const updates = {
            canceled: true,
            therapistPaid: true,
            amountTherapistPaid: newAmount,
            dateCanceled: new Date()
          }
          let index = 0
          if (foundAppointment.appLengthInMinutes === 90){
            index = 1
          } else if (foundAppointment.appLengthInMinutes === 120){
            index = 2 
          }
          if (foundAppointment.packageChoice === 1){
            if (isTherapist){
              updates.therapistPaid = false
              updates.amountTherapistPaid = 0
              const refundFee = true
              refund(res, foundAppointment.chargeId, newAmount, refundFee, next, () => {
                updateCanceledAppointment(res, req.params.id, updates, next, (googleId) => {
                  deleteEventOnGoogle(res, googleId, next, (message) => {
                    return res.status(202).send(message);
                  })
                })
              })
              
            } else {
              if (hour24Mark > foundAppointment.appDate){
                const refundedAmount = parseInt(newAmount / 2)
                updates.amountTherapistPaid = (newAmount - refundedAmount) - parseInt(newAmount * .1) 
                const refundFee = false
                refund(res, foundAppointment.chargeId, refundedAmount, refundFee, next, () => {
                  updateCanceledAppointment(res, req.params.id, updates, next, (googleId) => {
                    deleteEventOnGoogle(res, googleId, next, (message) => {
                      return res.status(202).send(message);
                    })
                  })
                })
              } else {
                updates.therapistPaid = false
                updates.amountTherapistPaid = 0
                const refundFee = true
                refund(res, foundAppointment.chargeId, newAmount, refundFee, next, () => {
                  updateCanceledAppointment(res, req.params.id, updates, next, (googleId) => {
                    deleteEventOnGoogle(res, googleId, next, (message) => {
                      return res.status(202).send(message);
                    })
                  })
                })
              }
            }
          } else {
            if (isTherapist){
              updates.therapistPaid = false
              updates.amountTherapistPaid = 0
              giveBackVisit(res, foundAppointment.clientID, index, next, () => {
                updateCanceledAppointment(res, req.params.id, updates, next, (googleId) => {
                  deleteEventOnGoogle(res, googleId, next, (message) => {
                    return res.status(202).send(message);
                  })
                })
              })
            } else {
              if (hour24Mark > foundAppointment.appDate){
                updateCanceledAppointment(res, req.params.id, updates, next, (googleId) => {
                  deleteEventOnGoogle(res, googleId, next, (message) => {
                    return res.status(202).send(message);
                  })
                })
              } else {
                updates.therapistPaid = false
                updates.amountTherapistPaid = 0
                giveBackVisit(res, foundAppointment.clientID, index, next, () => {
                  updateCanceledAppointment(res, req.params.id, updates, next, (googleId) => {
                    deleteEventOnGoogle(res, googleId, next, (message) => {
                      return res.status(202).send(message);
                    })
                  })
                })
              }
            }
          }
        } else {
          return res.status(202).send("Already Deleted")
        }
      })
  })

const giveBackVisit = (res, id, index, next, callback) => {
  User.findOne({_id: id}, (err, user) => {
      if (err){
          res.status(500)
          return next(err)
      }
      const { visitsRemaining } = user
      visitsRemaining.splice(index, 1, visitsRemaining[index] + 1)
      User.findOneAndUpdate(
          {_id: id},
          {visitsRemaining: visitsRemaining},
          {new: true}, 
          (err, updatedUser) => {
          if (err){
            res.status(500)
            return next(err)
          }
          callback("Done")
      })
  })
}

const refund = (res, chargeId, amount, refundFee, next, callback) => {
  GeneralInfo.find((err, info) => {
    if (err){
        res.status(500)
        return next(err)
    }
    const stripe_account_id = info[0].connected_stripe_account
    stripe.refunds.create({
      charge: chargeId,
      amount: amount,
      refund_application_fee: refundFee
    },{ stripe_account: stripe_account_id }, 
    (err, refund) => {
      if (err){
        res.status(500)
        return next(err)
      }
      callback(refund)
    })
  })
}

const updateCanceledAppointment = (res, id, updates, next, callback) => {
  Appointment.findOneAndUpdate(
    {_id: id},
    updates,
    {new: true},
    (err, updatedAppointment) => {
        if (err){
          res.status(500)
          return next(err)
        }
       callback(updatedAppointment.googleId)
    })
} 

const deleteEventOnGoogle = (res, googleId, next, callback) => {
  if (googleId === ""){
    callback("No calendar event to delete!")
  } else {
    fs.readFile('credentials.json', (err, content) => {
      if (err) {
        res.status(500)
        return next(err)
      }
      authorize(res, next, JSON.parse(content), (auth) => {
        const calendar = google.calendar({version: 'v3', auth});
        calendar.events.delete({
          calendarId: 'primary',
          sendNotifications: true,
          eventId: googleId,
        }, (err) => {
          if (err) {
            res.status(500)
            return next(err)
          }
          callback('Event deleted.')
        });
      });
    }); 
  }
}

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
      // Store the token to database for later program executions
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

module.exports = googleRouter;