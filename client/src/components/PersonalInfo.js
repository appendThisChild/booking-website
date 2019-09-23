import React, { Component } from "react"

import ProfileNav from "./ProfileNav.js"
import Availability from "./Availability.js";
import InfoForm from "./InfoForm.js"

import { withUser } from "../context/UserProvider.js"
import { withToggler } from "./Toggler.js"

class PersonalInfo extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: props.user.email,
            firstName: props.user.firstName,
            lastName: props.user.lastName,
            address: props.user.address,
            // street: props.user.address.street,
            // city: props.user.address.city,
            // state: props.user.address.state,
            // zipcode: props.user.address.zipcode,
            availability: props.user.availability,
            phoneNumber: props.user.phoneNumber
        }
    }
    handleChange = e => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        this.setState({
            [e.target.name] : value
        })
    }
    handleAddressChange = e => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        const name = e.target.name
        this.setState(prevState => ({
            address: {
                ...prevState.address,
                [name]: value 
            }
        }))
    }
    handleSubmit = e => {
        e.preventDefault()
        const infoUpdates = {
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: {
                street: this.state.street,
                city: this.state.city,
                state: this.state.state,
                zipcode: this.state.zipcode,
            },
            availability: this.state.availability,
            phoneNumber: this.state.phoneNumber
            // deconstruct number into just numbers
        }
        console.log(infoUpdates);
        // this.props.updateBounty(this.props._id, bountyUpdates)
        this.props.toggle()
    }

    render(){
        console.log(this.state)
        const { email, firstName, lastName, address, availability, phoneNumber, visitsRemaining } = this.props.user
        const { street, city, state, zipcode } = address
        const phoStr = this.props.numberDisplay(phoneNumber)
        const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const mappedAvailabilty = availability.map((arr, i) => <Availability key={i} day={daysOfTheWeek[i]} arr={arr}/>)
        return(
            <div>
                <ProfileNav />
                <p>Pre-Paid Visits Remaing: {visitsRemaining}</p>
                {this.props.on ?
                <>
                    <p>Email: {email}</p>
                    <p>First Name: {firstName}</p>
                    <p>Last Name: {lastName}</p>
                    <p>Phone #: {phoStr}</p>
                    <p>Adress:</p>
                    <p>{street}</p>
                    <p>{city}</p>
                    <p>{state}</p>
                    <p>{zipcode}</p>
                    <p>Availability: </p>
                    {mappedAvailabilty}
                    <button onClick={this.props.toggle}>Edit Information</button>
                </>
                :
                <>
                    <InfoForm 
                        handleChange={this.handleChange}
                        handleAddressChange={this.handleAddressChange}
                        handleSubmit={this.handleSubmit}
                        btnText="Submit Edit"
                        {...this.state}/>
                    <button onClick={this.props.toggle}>Cancel</button>
                </>
                }
            </div>
        )
    }
}

export default withToggler(withUser(PersonalInfo));