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
        const weekShowingArr = []
        const therapist = this.state.selected
        const selectedAppointmentLengthInMinutes = parseInt(this.props.appLengthInMinutes)
        let selectedAppointmentBlocks = 0
        if (selectedAppointmentLengthInMinutes === 60){
            selectedAppointmentBlocks = 2
        } else if (selectedAppointmentLengthInMinutes === 90){
            selectedAppointmentBlocks = 3
        } else if (selectedAppointmentLengthInMinutes === 120){
            selectedAppointmentBlocks = 4
        }
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
            let newTime = startTime
            for (let j = 0; j < endTime - startTime; j++) {
                if (newTime % 1 === 0){
                    if (endTime % 1 === .5 && endTime - .5 === newTime){
                        generalTimesAvailableForSelectedDay.push([newTime, 0])
                        break;
                    }   
                    for (let k = 0; k < 2; k++){
                        if (k === 0){
                            generalTimesAvailableForSelectedDay.push([newTime, 0])
                        } else if (k === 1){
                            generalTimesAvailableForSelectedDay.push([newTime, 30])
                        }
                    }
                } else {
                    newTime = newTime - .5
                    j--
                    generalTimesAvailableForSelectedDay.push([newTime, 30])
                }
                newTime++ 
            }
            for (let l = 0; l < matchingDates.length; l++) {
                const timeBlockToRemove = [matchingDates[l].appDate.getHours(), matchingDates[l].appDate.getMinutes()]
                const foundIndexToRemove = generalTimesAvailableForSelectedDay.findIndex(arr =>{
                    return arr[0] === timeBlockToRemove[0] && arr[1] === timeBlockToRemove[1]
                })
                let howManyBlocksToRemove = 0
                if (matchingDates[l].appLengthInMinutes === 60){
                    howManyBlocksToRemove = 2
                } else if (matchingDates[l].appLengthInMinutes === 90){
                    howManyBlocksToRemove = 3
                } else if (matchingDates[l].appLengthInMinutes === 120){
                    howManyBlocksToRemove = 4
                }
                generalTimesAvailableForSelectedDay.splice(foundIndexToRemove, howManyBlocksToRemove)
            }
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
        const mappedAvailability = this.state.weekShowing.map((dayObj, i) => {
            // create new component for displaying all this fucking info
        })
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
                {mappedAvailability}
            </div> 
        )
    }
}

export default withAppointment(withTherapist(withUser(PickTime)));