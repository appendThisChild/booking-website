import React, { Component } from "react"

// import Appointment from "./Appointment.js"
import ProfileNav from "./ProfileNav.js"

import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"

class History extends Component {
    constructor(){
        super()
        this.state = {
            upcomingAppointments: [],
            pastAppointments: []
        }
    }
    componentDidMount(){
        this.props.getAllClientAppointments(this.props.user._id, () => {
            const order = this.props.orderAppointments(this.props.clientAppointments)
            this.setState({ upcomingAppointments: order[1], pastAppointments: order[0] })
        })
    }

    render(){
        // const { upcomingAppointments, pastAppointments } = this.state
        return(
            <div>
                History
                    {/* All of the appointments for that user */}
                    {/* Split past and current */}
                    {/* How many appointments remaining */}
                <ProfileNav />
                
                
            </div>
        )
    }
}

export default withAppointment(withUser(History));