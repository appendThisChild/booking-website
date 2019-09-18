import React from "react"

import { withAppointment } from "../context/AppointmentProvider.js"
import { withTherapist } from "../context/TherapistProvider.js"
import { withUser } from "../context/UserProvider.js"

// firstCharCap

const TherapistTimeChoice = props => {
    const { therapists, handleChange, therapistID, appLengthInMinutes, appLengths } = props
    const mappedTherapists = therapists.map((therapist, i) => 
        <option value={therapist._id} key={i}>{props.firstCharCap(therapist.firstName)} {props.firstCharCap(therapist.lastName)}</option>
    )
    const mappedAppLengths = appLengths.map((length, i) => 
        <option value={length} key={i}>{length} Minutes</option>
    )
    return(
        <div>
            <form >
                <select name="therapistID" required={true} value={therapistID} onChange={handleChange}>
                    <option value="">Select Therapist</option>
                    {mappedTherapists}
                </select>
                <select name="appLengthInMinutes" required={true} value={appLengthInMinutes} onChange={handleChange}>
                <option value="">Select Appointment Length</option>
                    {mappedAppLengths}
                </select>
            </form>
        </div>
    )
}

export default withUser(withAppointment(withTherapist(TherapistTimeChoice)));