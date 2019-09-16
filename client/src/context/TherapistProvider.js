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
            therapistAppointments: [{
                appDate: new Date(2019, 8, 18, 10, 30),
                appLengthInMinutes: 120
            },{
                appDate: new Date(2019, 8, 18, 9, 0),
                appLengthInMinutes: 60
            },{
                appDate: new Date(2019, 8, 17, 11, 30),
                appLengthInMinutes: 90
            }]
        }
    }
    getAllTherapists = () => {
        dataAxios.get("/therapists")
            .then(res => {
                this.setState({ therapists: res.data })
            })
            .catch(err => console.log(err.response.data.errMsg))
    }
    getAllAppointmentsForSelectedTherapist = () => {
        // get the appointments by therapist ID 
        // check if canceled and remove from list
        // check if payment pending and past 10 minutes and removed from list and delete
        // 
    }
    render(){
        return(
            <TherapistContext.Provider
                value={{
                    ...this.state,
                    getAllTherapists: this.getAllTherapists
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