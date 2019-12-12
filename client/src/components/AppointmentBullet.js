import React from "react"

import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"
import { withToggler } from "./Toggler.js"

const AppointmentBullet = props => {
    const {
        _id,
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
        inStudio,
        travelFee,
        future
    } = props
    const { street, city, state, zipcode } = address
    const packages = ["Pre-Paid Massage", "One Massage", "Three Massage Package"]
    const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
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
    const intakeEntries = Object.entries(intake.body)
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
    let amountShown = amount
    if (!client){
        amountShown = amount + travelFee
    }
    const noRequest = specailRequests.every((element) => element === null)
    return(
        <div className={`${canceled ? "appointmentCanceled " : ""}appointmentBullet${props.on ? "": " appointmentOpened"}`}>
            <div>
                
                <span>{date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()} ({daysOfTheWeek[date.getDay()]})</span>
                <span>|</span>
                <span>@ {hour}:{min} {amPm}</span>
                <span>|</span>
                <span>{appLengthInMinutes} Minutes</span>
            </div>
            {props.on ?
            null
            :
            <div>
                 {(future && client) || (future && therapist) ?
                <>
                    {!canceled ?
                    <>
                        <button onClick={() => props.cancelAppointment(_id, therapist)}>Cancel Appointment</button>
                    </>
                    :null}
                </>
                :null}
                <>
                    <p>Amount: ${amountShown / 100}</p>
                    <p>Therapist: {therapistName}</p>
                    <p>Therapist #: {phoStr1}</p>
                    <p>Location: {inStudio ? "In Studio" : "On-Site"}</p>
                    <p>Address:</p>
                    <p>{street},</p>
                    <p>{city}, {state} {zipcode}</p>
                </>
                {!client ?
                <div>
                    <p>Client: {clientName}</p>
                    <p>Client #: {phoStr2}</p>
                    <p>Package Choice: {packages[packageChoice]}</p>
                    <h4>Special Requests:</h4>
                    <p>Body:</p>
                    {noRequest ? <p>"None"</p> : specailRequests}
                    <p>Comments:</p>
                    <p>"{intake.comments === "" ? 'None' : intake.comments}"</p>
                </div>
                :null}
            </div>
            }
            <nav>
                <span onClick={props.toggle}>{props.on ? "Expand" : "Condense"}</span>
            </nav>
        </div>
    )
}

export default withAppointment(withUser(withToggler(AppointmentBullet)));