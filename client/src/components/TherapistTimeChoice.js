import React from "react"

import { withAppointment } from "../context/AppointmentProvider.js"
import { withTherapist } from "../context/TherapistProvider.js"
import { withUser } from "../context/UserProvider.js"

// firstCharCap

const TherapistTimeChoice = props => {
    const { therapists, handleChange, therapistID, appLengthInMinutes, inStudio, appLengths, handleSubmit, className, cancelButton, cancelFunction } = props
    const mappedTherapists = therapists.map((therapist, i) => 
        <option value={therapist._id} key={i}>{props.firstCharCap(therapist.firstName)} {props.firstCharCap(therapist.lastName)}</option>
    )
    const mappedAppLengths = appLengths.map((length, i) => 
        <option value={length} key={i}>{length} Minutes</option>
    )
    const selectedTherapist = therapists.filter(therapist => {
        return therapist._id === therapistID
    })
    let studio = true
    let site = true
    if (therapistID !== ""){
        studio = selectedTherapist[0].placements.inStudio
        site = selectedTherapist[0].placements.onSite
    }
    return(
        <div className={className}>
            {cancelButton ?
            <button type="button" onClick={cancelFunction}>Cancel Edit</button>
            :null}
            <form onSubmit={handleSubmit}>
                    <select name="therapistID" value={therapistID} onChange={handleChange} required={true}>
                        <option>Select Therapist</option>
                        {mappedTherapists}
                    </select>
                    <select name="appLengthInMinutes" required={true} value={appLengthInMinutes} onChange={handleChange}>
                        <option>Select Length</option>
                        {mappedAppLengths}
                    </select>
                    {therapistID !== "" ?
                    <select name="inStudio" required={true} value={inStudio} onChange={handleChange}>
                        {studio ? <option value={true}>In Studio</option> :null}
                        {site ? <option value={false}>On-Site</option> :null}
                    </select>
                    : null}
                    
                <button type="submit">Find Times</button>
            </form>
        </div>
    )
}

export default withUser(withAppointment(withTherapist(TherapistTimeChoice)));