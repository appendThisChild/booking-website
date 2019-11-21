import React, { Component } from 'react'
import axios from 'axios'

const BlackoutDatesContext = React.createContext()

const dataAxios = axios.create()

dataAxios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

class BlackoutDatesProvider extends Component {
    constructor(){
        super()
        this.state = {
            blackoutDates: []
        }
    }
    getTherapistsBlackoutDates = (id, callback) => {
        dataAxios.get(`/api/therapist/blackout/${id}`)
            .then(res => this.setState({blackoutDates: res.data}, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    postNewBlackoutDate = newBlackoutDate => {
        dataAxios.post('/api/therapist/blackout', newBlackoutDate)
            .then(res => this.setState(prevState => ({ blackoutDates: [...prevState.blackoutDates, res.data] })))
            .catch(err => console.log(err.response.data.errMsg))
    }
    deleteBlackoutDate = id => {
        dataAxios.delete(`/api/therapist/blackout/${id}`)
            .then(res => this.setState(prevState => ({ blackoutDates: prevState.blackoutDates.filter(blackoutDate => blackoutDate._id !== id)})))
            .catch(err => console.log(err.response.data.errMsg))
    }
    clientGetTherapistsBlackDates = (id, callback) => {
        dataAxios.get(`/api/therapists/blackout/${id}`)
            .then(res => this.setState({blackoutDates: res.data}, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    render(){
        return(
            <BlackoutDatesContext.Provider
                value={{
                    ...this.state,
                    getTherapistsBlackoutDates: this.getTherapistsBlackoutDates,
                    postNewBlackoutDate: this.postNewBlackoutDate,
                    deleteBlackoutDate: this.deleteBlackoutDate,
                    clientGetTherapistsBlackDates: this.clientGetTherapistsBlackDates
                }}>
                {this.props.children}
            </BlackoutDatesContext.Provider>
        )
    }
}

export default BlackoutDatesProvider;

export const withBlackoutDates = C => props => (
    <BlackoutDatesContext.Consumer>
        {value => <C {...value} {...props}/>}
    </BlackoutDatesContext.Consumer>
)