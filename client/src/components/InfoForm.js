import React from 'react'

import { withUser } from "../context/UserProvider.js"

const InfoForm = props => {
    const { handleSubmit, handleChange, handleAddressChange, btnText, email, firstName, lastName, address, availability, phoneNumber } = props
    const { street, city, state, zipcode } = address
    const states = [ "AK","AL","AR","AS","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"]
    const mappedStates = states.map((str, i) => <option value={str} key={i}>{str}</option> )
    // const mappedAvailability = availability.map((day, i) => {
    //     const mappedDay = day.map((time, i) => {


    //         // return(
                
    //         // )
    //     })
    // I'm trying to map through the larger arr of availability to return the "two" selectors for start and end times 
    // braing melting... continuing tomorrow


    // })
    return(
        <form onSubmit={handleSubmit}>
            <input 
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="123@mail.com"/>
            <input 
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleChange}
                placeholder="First Name"/>
            <input 
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleChange}
                placeholder="Last Name"/>
            <input 
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handleChange}
                placeholder="(###)###-####"/>        
            <p>Address:</p>
            <input 
                type="text"
                name="street"
                value={street}
                onChange={handleAddressChange}
                placeholder="123 Sesame Street"/>
            <input 
                type="text"
                name="city"
                value={city}
                onChange={handleAddressChange}
                placeholder="New York City"/>
            <select name="state" value={state} onChange={handleAddressChange}>
                <option value="">Select State</option>
                {mappedStates}
            </select>
            <input 
                type="text"
                name="zipcode"
                value={zipcode}
                onChange={handleAddressChange}
                placeholder="10128"/>
            <p>Availability:</p>
            {/* {mappedAvailability} */}
            <button>{btnText}</button>
        </form>
    )
}

export default withUser(InfoForm);