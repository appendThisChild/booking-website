import React, { Component } from "react"
import axios from "axios"

const TherapistContext = React.createContext()

const dataAxios = axios.create()

dataAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

class TherapistProvider extends Component {
    constructor(){
        super()
        this.state = {
            therapists: [],
            therapistAppointments: []
        }
    }
    getAllTherapists = () => {
        dataAxios.get("/therapists")
            .then(res => this.setState({ therapists: res.data }))
            .catch(err => console.log(err.response.data.errMsg))
    }
    getAllAppointmentsForSelectedTherapist = (id, callback) => {
        dataAxios.get(`/api/therapists/${id}`)
            .then(res => this.setState({ therapistAppointments: res.data }, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    render(){
        return(
            <TherapistContext.Provider
                value={{
                    ...this.state,
                    getAllTherapists: this.getAllTherapists,
                    getAllAppointmentsForSelectedTherapist: this.getAllAppointmentsForSelectedTherapist
                }}>
                {this.props.children}
            </TherapistContext.Provider>
        )
    }
}

export default TherapistProvider;

export const withTherapist = C => props => (
    <TherapistContext.Consumer>
        {value => <C {...value} {...props}/>}
    </TherapistContext.Consumer>
)