import React, { Component } from "react"

// import Appointment from "./Appointment.js"
import ProfileNav from "./ProfileNav.js"

import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"

class Profile extends Component {
    constructor(){
        super()
        this.state = {

        }
    }
    componentDidMount(){
        // 
    }

    render(){
        return(
            <div>
                <ProfileNav />
                {/* Have upcoming appointments as client be on the main page */}

            </div>
        )
    }
}

export default withAppointment(withUser(Profile));