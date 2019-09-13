import React from "react"
import ReactDOM from "react-dom"
import App from "./App.js"
import { BrowserRouter} from "react-router-dom"
import "./styles.css"

// Providers
import UserProvider from "./context/UserProvider.js"
import AppointmentProvider from "./context/AppointmentProvider.js"
import TherapistProvider from "./context/TherapistProvider.js"

ReactDOM.render(
    <BrowserRouter>
        <UserProvider>
            <AppointmentProvider>
                <TherapistProvider>
                    <App />
                </TherapistProvider>
            </AppointmentProvider>
        </UserProvider>
    </BrowserRouter>
,
document.getElementById("root"))