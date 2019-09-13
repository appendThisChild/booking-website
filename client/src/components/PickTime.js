import React, { Component } from "react"

import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"
import { withTherapist } from "../context/TherapistProvider.js"

class PickTime extends Component {
    constructor(){
        super()
        this.state = {
            nextWeek: [],
            viewedWeek: 0,
            selected: {},
            monthsOftheYear: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            daysOfTheWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            weekShowing: [{}]
        }
    }
    // 
    gettingAvailability = () => {
        // console.log(this.state.selected)
        // const today = this.props.thisMoment()
        // const month = today.getMonth()
        // const dayOfWeek = today.getDay()
        // const date = today.getDate()
        // const hour = today.getHours()
        // console.log(today)
        // console.log(month)
        // console.log(dayOfWeek)
        // console.log(date)
        // console.log(hour)
        // console.log(this.state.monthsOftheYear[month])
        // console.log(this.state.daysOfTheWeek[dayOfWeek])
        const weekShowingArr = []
        const therapist = this.state.selected
        for (let i = this.state.viewedWeek; i < this.state.viewedWeek + 7; i++){
            const newDate = this.props.thisMoment()
            const dateSet = new Date(newDate.setDate(newDate.getDate() + i))
            const matchingDates = this.props.therapistAppointments.filter(obj => {
                return obj.appDate.getFullYear() === dateSet.getFullYear() && obj.appDate.getMonth() === dateSet.getMonth() && obj.appDate.getDate() === dateSet.getDate()
            })
            // const timesAvailable = []
            let startTime = 0
            let endTime = 0
            if (dateSet.getDay() === 0){
                startTime = therapist.availabilitySundayHourStart;
                endTime = therapist.availabilitySundayHourEnd
            } else if (dateSet.getDay() === 1){
                startTime = therapist.availabilityMondayHourStart
                endTime = therapist.availabilityMondayHourEnd
            } else if (dateSet.getDay() === 2){
                startTime = therapist.availabilityTuesdayHourStart
                endTime = therapist.availabilityTuesdayHourEnd
            } else if (dateSet.getDay() === 3){
                startTime = therapist.availabilityWednesdayHourStart
                endTime = therapist.availabilityWednesdayHourEnd
            } else if (dateSet.getDay() === 4){
                startTime = therapist.availabilityThursdayHourStart
                endTime = therapist.availabilityThursdayHourEnd
            } else if (dateSet.getDay() === 5){
                startTime = therapist.availabilityFridayHourStart
                endTime = therapist.availabilityFridayHourEnd
            } else if (dateSet.getDay() === 6){
                startTime = therapist.availabilitySaturdayHourStart
                endTime = therapist.availabilitySaturdayHourEnd
            }

            // check if he has appointments for this day
            // check what the start and ends times are for those appointments 
            // block out those sections 
            // 


            // show start times for the selected length
            // for () {
                // check 
            // }






            console.log(startTime)
            console.log(endTime)
            console.log(therapist)
            console.log(matchingDates)
            weekShowingArr.push({
                year: dateSet.getFullYear(),
                month: dateSet.getMonth(),
                date: dateSet.getDate(),
                day: this.state.daysOfTheWeek[dateSet.getDay()]
            })
            // get all the days availability 
        }
        this.setState({weekShowing: weekShowingArr})
    }
    newWeek = num => {
        const newWeek = this.state.viewedWeek + num
        this.setState({ viewedWeek: newWeek }, () => this.gettingAvailability())
    }


    componentDidMount(){
        // get all therapists current appointments
        const today = this.props.thisMoment()
        const hour = today.getHours()
        let weekToView = 1
        if ( hour > 17 ) {
            weekToView = 2
        }
        if(this.props.therapistID === "") this.props.history.push("/book")
        const selectedTherapist = this.props.therapists.find(therapist => therapist._id = this.props.therapistID)
        this.props.handleNameIDAdd(
            this.props.user._id, 
            `${this.props.user.firstName} ${this.props.user.lastName}`, 
            `${selectedTherapist.firstName} ${selectedTherapist.lastName}`
        )
        this.setState({ 
            selected: selectedTherapist, 
            viewedWeek: weekToView
        }, () => this.gettingAvailability())
    }
    render(){
        const { appLengthInMinutes, therapistName } = this.props
        console.log(this.state.weekShowing)
        return(
            <div>
                <div>
                    <p>Therapist: {therapistName}</p>
                    <p>{appLengthInMinutes} Minutes</p>
                </div>
                <div>
                    {this.state.viewedWeek < 6 ?
                    null
                    :
                    <span onClick={() => {this.newWeek(-7)}}>{"<<<"}</span>}
                    {this.state.viewedWeek > 90 ?
                    null
                    :
                    <span onClick={() => {this.newWeek(7)}}>{">>>"}</span>}
                    
                </div>
                <div>
                    <h1>Sunday</h1>
                </div>
                <div>
                    <h1>Monday</h1>
                </div>
                <div>
                    <h1>Tuesday</h1>
                </div>
                <div>
                    <h1>Wednesday</h1>
                </div>
                <div>
                    <h1>Thursday</h1>
                </div>
                <div>
                    <h1>Friday</h1>
                </div>
                <div>
                    <h1>Saturday</h1>
                </div>
            </div> 
        )
    }
}

export default withAppointment(withTherapist(withUser(PickTime)));