import React, { Component } from 'react'
import axios from "axios"
import { withRouter } from 'react-router-dom'

const UserContext = React.createContext()

const dataAxios = axios.create()

dataAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

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
                        this.props.history.push('/history')
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
                        this.props.history.push("/history") 
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
    checkEmail = (email, callback) => {
        const _id = this.state.user._id
        dataAxios.post(`/api/info/email/${_id}`, {email: email})
            .then(res => {
                callback(res.data.isPresent)
            })
            .catch(err => this.setState({errMsg: err.response.data.errMsg}))
    }
    updateUserInfo = (updates) => {
        const _id = this.state.user._id
        dataAxios.put(`/api/info/${_id}`, updates)
            .then(res => {
                const { user, token } = res.data
                localStorage.user = JSON.stringify(user)
                localStorage.token = token
                this.setState({
                    user,
                    token
                })
            })
            .catch(err => this.setState({errMsg: err.response.data.errMsg}))
    }
    updateState = credentials => {
        const { user, token } = credentials
        localStorage.user = JSON.stringify(user)
        localStorage.token = token
        this.setState({
            user,
            token
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
    numberDisplay = phoneNumber => {
        const phoneString = []
        const phoneArr = phoneNumber.toString().split("").reverse()
        phoneArr.forEach((num, i) => {
            if (i === 4){
                phoneString.unshift("-")
            } else if (i === 7){
                phoneString.unshift(")", " ")
            } else if (i === 10){
                phoneString.unshift(" ")
            }
            phoneString.unshift(num)
            if (i === 9){
                phoneString.unshift("(")
            } else if (i === phoneArr.length - 1 && i > 9){
                phoneString.unshift("+")
            }
        })
        return phoneString.join("")
    }
    numberDeconstruct = num => {
        const numArr = num.toString().split("")
        const trueNum = numArr.filter(str => !isNaN(str) && str !== " ")
        const newNum = Number(trueNum.join(""))
        return newNum
    }
    render(){
        return(
            <UserContext.Provider
                value={{
                    ...this.state,
                    signup: this.signup,
                    login: this.login,
                    logout: this.logout,
                    checkEmail: this.checkEmail,
                    updateUserInfo: this.updateUserInfo,
                    makingAppointment: this.makingAppointment,
                    appointmentSubmitted: this.appointmentSubmitted,
                    firstCharCap: this.firstCharCap,
                    inputLowercaseNospace: this.inputLowercaseNospace,
                    numberDisplay: this.numberDisplay,
                    numberDeconstruct: this.numberDeconstruct,
                    updateState: this.updateState
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