import React from "react"

import { withAppointment } from "../context/AppointmentProvider.js"
import { withTherapist } from "../context/TherapistProvider.js"

const TherapistTimeChoice = props => {
    const { therapists, handleChange, therapistID, appLengthInMinutes, appLengths } = props
    const mappedTherapists = therapists.map((therapist, i) => 
        <option value={therapist._id} key={i}>{therapist.firstName} {therapist.lastName}</option>
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

export default withAppointment(withTherapist(TherapistTimeChoice));