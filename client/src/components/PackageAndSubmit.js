import React, { Component } from "react"
import Countdown from "react-countdown-now"

import { withAppointment } from "../context/AppointmentProvider.js"
import Appointment from "./Appointment.js";


// const 

class PackageAndSubmit extends Component {
    constructor(){
        super()
        this.state = {
            
        }
    }
    tenMinuteTimer = ({ hours, minutes, seconds, completed }) => {
        if (completed){
            this.props.history.push("/book")
            return null
        } else {
            let min = String(minutes)
            let sec = String(seconds)
            if (min.length === 1) min = "0" + minutes;
            if (sec.length === 1) sec = "0" + seconds;
            return <p>Time remaing: {min}:{sec}</p>;
        }
    }

    componentDidMount(){
        if (this.props.currentAppointmentInProgress === "") this.props.history.push("/book")
        // this is where we ask for selecting of package & payment
        // shows selection details 
        // sign wavier required
        // send update to amount, package choice, and status

    }
    render(){
        return(
            <div>
                <Countdown date={Date.now() + 600000} renderer={this.tenMinuteTimer}/>
                <Appointment appointment={this.props.currentAppointmentInProgress}/>
            </div>
        )
    }
}

export default withAppointment(PackageAndSubmit);