const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const express = require('express')
const googleRouter = express.Router()
const Appointment = require('../models/appointment.js')

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';

googleRouter.route('/calendar')
  .get((req, res, next) => {
    fs.readFile('credentials.json', (err, content) => {
      if (err) {
        res.status(500)
        return next(err)
      }
      authorize(JSON.parse(content), (auth) => {
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
      authorize(JSON.parse(content), (auth) => {
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
    const appId = req.params.id
    const isTherapist = req.params.isTherapist
    console.log(appId)
    console.log(isTherapist)

    // first we need to update the appointment 
      // to canceled
      // and to figure out if we are paying the therapist and how much
        // ( this will give us back the appointment )

    // check decide if refund or up one of visits Remaining
    // we'll check the appointment for package choice
      // if === 1 ( it was a single )
        // Refund, we'll check if isTherapist
          // if === true
            // we will refund 90%
            // set therapist paid amount to 0 
            // setting therapist paid to false
          // if not 
            // we'll check if within 24 hours 
              // if === true 
                // refund half
                // set therapist paid amount to half of the original - 10% of the original
              // if not
                // refund 90%
                // set therapist paid amount to 0
                // setting therapist paid to false
      // if not ( it's a prepaid or package )
        // we do not refund 
          // checking therapist paid to true
        // we will give back visits remaining if out side of 24 hours
          // setting therapist paid to false

    // delete the appointment from google calendar
      // vvvvvvvvvvvvvvvvv
      // vvvvvvvvvvvvvvvvv
      // vvvvvvvvvvvvvvvvv


      // fs.readFile('credentials.json', (err, content) => {
      //   if (err) {
      //     res.status(500)
      //     return next(err)
      //   }
      //   authorize(JSON.parse(content), (auth) => {
      //     const calendar = google.calendar({version: 'v3', auth});
      //     calendar.events.delete({
      //       calendarId: 'primary',
      //       sendNotifications: true,
      //       eventId: req.params.id,
      //     }, (err) => {
      //       if (err) {
      //         res.status(500)
      //         return next(err)
      //       }
      //       return res.status(202).send('Event deleted.');
      //     });
      //   });
      // }); 

  })

const authorize = (credentials, callback) => {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
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
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

module.exports = googleRouter;