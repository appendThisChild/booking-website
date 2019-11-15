import React from 'react'

import { withUser } from "../context/UserProvider.js"

const InfoForm = props => {
    const { handleSubmit, handleChange, handleAddressChange, handleAvailabilityChange, btnText, email, firstName, lastName, address, availability, phoneNumber, daysOfTheWeek, emailExists, checkInput } = props
    const { street, city, state, zipcode } = address
    const states = [ "AK","AL","AR","AS","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"]
    const timeNames = []
    const timeAmounts = []
    const mappedStates = states.map((str, i) => <option value={str} key={i}>{str}</option> )
    for (let i = 0; i < 48; i++){
        const time = i / 2
        let amPm = "am"
        let hour = parseInt(time)
        let min = "00"
        if (time % 1 === .5){
            min = "30"
        }
        if (parseInt(time) === 0){
            hour = 12
        } else if (parseInt(time) === 12){
            amPm = "pm"
        } else if (parseInt(time) > 12){
            hour = parseInt(time) -12
            amPm = "pm"
        }
        timeNames.push(`${hour}:${min} ${amPm}`)
        timeAmounts.push(time * 10)
    }
    const mappedAvailabilityTimes = availability.map((day, i) => {
        const mappedDay = day.map((time, j) => {
            const startEndArr = ["Start Time", "End Time"]
            const mappedTimes = timeAmounts.map((amount, k) =>  <option value={amount} key={k}>{timeNames[k]}</option> )
            const index1 = `${i}`
            const index2 = `${j}`
            const index = index1 + index2
            return(
                <div key={j}>
                    <span>{startEndArr[j]}: </span>
                    <select name={index} value={availability[i][j]} onChange={handleAvailabilityChange}>
                        <option value={-10}>No Time Selected</option>
                        {mappedTimes}
                    </select>
                </div>
            )
        })
        return(
            <div key={i}>
                <h3>{daysOfTheWeek[i]}</h3>
                {mappedDay}
            </div>
        )
    })
    return(
        <form onSubmit={handleSubmit}>
            <h2>Email: </h2>
            <span>{emailExists}</span>
            <input 
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required={true}
                placeholder="123@mail.com"/>
            <h2>First Name: </h2>
            <input 
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleChange}
                required={true}
                placeholder="First Name"/>
            <h2>Last Name: </h2>
            <input 
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleChange}
                required={true}
                placeholder="Last Name"/>
            <h2>Phone #: </h2>
            <input 
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handleChange}
                placeholder="(###)###-####"/>
            {props.user.isTherapist ?
            <>
                <h2>Address: </h2>
                <p>Street: </p>
                <input 
                    type="text"
                    name="street"
                    value={street}
                    onChange={handleAddressChange}
                    placeholder="123 Sesame Street"/>
                <p>City: </p>
                <input 
                    type="text"
                    name="city"
                    value={city}
                    onChange={handleAddressChange}
                    placeholder="New York City"/>
                <p>State: </p>
                <select name="state" value={state} onChange={handleAddressChange}>
                    {mappedStates}
                </select>
                <p>Zip Code:</p>
                <input 
                    type="text"
                    name="zipcode"
                    value={zipcode}
                    onChange={handleAddressChange}
                    placeholder="10128"/>
                <h2>Availability: </h2>
                {mappedAvailabilityTimes}
            </>
            :null}
            <button>{btnText}</button>
            <span> {checkInput}</span>
        </form>
    )
}

export default withUser(InfoForm);