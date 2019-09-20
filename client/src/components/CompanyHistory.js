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
            upcomingAppointments: [],
            pastAppointments: [],
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
        const { presentMonth } = this.state
        if (num === 1 && presentMonth === 11){
            this.setState(prevState => ({
                presentYear: prevState.presentYear + 1,
                presentMonth: 0,
                presentToggle: prevState.presentToggle + num
            }))
        } else if (num === -1 && presentMonth === 0){
            this.setState(prevState => ({
                presentYear: prevState.presentYear - 1,
                presentMonth: 11,
                presentToggle: prevState.presentToggle + num
            }))
        } else {
            this.setState(prevState => ({
                presentMonth: prevState.presentMonth + num,
                presentToggle: prevState.presentToggle + num
            }))
        }
    }
    switchPastMonth = (num) => {
        const { pastMonth } = this.state

        if (num === 1 && pastMonth === 11){
            this.setState(prevState => ({
                pastYear: prevState.pastYear + 1,
                pastMonth: 0,
                pastToggle: prevState.pastToggle + num
            }))
        } else if (num === -1 && pastMonth === 0){
            this.setState(prevState => ({
                pastYear: prevState.pastYear - 1,
                pastMonth: 11,
                pastToggle: prevState.pastToggle + num
            }))
        } else {
            this.setState(prevState => ({
                pastMonth: prevState.pastMonth + num,
                pastToggle: prevState.pastToggle + num
            }))
        }
    }
    componentDidMount(){
        this.props.getAllCompanyAppointments(() => {
            const order = this.props.orderAppointments(this.props.companyAppointments)
            this.setState({ upcomingAppointments: order[1], pastAppointments: order[0], dataIn: true })
        })
    }

    render(){
        const { upcomingAppointments, pastAppointments, dataIn, presentMonth, pastMonth, presentYear, pastYear, presentToggle, pastToggle } = this.state
        const { switchPastMonth, switchPresentMonth } = this
        return(
            <div>
                Company History
                    {/* All appointments - with amount breakoutdowns - "Similar to therapist breakdown, but all appointments" */}
                <ProfileNav />
                {dataIn ?
                <>
                    <AppointmentHistory 
                        history={upcomingAppointments} 
                        title={"Upcoming Appointments"} 
                        subTitle={"New to Newest"} 
                        future={true}
                        client={false}
                        month={presentMonth} 
                        year={presentYear} 
                        toggle={presentToggle}
                        switchMonth={switchPresentMonth}/>
                    <AppointmentHistory 
                        history={pastAppointments} 
                        title={"Past Appointments"} 
                        subTitle={"Old to Oldest"} 
                        future={false}
                        client={false} 
                        month={pastMonth} 
                        year={pastYear} 
                        toggle={pastToggle}
                        switchMonth={switchPastMonth}/>
                    {/* Show total for that month */}
                    {/* Show year total */}
                </>
                : null
                }
            </div>
        )
    }
}

export default withAppointment(withUser(CompanyHistory));