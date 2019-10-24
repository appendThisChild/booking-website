import React from "react"

import { withAppointment } from "../context/AppointmentProvider.js"
import { withTherapist } from "../context/TherapistProvider.js"
import { withUser } from "../context/UserProvider.js"

// firstCharCap

const TherapistTimeChoice = props => {
    const { therapists, handleChange, therapistID, appLengthInMinutes, appLengths, handleSubmit } = props
    const mappedTherapists = therapists.map((therapist, i) => 
        <option value={therapist._id} key={i}>{props.firstCharCap(therapist.firstName)} {props.firstCharCap(therapist.lastName)}</option>
    )
    const mappedAppLengths = appLengths.map((length, i) => 
        <option value={length} key={i}>{length} Minutes</option>
    )
    return(
        <div className="selectTherapist">
            <h3>Book a Massage:</h3>
            <form onSubmit={handleSubmit}>
                {/* <div> */}
                    <select name="therapistID" value={therapistID} onChange={handleChange} required={true}>
                        <option>Select Therapist</option>
                        {mappedTherapists}
                    </select>
                {/* </div> */}
                {/* <div> */}
                    <select name="appLengthInMinutes" required={true} value={appLengthInMinutes} onChange={handleChange}>
                        <option>Select Appointment Length</option>
                        {mappedAppLengths}
                    </select>
                {/* </div> */}
                <button>Pick Time</button>
            </form>
        </div>
    )
}

export default withUser(withAppointment(withTherapist(TherapistTimeChoice)));