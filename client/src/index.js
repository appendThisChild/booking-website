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

ReactDOM.render(
    <BrowserRouter>
        <UserProvider>
            <AppointmentProvider>
                <TherapistProvider>
                    <OwnerProvider>
                        <BlackoutDatesProvider>
                            <ImageProvider>
                                <App />
                            </ImageProvider>
                        </BlackoutDatesProvider>
                    </OwnerProvider>
                </TherapistProvider>
            </AppointmentProvider>
        </UserProvider>
    </BrowserRouter>
,
document.getElementById("root"))