import React, { Component } from "react"

import { withAppointment } from "../context/AppointmentProvider.js"
import { withUser } from "../context/UserProvider.js"

import Appointment from "./Appointment.js";

class AppointmentBooked extends Component {
    constructor(){
        super()
        this.state = {
            dataIn: false
        }
    }
    componentDidMount(){
        const { currentAppointmentInProgress } = this.props
        if (currentAppointmentInProgress === ""){ this.props.history.push("/book")} 
        else {
            this.props.appointmentSubmitted()
            this.props.eraseKey()
            this.setState({dataIn: true})
        }
        
        // ask for phone number to update info
        // ask for body part info
        //
    }
    render(){
        const { dataIn } = this.state
        return(
            <div>
                {dataIn ?
                <>
                    <Appointment appointment={this.props.currentAppointmentInProgress} showAddress={true}/>

                </>
                :null}
                Your Appointment has been booked. Please submit additional information.
            </div>
        )
    }
}

export default withUser(withAppointment(AppointmentBooked));