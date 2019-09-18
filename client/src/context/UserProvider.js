import React, { Component } from 'react'
import axios from "axios"
import { withRouter } from 'react-router-dom'

const UserContext = React.createContext()

class UserProvider extends Component {
    constructor(){
        super()
        this.state = {
            user: JSON.parse(localStorage.getItem('user')) || {},
            token: localStorage.getItem('token') || "",
            makingAppointment: false,
            errMsg: ""
        }
    }
    signup = credentials => {
        axios.post("/auth/signup", credentials)
            .then(res => {
                const { user, token } = res.data
                localStorage.user = JSON.stringify(user)
                localStorage.token = token
                this.setState({
                    user,
                    token
                }, () => {
                    if(this.state.makingAppointment){
                        this.props.history.push('/pickTime')
                    } else {
                        this.props.history.push('/user')
                    }
                })
            })
            .catch(err => this.setState({errMsg: err.response.data.errMsg}))
    }
    login = credentials => {
        axios.post("/auth/login", credentials)
            .then(res => {
                const { user, token } = res.data
                localStorage.user = JSON.stringify(user)
                localStorage.token = token
                this.setState({
                    user,
                    token
                }, () => {
                    if(this.state.makingAppointment){
                        this.props.history.push("/pickTime")
                    } else {
                        this.props.history.push("/user") 
                    }
                })
            })
            .catch(err => this.setState({errMsg: err.response.data.errMsg}))
    }
    logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        this.setState({
            user: {},
            token: ""
        })
    }
    makingAppointment = () => {
        this.setState(() => ({
            makingAppointment: true
        }))
    }
    appointmentSubmitted = () => {
        console.log("Booking Completed")
        this.setState(() => ({
            makingAppointment: false
        }))
    }
    firstCharCap = str => {
        const finalStr = str.charAt(0).toUpperCase() + str.substr(1, str.length - 1)
        return finalStr
    }
    inputLowercaseNospace = str => {
        const strPhase1 = str.trim()
        const strFinal = strPhase1.toLowerCase()
        return strFinal
    }
    render(){
        return(
            <UserContext.Provider
                value={{
                    ...this.state,
                    signup: this.signup,
                    login: this.login,
                    logout: this.logout,
                    makingAppointment: this.makingAppointment,
                    appointmentSubmitted: this.appointmentSubmitted,
                    firstCharCap: this.firstCharCap,
                    inputLowercaseNospace: this.inputLowercaseNospace
                }}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export default withRouter(UserProvider)

export const withUser = C => props => (
    <UserContext.Consumer>
        { value => <C {...props} {...value}/> }
    </UserContext.Consumer>
)