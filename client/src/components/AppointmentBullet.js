import React from "react"

const AppointmentBullet = props => {
    const { appDate, appLengthInMinutes, amount } = props
    const date = new Date(appDate)
    let min = date.getHours()
    let sec = date.getMinutes()
    let amPm = "am"
    if (date.getHours() > 12){
        min = date.getHours() -12;
        amPm = "pm";
    }
    if (date.getMinutes() === 0) sec = "00";
    console.log(props)

    // great spot to incorporate a toggle
    return(
        <div>
            <span>Date: {date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}</span>
            <span>Time: {min}:{sec} {amPm}</span>
            <span>Length: {appLengthInMinutes} Minutes</span>
            <span>Amount: {amount}</span>
        </div>
    )
}

export default AppointmentBullet;