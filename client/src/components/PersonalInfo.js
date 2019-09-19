import React, { Component } from "react"

import ProfileNav from "./ProfileNav.js"

import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"

class PersonalInfo extends Component {
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
                Peronsal Info
                    {/* All the info attached to that user account */}
                    {/* Ability to edit information */}
                    
            </div>
        )
    }
}

export default withAppointment(withUser(PersonalInfo));