import React, { Component } from "react"

import ChoiceDisplay from "./ChoiceDisplay.js"
import AvailableAppointments from "./AvailableAppointments.js"

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
            weekShowing: [],
            editToggle: false
        }
    }
    gettingAvailability = () => {
        const weekShowingArr = []
        const therapist = this.state.selected
        const selectedAppointmentBlocks = parseInt(this.props.appLengthInMinutes) / 30
        // looks at all the data for that specific day
        for (let i = this.state.viewedWeek; i < this.state.viewedWeek + 7; i++){
            const newDate = this.props.thisMoment()
            const dateSet = new Date(newDate.setDate(newDate.getDate() + i))
            const matchingDates = this.props.therapistAppointments.filter(obj => {
                return obj.appDate.getFullYear() === dateSet.getFullYear() && obj.appDate.getMonth() === dateSet.getMonth() && obj.appDate.getDate() === dateSet.getDate()
            })
            const generalTimesAvailableForSelectedDay = []
            let startTime = 0
            let endTime = 0
            const timesAvailableForThisDayGivenDesiredLength = []
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
            // creates a list of available half hour time blocks based on selected therapist's preference
            let newTime = startTime
            for (let j = 0; j < endTime - startTime; j++) {
                if (newTime % 1 === 0){
                    if (endTime % 1 === .5 && endTime - .5 === newTime){
                        generalTimesAvailableForSelectedDay.push([newTime, 0])
                        break;
                    }   
                    for (let k = 0; k < 2; k++){
                        if (k === 0) generalTimesAvailableForSelectedDay.push([newTime, 0])
                        else if (k === 1) generalTimesAvailableForSelectedDay.push([newTime, 30])
                    }
                } else {
                    newTime = newTime - .5;
                    j--;
                    generalTimesAvailableForSelectedDay.push([newTime, 30]);
                }
                newTime++;
            }
            // takes the already booked appointments and removes them allowing for a half hour break before and after
            const appBookedBlocks = []
            matchingDates.forEach(obj => {
                let hours = obj.appDate.getHours()
                let minutes = obj.appDate.getMinutes()
                if (obj.appDate.getMinutes() === 30) minutes = 0;
                else {
                    minutes = 30;
                    hours = hours - 1;
                }
                const timeBlockArr = this.createTimeBlocks(hours, minutes, obj.appLengthInMinutes + 60)
                timeBlockArr.forEach(arr1 => {
                    const alreadyPresent = appBookedBlocks.some(arr2 => arr1[0] === arr2[0] && arr1[1] === arr2[1])
                    if (!alreadyPresent) appBookedBlocks.push(arr1)
                })
            })
            appBookedBlocks.forEach(arr1 => {
                const foundIndexToRemove = generalTimesAvailableForSelectedDay.findIndex(arr2 => arr1[0] === arr2[0] && arr1[1] === arr2[1])
                if (foundIndexToRemove !== -1) generalTimesAvailableForSelectedDay.splice(foundIndexToRemove, 1)
            })
            // compiles the list into selectable times based on clients desired length of appointment
            for (let n = 0; n < generalTimesAvailableForSelectedDay.length; n++){
                const availableTimeBlock = generalTimesAvailableForSelectedDay[n]
                const nextAvailableTimeBlock = generalTimesAvailableForSelectedDay[n + 1]
                const nextAvailableTimeBlockAfterThat = generalTimesAvailableForSelectedDay[n + 2]
                const nextAvailableTimeBlockAfterThatAgain = generalTimesAvailableForSelectedDay[n + 3]
                if (nextAvailableTimeBlock){
                    if (selectedAppointmentBlocks === 2){
                        if (availableTimeBlock[1] === 0){
                            if (nextAvailableTimeBlock[0] === availableTimeBlock[0]){
                                timesAvailableForThisDayGivenDesiredLength.push(availableTimeBlock)
                            }
                        } else {
                            if (nextAvailableTimeBlock[0] - 1 === availableTimeBlock[0] && 
                                nextAvailableTimeBlock[1] === 0){
                                timesAvailableForThisDayGivenDesiredLength.push(availableTimeBlock)
                            }
                        }
                    } else if (selectedAppointmentBlocks === 3){
                        if (nextAvailableTimeBlockAfterThat){
                            if (availableTimeBlock[1] === 0){
                                if (nextAvailableTimeBlock[0] === availableTimeBlock[0] && 
                                    nextAvailableTimeBlockAfterThat[0] === availableTimeBlock[0] + 1 && 
                                    nextAvailableTimeBlockAfterThat[1] === 0){
                                    timesAvailableForThisDayGivenDesiredLength.push(availableTimeBlock)
                                }
                            } else {
                                if (nextAvailableTimeBlock[0] - 1 === availableTimeBlock[0] && 
                                    nextAvailableTimeBlock[1] === 0 && 
                                    nextAvailableTimeBlockAfterThat[0] === availableTimeBlock[0] + 1){
                                    timesAvailableForThisDayGivenDesiredLength.push(availableTimeBlock)
                                }
                            }
                        }
                    } else if (selectedAppointmentBlocks === 4){
                        if (nextAvailableTimeBlockAfterThatAgain){
                            if (availableTimeBlock[1] === 0){
                                if (nextAvailableTimeBlock[0] === availableTimeBlock[0] && 
                                    nextAvailableTimeBlockAfterThat[0] === availableTimeBlock[0] + 1 && 
                                    nextAvailableTimeBlockAfterThat[1] === 0 && 
                                    nextAvailableTimeBlockAfterThatAgain[0] === availableTimeBlock[0] + 1
                                    ){
                                    timesAvailableForThisDayGivenDesiredLength.push(availableTimeBlock)
                                }
                            } else {
                                if (nextAvailableTimeBlock[0] - 1 === availableTimeBlock[0] && 
                                    nextAvailableTimeBlock[1] === 0 && 
                                    nextAvailableTimeBlockAfterThat[0] === availableTimeBlock[0] + 1 &&
                                    nextAvailableTimeBlockAfterThatAgain[0] === availableTimeBlock[0] + 2
                                    ){
                                    if (nextAvailableTimeBlockAfterThatAgain[1] === 0){
                                        timesAvailableForThisDayGivenDesiredLength.push(availableTimeBlock)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // puts all that information into a singular obj for displaying
            weekShowingArr.push({
                year: dateSet.getFullYear(),
                month: dateSet.getMonth(),
                date: dateSet.getDate(),
                day: this.state.daysOfTheWeek[dateSet.getDay()],
                availableTimeBlocks: timesAvailableForThisDayGivenDesiredLength
            })
        }
        this.setState({weekShowing: weekShowingArr})
    }
    newWeek = num => {
        const newWeek = this.state.viewedWeek + num
        this.setState({ viewedWeek: newWeek }, () => this.gettingAvailability())
    }
    editToggler = () => {
        this.setState(prevState => ({
            editToggle: !prevState.editToggle
        }))
    }
    handleEdit = () => {
        this.therapistInfo()
        this.editToggler()
    }
    handlePackageAndSubmit = (year, month, date, hours, minutes) => {
        const scheduleChoice = new Date(year, month, date, hours, minutes)
        const listOfCurrentAppointments = []
        const choiceTimes = this.createTimeBlocks(hours, minutes, parseInt(this.props.appLengthInMinutes))
        // recall to get therapists appointments




        const appointmentToCheck = this.props.therapistAppointments.filter(obj => {
            return obj.appDate.getFullYear() === year && obj.appDate.getMonth() === month && obj.appDate.getDate() === date
        })
        appointmentToCheck.forEach(obj => {
            const timeBlockArr = this.createTimeBlocks(obj.appDate.getHours(), obj.appDate.getMinutes(), obj.appLengthInMinutes)
            timeBlockArr.forEach(arr => listOfCurrentAppointments.push(arr))
        })
        let isPresent = false
        choiceTimes.forEach(arr1 => {
            isPresent = listOfCurrentAppointments.some(arr2 => {
                return arr1[0] === arr2[0] && arr1[1] === arr2[1]
            })
        })
        if (isPresent) {
            alert("That time is no longer available! Please select another time... ");
            this.gettingAvailability()
        } else {
            this.props.postNewAppointment(scheduleChoice)
        }
    }
    createTimeBlocks = (hours, minutes, length) => {
        const timeBlocks = []
        const appLength = length / 30
        let halfHourStart = 0
        let min1 = 0
        let min2 = 30
        if (minutes === 30){
            min1 = 30;
            min2 = 0;
            halfHourStart = 1;
        }
        for (let i = 0; i < appLength; i++){
            let hourAdj = 0
            if (halfHourStart === 0){
                if (i === 2 || i === 3){
                    hourAdj = 1
                } else if (i === 4 || i === 5){
                    hourAdj = 2
                }
            } else {
                if (i === 1 || i === 2){
                    hourAdj = 1
                }   else if (i === 3 || i === 4){
                    hourAdj = 2
                } else if (i === 5){
                    hourAdj = 3
                }
            }
            if (i % 2 === 0){
                timeBlocks.push([hours + hourAdj, min1])
            } else {
                timeBlocks.push([hours + hourAdj, min2])
            }
        }
        return timeBlocks
    }

    therapistInfo = () => {
        // call to get therapist appointments




        const selectedTherapist = this.props.therapists.find(therapist => therapist._id === this.props.therapistID)
        this.props.handleNameIDAdd(
            this.props.user._id, 
            `${this.props.user.firstName} ${this.props.user.lastName}`, 
            `${selectedTherapist.firstName} ${selectedTherapist.lastName}`
        )
        this.setState({ selected: selectedTherapist }, () => this.gettingAvailability())
    }
    componentDidMount(){
        const today = this.props.thisMoment()
        const hour = today.getHours()
        let weekToView = 1
        if ( hour > 17 ) weekToView = 2
        if(this.props.therapistID === "") this.props.history.push("/book")
        this.setState({ viewedWeek: weekToView }, () =>  this.therapistInfo())
    }
    render(){
        return(
            <div>
                <ChoiceDisplay  
                    handleEdit={this.handleEdit} 
                    therapistName={this.props.therapistName} 
                    appLengthInMinutes={this.props.appLengthInMinutes} 
                    editToggler={this.editToggler} 
                    editToggle={this.state.editToggle} 
                    viewedWeek={this.state.viewedWeek} 
                    newWeek={this.newWeek}/>
                <AvailableAppointments appointmentsArr={this.state.weekShowing} handlePackageAndSubmit={this.handlePackageAndSubmit}/> 
            </div> 
        )
    }
}

export default withAppointment(withTherapist(withUser(PickTime)));