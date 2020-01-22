import React, { Component } from "react"

import ChoiceDisplay from "./ChoiceDisplay.js"
import AvailableAppointments from "./AvailableAppointments.js"
import MonthDisplay from './MonthDisplay.js'

import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"
import { withTherapist } from "../context/TherapistProvider.js"
import { withBlackoutDates } from "../context/BlackoutDatesProvider.js"

class PickTime extends Component {
    constructor(){
        super()
        this.state = {
            viewedDay: 0,
            nextDay: 1,
            startDay: new Date(),
            selected: {},
            monthsOfTheYear: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            daysOfTheWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayShowing: [],
            editToggle: false
        }
    }
    gettingAvailability = () => {
        const weekShowingArr = []
        const therapist = this.state.selected
        // looks at all the data for that specific day
        // for (let i = this.state.viewedWeek; i < this.state.viewedWeek + 7; i++){
            const i = this.state.viewedDay
            const newDate = new Date()
            const dateSet = new Date(newDate.setDate(newDate.getDate() + i))
            this.props.therapistAppointments.map(obj => obj.appDate = new Date(obj.appDate))
            // find the appointments that match this day
            const matchingDates = this.props.therapistAppointments.filter(obj => {
                const objDate = obj.appDate
                return objDate.getFullYear() === dateSet.getFullYear() && objDate.getMonth() === dateSet.getMonth() && objDate.getDate() === dateSet.getDate()
            })
            // find if the date matches any of the blackout dates
            const dateBlackedOut = this.props.blackoutDates.some(obj => {
                const date = new Date(obj.blackoutDate)
                return date.getUTCFullYear() === dateSet.getFullYear() && date.getUTCMonth() === dateSet.getMonth() && date.getUTCDate() === dateSet.getDate()
            })
            // getting availability for that day
            const generalTimesAvailableForSelectedDay = []
            const startTime = therapist.availability[dateSet.getDay()][0] / 10
            const endTime = therapist.availability[dateSet.getDay()][1] / 10
            const timesAvailableForThisDayGivenDesiredLength = []
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
            const normalAppBookedBlocks = []
            matchingDates.forEach(obj => {
                let hours = obj.appDate.getHours()
                let minutes = obj.appDate.getMinutes()
                let buffer = 60
                const isInStudio = obj.inStudio
                if (isInStudio){
                    // turning the time back a half hour based for appointment buffer
                    if (obj.appDate.getMinutes() === 30) minutes = 0;
                    else {
                        minutes = 30;
                        hours = hours - 1;
                    }
                } else {
                    // moving the time back an hour to adjust for buffer
                    hours = hours -1;
                    buffer = 120;
                }
                // creates time blocks to represent appointment
                const timeBlockArr = this.createTimeBlocks(hours, minutes, obj.appLengthInMinutes === 75 ? 90 : obj.appLengthInMinutes + buffer)
                // pushes the times blocks to the area if they aren't already present
                timeBlockArr.forEach(arr1 => {
                    const alreadyPresent = appBookedBlocks.some(arr2 => arr1[0] === arr2[0] && arr1[1] === arr2[1])
                    if (!alreadyPresent) appBookedBlocks.push(arr1)
                })
                // create array to display scheduled appointments as normal 
                const normalTimeBlockArr = this.createTimeBlocks(obj.appDate.getHours(), obj.appDate.getMinutes(), obj.appLengthInMinutes === 75 ? 90 : obj.appLengthInMinutes)
                normalTimeBlockArr.forEach(arr => normalAppBookedBlocks.push(arr))
            })
            // removes booked spaces from the times available
            appBookedBlocks.forEach(arr1 => {
                const foundIndexToRemove = generalTimesAvailableForSelectedDay.findIndex(arr2 => arr1[0] === arr2[0] && arr1[1] === arr2[1])
                if (foundIndexToRemove !== -1) generalTimesAvailableForSelectedDay.splice(foundIndexToRemove, 1)
            })
            // compiles the list into selectable times based on clients desired length of appointment
            generalTimesAvailableForSelectedDay.forEach(arr1 => {
                let allPresent = true;
                let hours = arr1[0];
                let minutes = arr1[1];
                let buffer = 60;
                const selectedInStudio = this.props.inStudio === "true" ? true : false
                if (selectedInStudio){
                    if (arr1[1] === 30) minutes = 0;
                    else {
                        minutes = 30;
                        hours = hours - 1;
                    }
                } else {
                    hours = hours -1;
                    buffer = 120;
                }
                // creates time blocks for time available
                const timeBlockArr = this.createTimeBlocks(hours, minutes, parseInt(this.props.appLengthInMinutes) === 75 ? 90 : parseInt(this.props.appLengthInMinutes) + buffer)
                const normalTimeBlockArr = this.createTimeBlocks(arr1[0], arr1[1], parseInt(this.props.appLengthInMinutes) === 75 ? 90 : parseInt(this.props.appLengthInMinutes))
                // check if all blocks are available in array
                timeBlockArr.forEach(arr2 => {
                    const isThere = normalAppBookedBlocks.some(arr3 => arr2[0] === arr3[0] && arr2[1] === arr3[1])
                    if (isThere) allPresent = false
                })
                normalTimeBlockArr.forEach(arr2 => {
                    const isThere = generalTimesAvailableForSelectedDay.some(arr3 => arr2[0] === arr3[0] && arr2[1] === arr3[1])
                    if (!isThere) allPresent = false
                })
                // , if so = pushes the start time to the display 
                if (allPresent) timesAvailableForThisDayGivenDesiredLength.push(arr1)
            })
            // puts all that information into a singular obj for displaying
            let endSchedule = timesAvailableForThisDayGivenDesiredLength
            if (startTime === -1 || endTime === -1 || dateBlackedOut){
                endSchedule = []
            } 
            weekShowingArr.push({
                year: dateSet.getFullYear(),
                month: dateSet.getMonth(),
                date: dateSet.getDate(),
                day: this.state.daysOfTheWeek[dateSet.getDay()],
                availableTimeBlocks: endSchedule
            })
        // }
        this.setState({dayShowing: weekShowingArr})
    }
    newDay = num => {
        this.setState(prevState => ({ viewedDay: prevState.viewedDay + num }), () => this.gettingAvailability())
    }
    setViewedDay = num => {
        this.setState({ viewedDay: num}, () => this.gettingAvailability())
    }
    editToggler = () => {
        this.setState(prevState => ({
            editToggle: !prevState.editToggle
        }))
    }
    handleEdit = e => {
        window.scroll(0,0)
        e.preventDefault()
        this.therapistInfo()
        this.editToggler()
    }
    sendToNextPage = () => {
        const selectedInStudio = this.props.inStudio === "true" ? true : false
        if (selectedInStudio){
            this.props.history.push("/selectPackageAndSubmit")
        } else {
            this.props.history.push("/on-site-address")
        }
    }
    handlePackageAndSubmit = (year, month, date, hour, minutes) => {
        const scheduleChoice = new Date(year, month, date, hour, minutes)
        const listOfCurrentAppointments = []
        const listOfAppointmentsWithBuffer = []
        let hr = hour
        let mins = minutes
        let buffer = 60;
        const selectedInStudio = this.props.inStudio === "true" ? true : false
        if (selectedInStudio){
            if (minutes === 30) mins = 0;
            else {
                mins = 30;
                hr--;
            }
        } else {
            hr--;
            buffer = 120;
        }
        const choiceTimes = this.createTimeBlocks(hour, minutes, parseInt(this.props.appLengthInMinutes) === 75 ? 90 : parseInt(this.props.appLengthInMinutes))
        const choiceTimesWithBuffer = this.createTimeBlocks(hr, mins, parseInt(this.props.appLengthInMinutes) === 75 ? 90 : parseInt(this.props.appLengthInMinutes) + buffer)
        this.props.getAllAppointmentsForSelectedTherapist(this.props.therapistID, () => {
            this.props.therapistAppointments.map(obj => obj.appDate = new Date(obj.appDate))
            // getting all appointments that match the date selected
            const appointmentsToCheck = this.props.therapistAppointments.filter(obj => {
                return obj.appDate.getFullYear() === year && obj.appDate.getMonth() === month && obj.appDate.getDate() === date
            })
            // creating blocks to push to array based on current appointments
            appointmentsToCheck.forEach(obj => {
                let hours = obj.appDate.getHours()
                let minutes = obj.appDate.getMinutes()
                let buffer = 60
                const isInStudio = obj.inStudio
                if (isInStudio){
                    // turning the time back a half hour based for appointment buffer
                    if (obj.appDate.getMinutes() === 30) minutes = 0;
                    else {
                        minutes = 30;
                        hours = hours - 1;
                    }
                } else {
                    // moving the time back an hour to adjust for buffer
                    hours = hours -1;
                    buffer = 120;
                }
                // creates time blocks to represent appointment
                const timeBlockArrWithBuffer = this.createTimeBlocks(hours, minutes, obj.appLengthInMinutes === 75 ? 90 : obj.appLengthInMinutes + buffer)
                // pushes the times blocks to the area if they aren't already present
                timeBlockArrWithBuffer.forEach(arr1 => {
                    const alreadyPresent = listOfAppointmentsWithBuffer.some(arr2 => arr1[0] === arr2[0] && arr1[1] === arr2[1])
                    if (!alreadyPresent) listOfAppointmentsWithBuffer.push(arr1)
                })
                // creates normal list of times to push in array
                const timeBlockArr = this.createTimeBlocks(obj.appDate.getHours(), obj.appDate.getMinutes(), obj.appLengthInMinutes === 75 ? 90 : obj.appLengthInMinutes)
                timeBlockArr.forEach(arr => listOfCurrentAppointments.push(arr))
            })
            // check if choice for appointment doesn't exist in a buffer && flipping buffers check
            let isPresent = false
            choiceTimes.forEach(arr1 => {
                const foundOne = listOfAppointmentsWithBuffer.some(arr2 => arr1[0] === arr2[0] && arr1[1] === arr2[1])
                if (foundOne) isPresent = true; 
            })
            choiceTimesWithBuffer.forEach(arr1 => {
                const foundOne = listOfCurrentAppointments.some(arr2 => arr1[0] === arr2[0] && arr1[1] === arr2[1])
                if (foundOne) isPresent = true; 
            })
            if (isPresent) {
                alert("That time is no longer available! Please select another time... ");
                this.gettingAvailability()
            } else {
                this.props.postNewAppointment(scheduleChoice, () => this.sendToNextPage())
            }
        })
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
                } else if (i === 6 || i === 7){
                    hourAdj = 3
                }
            } else {
                if (i === 1 || i === 2){
                    hourAdj = 1
                }   else if (i === 3 || i === 4){
                    hourAdj = 2
                } else if (i === 5 || i === 6){
                    hourAdj = 3
                } else if (i === 7){
                    hourAdj = 4
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
        this.props.getAllAppointmentsForSelectedTherapist(this.props.therapistID, () => {
            const selectedTherapist = this.props.therapists.find(therapist => therapist._id === this.props.therapistID)
            this.props.handleNameIDAdd(
                this.props.user._id, 
                `${this.props.firstCharCap(this.props.user.firstName)} ${this.props.firstCharCap(this.props.user.lastName)}`, 
                this.props.user.phoneNumber,
                `${this.props.firstCharCap(selectedTherapist.firstName)} ${this.props.firstCharCap(selectedTherapist.lastName)}`,
                selectedTherapist.address, 
                selectedTherapist.phoneNumber, 
                this.props.user.email,
                selectedTherapist.email
            )
            this.props.clientGetTherapistsBlackDates(this.props.therapistID, () => {
                this.setState({ selected: selectedTherapist }, () => this.gettingAvailability())
            })
        })
    }
    componentDidMount(){
        window.scroll(0,0)
        if(this.props.therapistID === "" || this.props.appLengthInMinutes === "") this.props.history.push("/book")
        const hour = new Date().getHours()
        let dayToView = 1
        if ( hour > 17 ) dayToView = 2
        const startDay = new Date(new Date().setDate(new Date().getDate() + dayToView))
        this.setState({ 
            startDay: startDay,
            viewedDay: dayToView,
            nextDay: dayToView + 1
         }, () =>  {
            window.scrollTo(0, 0)
            this.therapistInfo()
        })
    }
    render(){
        const { therapistName, appLengthInMinutes } = this.props
        const { startDay, viewedDay, editToggle, dayShowing, nextDay, monthsOfTheYear } = this.state
        return(
            <div className="pickTime">
                <MonthDisplay 
                    monthsOfTheYear={monthsOfTheYear}
                    startDay={startDay} 
                    nextDay={nextDay}
                    viewedDay={viewedDay}
                    setViewedDay={this.setViewedDay}
                />
                <AvailableAppointments 
                    appointmentsArr={dayShowing} 
                    handlePackageAndSubmit={this.handlePackageAndSubmit}
                    viewedDay={viewedDay} 
                    newDay={this.newDay}
                    nextDay={nextDay}
                /> 
                <ChoiceDisplay  
                    handleEdit={this.handleEdit} 
                    therapistName={therapistName} 
                    appLengthInMinutes={appLengthInMinutes}
                    isInStudio={this.props.inStudio} 
                    editToggler={this.editToggler} 
                    editToggle={editToggle} 
                />
            </div> 
        )
    }
}

export default withAppointment(withTherapist(withUser(withBlackoutDates(PickTime))));