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
            daysOfTheWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            email: props.user.email,
            firstName: props.user.firstName,
            lastName: props.user.lastName,
            address: props.user.address,
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
        const value = e.target.value
        const name = e.target.name
        this.setState(prevState => ({
            address: {
                ...prevState.address,
                [name]: value 
            }
        }))
    }
    handleAvailabilityChange = e => {
        const value = Number(e.target.value)
        const name = e.target.name
        name.split("")
        const availabilityArr = this.state.availability.map((day, i) => {
            if (i === Number(name[0])){
                return day.map((time, j) => {
                    if (j === Number(name[1])){ return value }
                    else { return time }
                })
            } else { return day }
        })
        this.setState({ availability: availabilityArr })
    }
    handleSubmit = e => {
        e.preventDefault()
        const infoUpdates = {
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            availability: this.state.availability,
            phoneNumber: this.state.phoneNumber
            // deconstruct number into just numbers
        }
        console.log(infoUpdates);
        // this.props.updateBounty(this.props._id, bountyUpdates)
        this.props.toggle()



        // This is next issue ^^^^^^^^^^^^^^^^
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    }

    render(){
        const { email, firstName, lastName, address, availability, phoneNumber, visitsRemaining } = this.props.user
        const { street, city, state, zipcode } = address
        const phoStr = this.props.numberDisplay(phoneNumber)
        const mappedAvailabilty = availability.map((arr, i) => <Availability key={i} day={this.state.daysOfTheWeek[i]} arr={arr}/>)
        return(
            <div>
                <ProfileNav />
                <p>Pre-Paid Visits Remaing: {visitsRemaining}</p>
                {this.props.on ?
                <>
                    <h2>Email: </h2><p>{email}</p>
                    <h2>First Name: </h2><p>{firstName}</p>
                    <h2>Last Name: </h2><p>{lastName}</p>
                    <h2>Phone #: </h2><p>{phoStr}</p>

                    {/* Change so only therapist can change the info below */}

                    <h2>Adress: </h2>
                    <p>{street}</p>
                    <p>{city}</p>
                    <p>{state}</p>
                    <p>{zipcode}</p>
                    <h2>Availability: </h2>
                    {mappedAvailabilty}


                    
                    <button onClick={this.props.toggle}>Edit Information</button>
                </>
                :
                <>
                    <InfoForm 
                        handleChange={this.handleChange}
                        daysOfTheWeek={this.state.daysOfTheWeek}
                        handleAddressChange={this.handleAddressChange}
                        handleAvailabilityChange={this.handleAvailabilityChange}
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