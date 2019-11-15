import React, { Component } from "react"

// import Appointment from "./Appointment.js"
import ProfileNav from "./ProfileNav.js"
import AppointmentHistory from "./AppointmentHistory.js"

import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"

class CompanyHistory extends Component {
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
            this.props.getAllPresentCompanyAppointments(dateData, () => {
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
            this.props.getAllPresentCompanyAppointments(dateData, () => {
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
            this.props.getAllPresentCompanyAppointments(dateData, () => {
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
            this.props.getAllPastCompanyAppointments(dateData, () => {
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
            this.props.getAllPastCompanyAppointments(dateData, () => {
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
            this.props.getAllPastCompanyAppointments(dateData, () => {
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
        this.props.getAllPresentCompanyAppointments(dateData, () => {
            this.props.getAllPastCompanyAppointments(dateData, () => {
                this.setState({ dataIn: true })
            })
        })
    }

    render(){
        const { dataIn, presentMonth, pastMonth, presentYear, pastYear, presentToggle, pastToggle } = this.state
        const { companyAppointmentsPresent, companyAppointmentsPast, companyEarningsData } = this.props
        const { yearEarnings, therapistEarnings, websiteDeductions, companyEarnings } = companyEarningsData
        const { switchPastMonth, switchPresentMonth } = this
        return(
            <div className="companyHistory">
                <ProfileNav isOn={3}/>
                {dataIn ?
                <>
                    <AppointmentHistory 
                        history={companyAppointmentsPresent} 
                        title={"Upcoming Appointments"} 
                        subTitle={"New to Newest"} 
                        future={true}
                        client={false}
                        therapist={false}
                        owner={true}
                        month={presentMonth} 
                        year={presentYear}
                        toggle={presentToggle}
                        switchMonth={switchPresentMonth}/>
                    <AppointmentHistory 
                        history={companyAppointmentsPast} 
                        title={"Past Appointments"} 
                        subTitle={"Old to Oldest"} 
                        future={false}
                        client={false}
                        therapist={false}
                        owner={true} 
                        month={pastMonth} 
                        year={pastYear} 
                        toggle={pastToggle}
                        switchMonth={switchPastMonth}
                        yearEarnings={yearEarnings}
                        yearTherapistEarnings={therapistEarnings}
                        yearWebsiteDeductions={websiteDeductions}
                        yearCompanyEarnings={companyEarnings}
                        />
                </>
                : null
                }
            </div>
        )
    }
}

export default withAppointment(withUser(CompanyHistory));