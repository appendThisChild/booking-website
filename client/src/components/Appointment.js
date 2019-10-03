import React from "react"

import { withUser } from "../context/UserProvider.js"

const Appointment = props => {
    const { appLengthInMinutes, appDate, therapistName, address} = props.appointment
    // therapistPhoneNumber
    const { street, city, state, zipcode } = address
    const date = new Date(appDate)
    // const phoStr1 = props.numberDisplay(therapistPhoneNumber)
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
            <h1>Your Appointment:</h1>
            <p>Therapist: {therapistName}</p>
            <p>Date: {date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}</p>
            <p>Time: {hour}:{min} {amPm}</p>
            <p>Length: {appLengthInMinutes} Minutes</p>
            {/* I may not want to show this information until after the appointmenmt is paid for. */}
            <p>Address:</p>
            <p>{street}</p>
            <p>{city}</p>
            <p>{state}</p>
            <p>{zipcode}</p>
        </div>
    )
}

export default withUser(Appointment);