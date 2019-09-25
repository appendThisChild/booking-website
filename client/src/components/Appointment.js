import React from "react"


const Appointment = props => {
    const { appLengthInMinutes, appDate, therapistName, address } = props.appointment
    const { street, city, state, zipcode } = address
    const date = new Date(appDate)
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



            {/* <p>Phone #: </p> */}

            {/* This fourth */}
            {/* the phone number for the therapist to this showing of the the selected appointment */}
            {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
            {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
            {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
            {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
            {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}

            <p>Date: {date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}</p>
            <p>Time: {hour}:{min} {amPm}</p>
            <p>Length: {appLengthInMinutes} Minutes</p>
            <p>Address:</p>
            <p>{street}</p>
            <p>{city}</p>
            <p>{state}</p>
            <p>{zipcode}</p>
        </div>
    )
}

export default Appointment;