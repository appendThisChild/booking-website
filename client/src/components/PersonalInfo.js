import React, { Component } from "react"

import ProfileNav from "./ProfileNav.js"
import Availability from "./Availability.js"
import InfoForm from "./InfoForm.js"
import BlackoutDates from "./BlackoutDates.js"
import ImageDisplay from "./ImageDisplay.js"

import { withUser } from "../context/UserProvider.js"
import { withToggler } from "./Toggler.js"

class PersonalInfo extends Component {
    constructor(props){
        super(props)
        this.state = {
            emailExists: "",
            checkInput: "",
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
        this.props.checkEmail(this.state.email, response => {
            if (!response){
                const infoUpdates = {
                    email: this.state.email,
                    firstName: this.props.inputLowercaseNospace(this.state.firstName),
                    lastName: this.props.inputLowercaseNospace(this.state.lastName),
                    address: this.state.address,
                    availability: this.state.availability,
                    phoneNumber: this.props.numberDeconstruct(this.state.phoneNumber)
                }
                this.props.updateUserInfo(infoUpdates)
                this.props.toggle()
                this.setState({emailExists: ""})
            } else {
                this.setState({
                    emailExists: '"This email already exists!"',
                    checkInput: '"Something went wrong!"'
                })
            }
        })
    }
    render(){
        const { email, firstName, lastName, address, availability, phoneNumber, visitsRemaining, isTherapist, _id } = this.props.user
        const { street, city, state, zipcode } = address
        const mappedAvailabilty = availability.map((arr, i) => <Availability key={i} day={this.state.daysOfTheWeek[i]} arr={arr}/>)
        const mappedRemaining = visitsRemaining.map((remain, i) => {
            let minutes = ""
            if (i === 0){
                minutes = "60"
            } else if (i === 1){
                minutes = "90"
            } else {
                minutes = "120"
            }
            return <p key={i}>Pre-Paid {minutes}-Minute Visits Remaining: {remain}</p>
        })
        return(
            <div>
                <ProfileNav />
                <div>
                    {mappedRemaining}
                </div>
                <button onClick={this.props.toggle}>Edit Information</button>
                {this.props.on ?
                <>
                    <h2>Email: </h2><p>{email}</p>
                    <h2>First Name: </h2><p>{this.props.firstCharCap(firstName)}</p>
                    <h2>Last Name: </h2><p>{this.props.firstCharCap(lastName)}</p>
                    <h2>Phone #: </h2><p>{this.props.numberDisplay(phoneNumber)}</p>
                    {isTherapist ?
                    <>
                        <h2>Adress: </h2>
                        <p>{street}</p>
                        <p>{city}</p>
                        <p>{state}</p>
                        <p>{zipcode}</p>
                        <h2>Availability: </h2>
                        {mappedAvailabilty}
                        <BlackoutDates therapistID={_id}/>
                        <ImageDisplay />
                    </>
                    : null}
                </>
                :
                <>
                    <button onClick={this.props.toggle}>Cancel</button>
                    <InfoForm 
                        handleChange={this.handleChange}
                        daysOfTheWeek={this.state.daysOfTheWeek}
                        handleAddressChange={this.handleAddressChange}
                        handleAvailabilityChange={this.handleAvailabilityChange}
                        handleSubmit={this.handleSubmit}
                        btnText="Submit Edit"
                        emailExists={this.state.emailExists}
                        checkInput={this.state.checkInput}
                        {...this.state}/>
                </>
                }
            </div>
        )
    }
}

export default withToggler(withUser(PersonalInfo));