import React, { Component } from "react"


import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"
import { withTherapist } from "../context/TherapistProvider.js"


class Book extends Component {
    constructor(){
        super()
        this.state = {

        }
    }
    componentDidMount(){
        this.props.getAllTherapists()
    }
    handlePickTime = e => {
        e.preventDefault()

        this.props.makingAppointment()
        this.props.history.push('/pickTime')
    }
    render(){
        const { therapists, handleChange, therapistID, appLengthInMinutes, appLengths } = this.props
        const mappedTherapists = therapists.map((therapist, i) => 
            <option value={therapist._id} key={therapist._id}>{therapist.firstName} {therapist.lastName}</option>
        )
        const mappedAppLengths = appLengths.map((length, i) =>
            <option value={length} key={i}>{length} Minutes</option>
        )
        return(
            <div>
                <form onSubmit={this.handlePickTime}>
                    <select name="therapistID" required={true} value={therapistID} onChange={handleChange}>
                        <option value="">Select Therapist</option>
                        {mappedTherapists}
                    </select>
                    <select name="appLengthInMinutes" required={true} value={appLengthInMinutes} onChange={handleChange}>
                    <option value="">Select Appointment Length</option>
                        {mappedAppLengths}
                    </select>
                    <button>Pick Time</button>
                </form>
            </div>
        )
    }
}

export default withAppointment(withTherapist(withUser(Book)));