import React, { Component } from "react"

import ProfileNav from "./ProfileNav.js"
import AppointmentHistory from "./AppointmentHistory.js"

import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"

class TherapistHistory extends Component {
    constructor(){
        super()
        this.state = {
            dataIn: false,
            presentMonth: new Date().getMonth(),
            presentYear: new Date().getFullYear(),
            pastMonth: new Date().getMonth(),
            pastYear: new Date().getFullYear(),
            presentToggle: 0,
            pastToggle: 0
        }
    }
    switchPresentMonth = (num) => {
        const { presentMonth, presentYear } = this.state
        if (num === 1 && presentMonth === 11){
            const dateData = {
                month: 0,
                year: presentYear + 1
            }
            this.props.getAllPresentTherapistAppointments(this.props.user._id, dateData, () => {
                this.setState(prevState => ({
                    presentYear: prevState.presentYear + 1,
                    presentMonth: 0,
                    presentToggle: prevState.presentToggle + num
                }))
            })
        } else if (num === -1 && presentMonth === 0){
            const dateData = {
                month: 11,
                year: presentYear - 1
            }
            this.props.getAllPresentTherapistAppointments(this.props.user._id, dateData, () => {
                this.setState(prevState => ({
                    presentYear: prevState.presentYear - 1,
                    presentMonth: 11,
                    presentToggle: prevState.presentToggle + num
                }))
            })
        } else {
            const dateData = {
                month: presentMonth + num,
                year: presentYear
            }
            this.props.getAllPresentTherapistAppointments(this.props.user._id, dateData, () => {
                this.setState(prevState => ({
                    presentMonth: prevState.presentMonth + num,
                    presentToggle: prevState.presentToggle + num
                }))
            })
        }
    }
    switchPastMonth = (num) => {
        const { pastMonth, pastYear } = this.state
        if (num === 1 && pastMonth === 11){
            const dateData = {
                month: 0,
                year: pastYear + 1
            }
            this.props.getAllPastTherapistAppointments(this.props.user._id, dateData, () => {
                this.setState(prevState => ({
                    pastYear: prevState.pastYear + 1,
                    pastMonth: 0,
                    pastToggle: prevState.pastToggle + num
                }))
            })
        } else if (num === -1 && pastMonth === 0){
            const dateData = {
                month: 11,
                year: pastYear - 1
            }
            this.props.getAllPastTherapistAppointments(this.props.user._id, dateData, () => {
                this.setState(prevState => ({
                    pastYear: prevState.pastYear - 1,
                    pastMonth: 11,
                    pastToggle: prevState.pastToggle + num
                }))
            })
        } else {
            const dateData = {
                month: pastMonth + num,
                year: pastYear
            }
            this.props.getAllPastTherapistAppointments(this.props.user._id, dateData, () => {
                this.setState(prevState => ({
                    pastMonth: prevState.pastMonth + num,
                    pastToggle: prevState.pastToggle + num
                }))
            })
        }
    }
    componentDidMount(){
        const dateData = {
            month: new Date().getMonth(),
            year: new Date().getFullYear()
        }
        this.props.getAllPresentTherapistAppointments(this.props.user._id, dateData, () => {
            this.props.getAllPastTherapistAppointments(this.props.user._id, dateData, () => {
                this.setState({ dataIn: true })
            })
        })
    }

    render(){
        const { dataIn, presentMonth, pastMonth, presentYear, pastYear, presentToggle, pastToggle } = this.state
        const { therAppointmentsPresent, therAppointmentsPast, therEarningsData } = this.props
        const { yearEarnings, therapistEarnings, serviceDeducted } = therEarningsData
        const { switchPastMonth, switchPresentMonth } = this
        return(
            <div className="therapistHistory">
                <ProfileNav isOn={2}/>
                {dataIn ?
                <div className="historyFlex">
                    <AppointmentHistory 
                        history={therAppointmentsPresent} 
                        title={"Upcoming Appointments"} 
                        subTitle={"New to Newest"} 
                        future={true}
                        client={false}
                        therapist={true}
                        owner={false}
                        month={presentMonth} 
                        year={presentYear} 
                        toggle={presentToggle}
                        switchMonth={switchPresentMonth}/>
                    <AppointmentHistory 
                        history={therAppointmentsPast} 
                        title={"Past Appointments"} 
                        subTitle={"Old to Oldest"} 
                        future={false}
                        client={false}
                        therapist={true}
                        owner={false} 
                        month={pastMonth} 
                        year={pastYear} 
                        toggle={pastToggle}
                        switchMonth={switchPastMonth}
                        yearEarnings={yearEarnings}
                        yearServiceDeducted={serviceDeducted}
                        yearTherapistEarnings={therapistEarnings}
                        yearView={true}
                    />
                </div>
                : null
                }
            </div>
        )
    }
}

export default withAppointment(withUser(TherapistHistory));