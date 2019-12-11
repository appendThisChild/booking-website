import React, { Component } from "react"
import axios from "axios"

const GoogleContext = React.createContext()

const dataAxios = axios.create()

dataAxios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

class GoogleProvider extends Component {
    constructor(){
        super()
        this.state = {

        }
    }

    getEvents = () => {
        dataAxios.get('/api/calendar')
            .then(res => console.log(res.data))
            .catch(err => console.log(err.response.data.errMsg))
    }
    postEvent = (event, callback) => {
        // const minutes = new Date(event.appDate).getMinutes()
        // const date = new Date(event.appDate).setMinutes(minutes + event.appLengthInMinutes)
        // const toSend = {
        //     appointment: event,
        //     endDate: new Date(date)
        // }
        // dataAxios.post('/api/calendar', toSend)
        //     .then(() => { 
        //         callback("Success") 
        //     })
        //     .catch(err => {
        //         callback(err.response.data.errMsg)
        //     })
        callback("nothing")
    }
    deleteEvent = (id, callback) => {
        dataAxios.delete(`/api/calendar/${id}`)
            .then(res => { 
                if (res.data === "Event deleted."){ 
                    callback() 
                }
            })
            .catch(err => console.log(err.response.data.errMsg))
    }

    render(){
        return(
            <div>
                <GoogleContext.Provider
                    value={{
                        ...this.state,
                        getEvents: this.getEvents,
                        postEvent: this.postEvent,
                        deleteEvent: this.deleteEvent
                    }}>
                {this.props.children}
                </GoogleContext.Provider>
            </div>
        )
    }
}

export default GoogleProvider;

export const withGoogle = C => props => (
    <GoogleContext.Consumer>
        {value => <C {...value} {...props}/>}
    </GoogleContext.Consumer>
)

