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
            companyAppointments: [],
            therAppointments: [],
            clientAppointments: [],
            currentAppointmentInProgress: "",
            appLengths: [60, 90, 120],
            clientID: "",
            clientName: "",
            clientEmail: "",
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
            amount: ""
        }
    }
    getAllCompanyAppointments = callback => {
        dataAxios.get("/api/owner/appointment")
            .then( res => this.setState({ companyAppointments: res.data }, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    getAllClientAppointments = (id, callback) => {
        dataAxios.get(`/api/appointment/${id}`)
            .then( res => this.setState({ clientAppointments: res.data }, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    getAllTherapistAppointments = (id, callback) => {
        dataAxios.get(`/api/therapist/appointment/${id}`)
            .then( res => this.setState({ therAppointments: res.data }, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    postNewAppointment = (date, callback) => {
        this.setState({ appDate: date }, () => {
            const newAppointment = {
                clientID: this.state.clientID,
                clientName: this.state.clientName,
                clientEmail: this.state.clientEmail,
                appLengthInMinutes: this.state.appLengthInMinutes,
                appDate: this.state.appDate,
                therapistID: this.state.therapistID,
                therapistName: this.state.therapistName,
                therapistEmail: this.state.therapistEmail,
                therapistPhoneNumber: this.state.therapistPhoneNumber,
                address: this.state.address
            }
            dataAxios.post("/api/appointment", newAppointment)
                .then(res => this.setState({ currentAppointmentInProgress: res.data }, () => callback()))
                .catch(err => console.log(err.response.data.errMsg))
            this.setState({
                clientID: "",
                clientName: "",
                clientEmail: "",
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
    cancelAppointment = () => {









        

    }
    updateVisits = (_id, updates, callback) => {
        dataAxios.put(`/api/info/visits/${_id}`, updates)
            .then(res => {
                if (res.data === "Done") callback()
            })
            .catch(err => this.setState({errMsg: err.response.data.errMsg}))
    }
    handleNameIDAdd = (clientID, clientName, therapistName, address, phoneNumber, clientEmail, therapistEmail) => {
        this.setState({
            clientID: clientID,
            clientName: clientName,
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
    orderAppointments = appointments => {
        const today = new Date()
        const past = appointments.filter(obj => new Date(obj.appDate) < today )
        const present = appointments.filter(obj => new Date(obj.appDate) > today )
        past.sort((app1, app2) => new Date(app2.appDate) - new Date(app1.appDate))
        present.sort((app1, app2) => new Date(app1.appDate) - new Date(app2.appDate))
        return [past, present]
    }
    render(){
        return(
            <AppointmentContext.Provider
                value={{
                    ...this.state,
                    getAllCompanyAppointments: this.getAllCompanyAppointments,
                    getAllClientAppointments: this.getAllClientAppointments,
                    getAllTherapistAppointments: this.getAllTherapistAppointments,
                    postNewAppointment: this.postNewAppointment,
                    updateAppointment: this.updateAppointment,
                    // deleteAppointment: this.deleteAppointment,
                    handleChange: this.handleChange,
                    handleNameIDAdd: this.handleNameIDAdd,
                    orderAppointments: this.orderAppointments,
                    updateVisits: this.updateVisits
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