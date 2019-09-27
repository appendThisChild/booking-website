import React from "react"

import { withToggler } from "./Toggler.js"
import { withUser } from "../context/UserProvider.js"
import { withOwner } from "../context/OwnerProvider.js"

import Availability from "./Availability.js"

const Account = props => {
    const { firstName, lastName, visitsRemaining, on, isTherapist, email, phoneNumber, address, availability, _id, callback } = props
    const { street, city, state, zipcode } = address
    const pho1 = props.numberDisplay(phoneNumber)
    const mappedAvailabilty = availability.map((arr, i) => <Availability key={i} arr={arr}/>)
    return(
        <div>
            <div onClick={props.toggle}>
                <span>{props.firstCharCap(firstName)} {props.firstCharCap(lastName)}</span>
                <span>Visits Remaining: {visitsRemaining}</span>
            </div>
            {!on ?
            <div>
                <button onClick={() => props.getAccountHistory(_id, () => callback() )}>Get Appointment History</button>
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