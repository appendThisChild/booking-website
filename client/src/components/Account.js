import React from "react"

import { withToggler } from "./Toggler.js"
import { withUser } from "../context/UserProvider.js"
import { withOwner } from "../context/OwnerProvider.js"

import Availability from "./Availability.js"

const Account = props => {
    const { firstName, lastName, visitsRemaining, on, isTherapist, email, phoneNumber, address, availability, _id, getHistory, order } = props
    const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const { street, city, state, zipcode } = address
    const pho1 = props.numberDisplay(phoneNumber)
    const mappedAvailabilty = availability.map((arr, i) => <Availability key={i} day={daysOfTheWeek[i]} arr={arr}/>)
    return(
        <section>
            <div onClick={props.toggle}>
                <span>{order + 1}.) </span>
                <div>
                    <p>{props.firstCharCap(lastName)}, {props.firstCharCap(firstName)}</p>
                    <p>Visits Remaining: (#{visitsRemaining[0]}, #{visitsRemaining[1]}, #{visitsRemaining[2]})</p>
                </div>
                
            </div>
            {!on ?
            <div>
                <button onClick={() => getHistory(_id, props.isTherapist)}>Get Appointment History</button>
                <h4>Email:</h4>
                <p>{email}</p>
                <h4>Phone #:</h4>
                <p>{pho1}</p>
                {isTherapist ?
                <>
                    <h4>Address:</h4>
                    <p>{street},</p>
                    <p>{city}, {state}</p>
                    <p>{zipcode}</p>
                    <h4>Availability:</h4>
                    <aside>
                        {mappedAvailabilty}
                    </aside>
                </>
                :null}
                {props.user.isOwner ? 
                <button onClick={() => props.updateAccount(_id, {isTherapist: !isTherapist})}>{isTherapist ? "Make Client": "Make Therapist"}</button>
                :null}
            </div>
            :null}
        </section>
    )
}

export default withOwner(withUser(withToggler(Account)));