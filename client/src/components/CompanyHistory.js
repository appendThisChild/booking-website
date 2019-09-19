import React, { Component } from "react"

// import Appointment from "./Appointment.js"
import ProfileNav from "./ProfileNav.js"
import AppointmentHistory from "./AppointmentHistory.js"

import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"

class CompanyHistory extends Component {
    constructor(){
        super()
        this.state = {
            upcomingAppointments: [],
            pastAppointments: [],
            dataIn: false
        }
    }


    componentDidMount(){
        this.props.getAllCompanyAppointments(() => {
            const order = this.props.orderAppointments(this.props.companyAppointments)
            this.setState({ upcomingAppointments: order[1], pastAppointments: order[0], dataIn: true })
        })
    }

    render(){
        const { upcomingAppointments, pastAppointments, dataIn } = this.state
        return(
            <div>
                Company History
                    {/* All appointments - with amount breakoutdowns - "Similar to therapist breakdown, but all appointments" */}
                <ProfileNav />
                {dataIn ?
                <>
                    <AppointmentHistory history={upcomingAppointments} title={"Upcoming Appointments"} subTitle={"New to Newest"}/>
                    <AppointmentHistory history={pastAppointments} title={"Past Appointments"} subTitle={"Old to Oldest"}/>
                </>
                : null
                }
            </div>
        )
    }
}

export default withAppointment(withUser(CompanyHistory));