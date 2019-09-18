import React, { Component } from "react"
import axios from "axios"
import { withRouter } from 'react-router-dom'

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
            currentAppointmentInProgress: "",
            appLengths: [60, 90, 120],
            clientID: "",
            clientName: "",
            appLengthInMinutes: "",
            appDate: "",
            therapistID: "",
            therapistName: "",
            address: "",
            packageChoice: "",
            canceled: false,
            status: "",
            amount: ""
        }
    }
    getAllAppointments = () => {
        dataAxios.get("/api/owner/appointment")
            .then( res => this.setState({ ownerAppointments: res.data }))
            .catch(err => console.log(err.response.data.errMsg))
    }
    getAllClientAppointments = () => {
        
    }
    getAllTherapistAppointments = () => {

    }
    postNewAppointment = date => {
        this.setState({ appDate: date }, () => {
            const newAppointment = {
                clientID: this.state.clientID,
                clientName: this.state.clientName,
                appLengthInMinutes: this.state.appLengthInMinutes,
                appDate: this.state.appDate,
                therapistID: this.state.therapistID,
                therapistName: this.state.therapistName,
                address: this.state.address
            }
            dataAxios.post("/api/appointment", newAppointment)
                .then(res => this.setState({ currentAppointmentInProgress: res.data }, () => this.props.history.push("/selectPackageAndSubmit")))
                .catch(err => console.log(err.response.data.errMsg))
            this.setState({
                clientID: "",
                clientName: "",
                appLengthInMinutes: "",
                appDate: "",
                therapistID: "",
                therapistName: "",
                address: ""
            })
        })
    }
    updateAppointment = () => {

    }
    deleteAppointment = () => {

    }
    handleNameIDAdd = (clientID, clientName, therapistName, address) => {
        this.setState({
            clientID: clientID,
            clientName: clientName,
            therapistName: therapistName,
            address: address
        })
    }
    handleChange = e => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        this.setState({ [e.target.name] : value })
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

export default withRouter(AppointmentProvider);

export const withAppointment = C => props => (
    <AppointmentContext.Consumer>
        {value => <C {...value} {...props}/>}
    </AppointmentContext.Consumer>
)