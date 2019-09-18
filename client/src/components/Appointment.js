import React from "react"


const Appointment = props => {
    const { appLengthInMinutes, appDate, therapistName } = props.appointment
    // address
    const date = new Date(appDate)
    let min = date.getHours()
    let sec = date.getMinutes()
    let amPm = "am"
    if (date.getHours() > 12){
        min = date.getHours() -12;
        amPm = "pm";
    }
    if (date.getMinutes() === 0) sec = "00";
    return(
        <div>
            <h1>Your Appointment:</h1>
            <p>Therapist's Name: {therapistName}</p>
            <p>Date: {date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}</p>
            <p>Time: {min}:{sec} {amPm}</p>
            <p>Length: {appLengthInMinutes} Minutes</p>
            <p>Address:</p>
            {/* <p>{address.street}</p>
            <p>{address.city}</p>
            <p>{address.state}</p>
            <p>{address.zipcode}</p> */}
        </div>
    )
}

export default Appointment;