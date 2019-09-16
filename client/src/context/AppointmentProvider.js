import React, { Component } from "react"
import axios from "axios"

const AppointmentContext = React.createContext()

const dataAxios = axios.create()

dataAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

class AppointmentProvider extends Component {
    constructor(){
        super()
        this.state = {
            ownerAppointments: [],
            therAppointments: [],
            clientAppointments: [],
            currentAppointmentInProgress: {},
            appLengths: [60, 90, 120],
            clientID: "",
            clientName: "",
            appLengthInMinutes: "",
            appDate: "",
            therapistID: "",
            therapistName: "",
            address: "",
            city: "",
            state: "",
            zipcode: "",
            packageChoice: "",
            canceled: false,
            status: "",
            amount: ""
        }
    }
    getAllAppointments = () => {
        dataAxios.get("/api/owner/appointment")
            .then( res => {
                this.setState({ ownerAppointments: res.data })
            })
            .catch(err => console.log(err.response.data.errMsg))
    }
    postNewAppointment = date => {
        this.setState({ appDate: date }, () => {
            console.log(this.state)
            // create appointment obj
            // push to next page PackageAndSubmit.js
        })
    }
    updateAppointment = () => {

    }
    deleteAppointment = () => {

    }
    handleNameIDAdd = (clientID, clientName, therapistName) => {
        this.setState({
            clientID: clientID,
            clientName: clientName,
            therapistName: therapistName
        })
    }
    handleChange = e => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        this.setState({ [e.target.name] : value })
    }
    thisMoment = () => {
        const thisMoment = new Date()
        const thisMomentInYear = thisMoment.getFullYear()
        const thisMomentInMonth = thisMoment.getMonth()
        const thisMomentInDate = thisMoment.getDate()
        const thisMomentInMountainTime = new Date(thisMoment.setHours(thisMoment.getUTCHours() - (7 + this.dST(thisMoment))))
        if (thisMomentInMountainTime.getDate() < thisMomentInDate) {
            thisMomentInMountainTime.setFullYear(thisMomentInYear, thisMomentInMonth, thisMomentInDate)
        }
        return thisMomentInMountainTime
    }
    dST = today => {
        const jan = new Date(today.getFullYear(), 0, 1)
        const jul = new Date(today.getFullYear(), 6, 1)
        const dST = today.getTimezoneOffset() - Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
        return dST / 60
    }

    render(){
        return(
            <AppointmentContext.Provider
                value={{
                    ...this.state,
                    getAllAppointments: this.getAllAppointments,
                    postNewAppointment: this.postNewAppointment,
                    updateAppointment: this.updateAppointment,
                    deleteAppointment: this.deleteAppointment,
                    handleChange: this.handleChange,
                    handleNameIDAdd: this.handleNameIDAdd,
                    thisMoment: this.thisMoment
                }}>
                {this.props.children}
            </AppointmentContext.Provider>
        )
    }
}

export default AppointmentProvider;

export const withAppointment = C => props => (
    <AppointmentContext.Consumer>
        {value => <C {...value} {...props}/>}
    </AppointmentContext.Consumer>
)