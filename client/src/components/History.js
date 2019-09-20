import React, { Component } from "react"

// import Appointment from "./Appointment.js"
import ProfileNav from "./ProfileNav.js"

import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"

class History extends Component {
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
        this.props.getAllClientAppointments(this.props.user._id, () => {
            const order = this.props.orderAppointments(this.props.clientAppointments)
            this.setState({ upcomingAppointments: order[1], pastAppointments: order[0], dataIn: true })
        })
    }

    render(){
        // const { upcomingAppointments, pastAppointments } = this.state
        return(
            <div>
                History
                    {/* All of the appointments for that user */}
                    {/* Split past and current */}
                    {/* How many appointments remaining */}
                <ProfileNav />
                
            </div>
        )
    }
}

export default withAppointment(withUser(History));