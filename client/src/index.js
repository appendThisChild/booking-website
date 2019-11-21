import React from "react"
import ReactDOM from "react-dom"
import App from "./App.js"
import { BrowserRouter} from "react-router-dom"
import "./styles.css"

// Providers
import UserProvider from "./context/UserProvider.js"
import AppointmentProvider from "./context/AppointmentProvider.js"
import TherapistProvider from "./context/TherapistProvider.js"
import OwnerProvider from "./context/OwnerProvider.js";
import BlackoutDatesProvider from "./context/BlackoutDatesProvider.js"
import ImageProvider from "./context/ImageProvider.js";
import GoogleCalendarProvider from "./context/GoogleCalendarProvider.js"
import GeneralInfoProvider from "./context/GeneralInfoProvider.js"
import EmailProvider from "./context/EmailProvider.js"
import ReviewProvider from "./context/ReviewProvider.js"
import { PasswordRecoveryProvider } from "./context/PasswordRecoveryProvider.js"

ReactDOM.render(
    <BrowserRouter>
        <GoogleCalendarProvider>
            <UserProvider>
                <AppointmentProvider>
                    <TherapistProvider>
                        <OwnerProvider>
                            <BlackoutDatesProvider>
                                <ImageProvider>
                                    <ReviewProvider>
                                        <GeneralInfoProvider>
                                            <EmailProvider>
                                                <PasswordRecoveryProvider>
                                                    <App />
                                                </PasswordRecoveryProvider>
                                            </EmailProvider>
                                        </GeneralInfoProvider>
                                    </ReviewProvider>
                                </ImageProvider>
                            </BlackoutDatesProvider>
                        </OwnerProvider>
                    </TherapistProvider>
                </AppointmentProvider>
            </UserProvider>
        </GoogleCalendarProvider>
    </BrowserRouter>
,
document.getElementById("root"))