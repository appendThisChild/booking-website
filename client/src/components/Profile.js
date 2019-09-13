import React, { Component } from "react"

import Appointment from "./Appointment.js"

import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"

class Profile extends Component {
    constructor(){
        super()
        this.state = {

        }
    }
    componentDidMount(){
        // get client history
        if (this.props.user.isTherapist){
            // get therapist history
        }
        if (this.props.user.isOwner){
            // get owner history
            console.log("Owner Called")
            this.props.getAllAppointments()
        }
    }

    render(){
        const { user, ownerAppointments } = this.props
        console.log(this.props)
        const mappedOwnerAppointments = ownerAppointments.map((appointment ,i ) =>
            <Appointment 
                {...appointment}

                key={appointment._id}
            />
        )
        return(
            <div>
                <div>
                Client
                </div>
                {user.isTherapist ?
                <div>
                Therapist
                </div>
                : null
                }
                {user.isOwner ?
                <div>
                Owner
                {mappedOwnerAppointments}
                </div>
                : null
                }
            </div>
        )
    }
}

export default withAppointment(withUser(Profile));