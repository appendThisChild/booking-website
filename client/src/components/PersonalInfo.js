import React, { Component } from "react"

import ProfileNav from "./ProfileNav.js"
import Availability from "./Availability.js"
import InfoForm from "./InfoForm.js"
import BlackoutDates from "./BlackoutDates.js"
import ImageDisplay from "./ImageDisplay.js"

import DefaultImg from "../images/default-img.jpg"
import { withImage } from '../context/ImageProvider.js'

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
            placements: props.user.placements,
            phoneNumber: props.user.phoneNumber,
            imageDisplay: DefaultImg
        }
    }
    handleChange = e => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        this.setState({
            [e.target.name] : value
        })
    }
    handlePlacementsChange = e => {
        const value = e.target.value
        const name = e.target.name
        this.setState(prevState => ({
            placements: {
                ...prevState.placements,
                [name]: value === "true" ? true : false
            }
        }))
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
                    placements: this.state.placements,
                    phoneNumber: this.props.numberDeconstruct(this.state.phoneNumber)
                }
                this.props.updateUserInfo(infoUpdates, () => {})
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
    // updateState
    componentDidMount(){
        window.scroll(0,0)
    }
    UNSAFE_componentWillMount(){
        this.props.getCurrentinfo(this.props.user._id, () => {
            if (this.state.imageDisplay === DefaultImg){
                const { profileImgName } = this.props.user
                if (profileImgName !== "none"){
                    this.props.getFile(profileImgName, (image) => this.setState({ imageDisplay: image }))
                }
            }
        })
    }
    render(){
        const { email, firstName, lastName, address, availability, phoneNumber, visitsRemaining, isTherapist, _id, placements } = this.props.user
        const { street, city, state, zipcode } = address
        const mappedAvailabilty = availability.map((arr, i) => <Availability key={i} day={this.state.daysOfTheWeek[i]} arr={arr}/>)
        const mappedRemaining = visitsRemaining.map((remain, i) => {
            let minutes = ""
            if (i === 0){
                minutes = "60"
            } else if (i === 1){
                minutes = "75"
            } else {
                minutes = "90"
            }
            return <p key={i}>{minutes}-Minute: {remain}</p>
        })
        const placementsArr = Object.entries(placements)
        const mappedPlacements = placementsArr.map((arr, i) => <p key={i}>{arr[0] === "inStudio" ? "In Studio" : "On-Site"}: {arr[1] ? "Yes" : "No"}</p>)
        return(
            <div className="personalInfoBackground">
                <ProfileNav isOn={1}/>
                {this.props.on ?
                <main>
                    <section>
                        <h5>Pre-paid Visits Remaining:</h5>
                        <div>
                            {mappedRemaining}
                        </div>
                    </section>
                    <button onClick={this.props.toggle}>Edit Information</button>
                    <h2>Email:</h2>
                    <p>{email}</p>
                    <h2>First Name:</h2>
                    <p>{this.props.firstCharCap(firstName)}</p>
                    <h2>Last Name:</h2>
                    <p>{this.props.firstCharCap(lastName)}</p>
                    <h2>Phone #:</h2>
                    <p>{this.props.numberDisplay(phoneNumber)}</p>
                    {isTherapist ?
                    <>
                        <h2>Address: </h2>
                        <p>{street},</p>
                        <p>{city}, {state}</p>
                        <p>{zipcode}</p>
                        <h2>Availability: </h2>
                        {mappedAvailabilty}
                        <h2>In Studio or On-Site: </h2>
                        {mappedPlacements}
                        <BlackoutDates therapistID={_id}/>
                        <ImageDisplay imageDisplay={this.state.imageDisplay}/>
                    </>
                    : null}
                </main>
                :
                <main>
                    <button onClick={this.props.toggle}>Cancel Edit</button>
                    <InfoForm 
                        handleChange={this.handleChange}
                        daysOfTheWeek={this.state.daysOfTheWeek}
                        handleAddressChange={this.handleAddressChange}
                        handleAvailabilityChange={this.handleAvailabilityChange}
                        handlePlacementsChange={this.handlePlacementsChange}
                        handleSubmit={this.handleSubmit}
                        btnText="Submit Edit"
                        emailExists={this.state.emailExists}
                        checkInput={this.state.checkInput}
                        {...this.state}
                    />
                </main>
                }
            </div>
        )
    }
}

export default withImage(withToggler(withUser(PersonalInfo)));