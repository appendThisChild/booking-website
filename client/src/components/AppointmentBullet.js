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
        intake,
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
    const intakeEntries = Object.entries(intake)
    const specailRequests = intakeEntries.map((bodyPart, i) => {
        const name = bodyPart[0]
        const foundIndexs = []
        bodyPart[1].forEach((statement, j) => {
            if (statement) foundIndexs.push(j);
        })
        const display = foundIndexs.map((index, k) => {
            let second = ""
            if (k === 1) second = " & "
            return <span key={k}>{index === 0 ? "Left Side" : `${second}Right Side`}</span>
        })
        if (foundIndexs.length !== 0){
            return(
                <div key={i}>
                    <p>{`${props.firstCharCap(name)}:`}</p>
                    {display}
                </div>
            )
        } else {
            return null
        }
        
    })
    const noRequest = specailRequests.every((element) => element === null)
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
                    <p>Therapist: {therapistName}</p>
                    <p>Phone #: {phoStr1}</p>
                    <p>Address:</p>
                    <p>{street}</p>
                    <p>{city}</p>
                    <p>{state}</p>
                    <p>{zipcode}</p>
                </div>
                {!client ?
                <div>
                    <p>Client: {clientName}</p>
                    <p>Phone #: {phoStr2}</p>
                    <p>Package Choice: {packages[packageChoice]}</p>
                    <p>Special Requests:</p>
                    {noRequest ? '"None"' : specailRequests}
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