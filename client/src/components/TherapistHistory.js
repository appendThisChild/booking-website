import React, { Component } from "react"

// import Appointment from "./Appointment.js"
import ProfileNav from "./ProfileNav.js"

import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"

class TherapistHistory extends Component {
    constructor(){
        super()
        this.state = {
            upcomingAppointments: [],
            pastAppointments: []
        }
    }
    componentDidMount(){
        this.props.getAllTherapistAppointments(this.props.user._id, () => {
            const order = this.props.orderAppointments(this.props.therAppointments)
            this.setState({ upcomingAppointments: order[1], pastAppointments: order[0] })
        })
    }

    render(){
        // const { upcomingAppointments, pastAppointments } = this.state
        return(
            <div>
                Therapist History
                    {/* past and current appointments - by month breakdowns - weekly & monthly totals - appointment searches  */}
                <ProfileNav />
                
                 
            </div>
        )
    }
}

export default withAppointment(withUser(TherapistHistory));