import React from "react"

import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"
import { withToggler } from "./Toggler.js"

const AppointmentBullet = props => {
    const {
        _id,
        googleId,
        clientID,
        appDate, 
        appLengthInMinutes, 
        amount, 
        address, 
        clientName, 
        therapistName, 
        canceled, 
        packageChoice, 
        therapistPhoneNumber, 
        clientPhoneNumber,
        client,
        therapist,
        future
    } = props
    const { street, city, state, zipcode } = address
    const packages = ["Pre-Paid Massage", "One Massage", "Three Massage Package"]
    const phoStr1 = props.numberDisplay(therapistPhoneNumber)
    const phoStr2 = props.numberDisplay(clientPhoneNumber)
    const date = new Date(appDate)
    let hour = date.getHours()
    let min = date.getMinutes()
    let amPm = "am"
    if (date.getHours() === 0){
        hour = 12
    } else if (date.getHours() === 12){
        amPm = "pm"
    } else if (date.getHours() > 12){
        hour = date.getHours() - 12;
        amPm = "pm";
    }
    if (date.getMinutes() === 0) min = "00";
    return(
        <div>

            {/* Edit later to change color */}
            {canceled ? <span>"Appointment below was canceled"</span>: null}


            <div onClick={props.toggle}>
                <span>Date: {date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}</span>
                <span>Time: {hour}:{min} {amPm}</span>
                <span>Length: {appLengthInMinutes} Minutes</span>
                <span>Amount: ${amount / 100}</span>
            </div>
            {props.on ?
            null
            :
            <>
                <div>
                    <span>Therapist: {therapistName}</span>
                    <span>Phone #: {phoStr1}</span>
                    <span>Address:</span>
                    <span>{street}</span>
                    <span>{city}</span>
                    <span>{state}</span>
                    <span>{zipcode}</span>
                </div>
                {!client ?
                <div>
                    <span>Client: {clientName}</span>
                    <span>Phone #: {phoStr2}</span>
                    <span>Package Choice: {packages[packageChoice]}</span>
                </div>
                :null}
                {(future && client) || (future && therapist) ?
                <>
                    {!canceled ?
                    <div>
                        <button onClick={() => props.cancelAppointment(appLengthInMinutes, clientID, appDate, client, _id, googleId)}>Cancel Appointment</button>
                    </div>
                    :null}
                </>
                :null}
            </>
            }
        </div>
    )
}

export default withAppointment(withUser(withToggler(AppointmentBullet)));