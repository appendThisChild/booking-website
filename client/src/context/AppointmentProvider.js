import React, { Component } from "react"
import axios from "axios"

import { withGoogle } from "./GoogleCalendarProvider.js"

const AppointmentContext = React.createContext()

const dataAxios = axios.create()

dataAxios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

class AppointmentProvider extends Component {
    constructor(){
        super()
        this.state = {
            companyAppointmentsPresent: [],
            companyAppointmentsPast: [],
            companyEarningsData: {},
            therAppointmentsPresent: [],
            therAppointmentsPast: [],
            therEarningsData: {},
            clientAppointmentsPresent: [],
            clientAppointmentsPast: [],
            currentAppointmentInProgress: "",
            appLengths: [60, 75, 90],
            clientID: "",
            clientName: "",
            clientEmail: "",
            clientPhoneNumber: "",
            appLengthInMinutes: "",
            appDate: "",
            therapistID: "",
            therapistName: "",
            therapistPhoneNumber: "",
            therapistEmail: "",
            address: "",
            packageChoice: "",
            canceled: false,
            status: "",
            amount: "",
            apiKey: "",
            inStudio: "true"
        }
    }
    // owner
    getAllPresentCompanyAppointments = (dateData, callback) => {
        dataAxios.post("/api/owner/appointment/present", dateData)
            .then( res => this.setState({ companyAppointmentsPresent: res.data }, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    getAllPastCompanyAppointments = (dateData, callback) => {
        dataAxios.post("/api/owner/appointment/past", dateData)
            .then( res => this.setState({ companyAppointmentsPast: res.data.apps, companyEarningsData: res.data.data }, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    // client
    getAllPresentClientAppointments = (id, dateData, callback) => {
        dataAxios.post(`/api/appointment/present/${id}`, dateData)
            .then( res => this.setState({ clientAppointmentsPresent: res.data }, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    getAllPastClientAppointments = (id, dateData, callback) => {
        dataAxios.post(`/api/appointment/past/${id}`, dateData)
            .then( res => this.setState({ clientAppointmentsPast: res.data }, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    // therapist
    getAllPresentTherapistAppointments = (id, dateData, callback) => {
        dataAxios.post(`/api/therapist/appointment/present/${id}`, dateData)
            .then( res => this.setState({ therAppointmentsPresent: res.data }, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    getAllPastTherapistAppointments = (id, dateData, callback) => {
        dataAxios.post(`/api/therapist/appointment/past/${id}`, dateData)
            .then( res => this.setState({ therAppointmentsPast: res.data.apps, therEarningsData: res.data.data }, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    postNewAppointment = (date, callback) => {
        this.setState({ appDate: date }, () => {
            const newAppointment = {
                clientID: this.state.clientID,
                clientName: this.state.clientName,
                clientEmail: this.state.clientEmail,
                clientPhoneNumber: this.state.clientPhoneNumber,
                appLengthInMinutes: this.state.appLengthInMinutes,
                appDate: this.state.appDate,
                therapistID: this.state.therapistID,
                therapistName: this.state.therapistName,
                therapistEmail: this.state.therapistEmail,
                therapistPhoneNumber: this.state.therapistPhoneNumber,
                address: this.state.address,
                inStudio: this.state.inStudio === "true" ? true : false
            }
            dataAxios.post("/api/appointment", newAppointment)
                .then(res => this.setState({ currentAppointmentInProgress: res.data.app, apiKey: res.data.key }, () => callback()))
                .catch(err => console.log(err.response.data.errMsg))
            this.setState({
                clientID: "",
                clientName: "",
                clientEmail: "",
                clientPhoneNumber: "",
                appLengthInMinutes: "",
                appDate: "",
                therapistID: "",
                therapistName: "",
                therapistEmail: "",
                address: ""
            })
        })
    }
    updateAppointment = (_id, updates, callback) => {
        dataAxios.put(`/api/appointment/${_id}`, updates)
            .then(res => this.setState({ currentAppointmentInProgress: res.data }, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    updateIntake = (id, data, callback) => {
        dataAxios.put(`/api/appointment/intake/${id}`, data)
            .then(() => callback())
            .catch(err => console.log(err.response.data.errMsg))
    }
    cancelAppointment = (_id, therapist) => {
        dataAxios.delete(`/api/calendar/${_id}/${therapist}`)
            .then(() => window.location.reload())
            .catch(err => console.log(err.response.data.errMsg))
    }
    updateVisits = (_id, updates, callback) => {
        dataAxios.put(`/api/info/visits/${_id}`, updates)
            .then(res => {
                if (res.data === "Done") callback()
            })
            .catch(err => console.log(err.response.data.errMsg))
    }
    handleNameIDAdd = (clientID, clientName, clientPhoneNumber, therapistName, address, phoneNumber, clientEmail, therapistEmail) => {
        this.setState({
            clientID: clientID,
            clientName: clientName,
            clientPhoneNumber: clientPhoneNumber,
            therapistName: therapistName,
            address: address,
            therapistPhoneNumber: phoneNumber,
            clientEmail: clientEmail,
            therapistEmail: therapistEmail
        })
    }
    handleChange = e => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        this.setState({ [e.target.name] : value })
    }
    eraseKey = () => {
        this.setState({ apiKey: ""})
    }
    render(){
        return(
            <AppointmentContext.Provider
                value={{
                    ...this.state,
                    getAllPresentCompanyAppointments: this.getAllPresentCompanyAppointments,
                    getAllPastCompanyAppointments: this.getAllPastCompanyAppointments,
                    getAllPresentClientAppointments: this.getAllPresentClientAppointments,
                    getAllPastClientAppointments: this.getAllPastClientAppointments,
                    getAllPresentTherapistAppointments: this.getAllPresentTherapistAppointments,
                    getAllPastTherapistAppointments: this.getAllPastTherapistAppointments,
                    postNewAppointment: this.postNewAppointment,
                    updateAppointment: this.updateAppointment,
                    updateIntake: this.updateIntake,
                    cancelAppointment: this.cancelAppointment,
                    handleChange: this.handleChange,
                    handleNameIDAdd: this.handleNameIDAdd,
                    updateVisits: this.updateVisits,
                    eraseKey: this.eraseKey
                }}>
                {this.props.children}
            </AppointmentContext.Provider>
        )
    }
}

export default withGoogle(AppointmentProvider);

export const withAppointment = C => props => (
    <AppointmentContext.Consumer>
        {value => <C {...value} {...props}/>}
    </AppointmentContext.Consumer>
)