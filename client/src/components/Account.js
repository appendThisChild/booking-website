import React from "react"

import { withToggler } from "./Toggler.js"
import { withUser } from "../context/UserProvider.js"
import { withOwner } from "../context/OwnerProvider.js"

import Availability from "./Availability.js"

const Account = props => {
    const { firstName, lastName, visitsRemaining, on, isTherapist, email, phoneNumber, address, availability, _id, getHistory, order } = props
    const { street, city, state, zipcode } = address
    const pho1 = props.numberDisplay(phoneNumber)
    const mappedAvailabilty = availability.map((arr, i) => <Availability key={i} arr={arr}/>)
    return(
        <div>
            <div onClick={props.toggle}>
                <span>{order + 1}.) </span>
                <span>{props.firstCharCap(lastName)}, {props.firstCharCap(firstName)}</span>
                <span>Pre-Paid Visits: 60min - {visitsRemaining[0]} 90min - {visitsRemaining[1]} 120min - {visitsRemaining[2]}</span>
            </div>
            {!on ?
            <div>
                <button onClick={() => getHistory(_id, props.isTherapist)}>Get Appointment History</button>
                <span>Email: {email}</span>
                <span>Phone #: {pho1}</span>
                {isTherapist ?
                <div>
                    <span>Address: </span>
                    <span>{street}</span>
                    <span>{city}</span>
                    <span>{state}</span>
                    <span>{zipcode}</span>
                    <span>Availability: </span>
                    {mappedAvailabilty}
                </div>
                :null}
                {props.user.isOwner ? 
                <button onClick={() => props.updateAccount(_id, {isTherapist: !isTherapist})}>{isTherapist ? "Make Client": "Make Therapist"}</button>
                :null}
            </div>
            :null}
        </div>
    )
}

export default withOwner(withUser(withToggler(Account)));