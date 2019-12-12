import React from "react"

import { withUser } from "../context/UserProvider.js"

const Appointment = props => {
    const { showAddress, showTherapistInfo } = props
    const { appLengthInMinutes, appDate, therapistName, address, therapistPhoneNumber, inStudio } = props.appointment
    const { street, city, state, zipcode } = address
    const date = new Date(appDate)
    const phoStr1 = props.numberDisplay(therapistPhoneNumber)
    let hour = date.getHours()
    let min = date.getMinutes()
    let amPm = "am"
    if (date.getHours() === 0){
        hour = 12
    } else if (date.getHours() === 12){
        amPm = "pm"
    } else if (date.getHours() > 12){
        hour = date.getHours() -12;
        amPm = "pm";
    }
    if (date.getMinutes() === 0) min = "00";
    return(
        <div>
            <h2>Your Appointment:</h2>
            <p>Therapist: {therapistName}</p>
            <p>Date: {date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}</p>
            <p>Time: {hour}:{min} {amPm}</p>
            <p>Length: {appLengthInMinutes} Minutes</p>
            <p>Location: {inStudio ? "In Studio" : "On-Site"}</p>
            {showAddress ?
            <>
                <h3>Location:</h3>
                <p>{street},</p>
                <p>{city}, {state}</p>
                <p>{zipcode}</p>
            </>
            :null}  
            {showTherapistInfo ?
            <>
                <h3>Therapist's info:</h3>
                <p>{phoStr1}</p>
            </>
            :null}  
        </div>
    )
}

export default withUser(Appointment);