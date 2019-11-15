import React, { Component } from "react"
import axios from "axios"

const OwnerContext = React.createContext()

const dataAxios = axios.create()

dataAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

class OwnerProvider extends Component {
    constructor(){
        super()
        this.state = {
            accounts: [],
            searchedAccount: {},
            searchedTherapistHistory: [],
            searchedClientHistory: []
        }
    }

    getAllAccounts = () => {
        dataAxios.get('/api/owner/user')
            .then(res => this.setState({ accounts: res.data.sort((acc1, acc2) => acc2.phoneNumber - acc1.phoneNumber) }))
            .catch(err => console.log(err.response.data.errMsg))
    }


    setAccount = (_id, dateData, callback) => {
        dataAxios.get(`/api/owner/user/${_id}`)
            .then(res => this.setState({ searchedAccount: res.data }, () => {
                this.getAccountClientHistory(_id, dateData, () => callback(res.data.isTherapist))
            }))
            .catch(err => console.log(err.response.data.errMsg))
    }

    getAccountClientHistory = (_id, dateData, callback) => {
        dataAxios.post(`/api/owner/appointment/client/${_id}`, dateData)
            .then(res => this.setState({ searchedClientHistory: res.data }, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))

    }
    getAccountTherapistHistory = (_id, dateData, callback) => {
        dataAxios.post(`/api/owner/appointment/therapist/${_id}`, dateData)
            .then(res => this.setState({ searchedTherapistHistory: res.data }, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }

    updateAccount = (_id, updates) => {
        dataAxios.put(`/api/owner/user/${_id}`, updates)
        .then(res => this.setState(prevState => ({ 
            accounts: prevState.accounts.map(account => account._id === _id ? res.data : account)
        })))
        .catch(err => console.log(err.response.data.errMsg))
    }

    render(){
        return(
            <OwnerContext.Provider
                value={{
                    ...this.state,
                    getAllAccounts: this.getAllAccounts,
                    updateAccount: this.updateAccount,
                    setAccount: this.setAccount,
                    getAccountClientHistory: this.getAccountClientHistory,
                    getAccountTherapistHistory: this.getAccountTherapistHistory
                }}>
                {this.props.children}
            </OwnerContext.Provider>
        )
    }
}

export default OwnerProvider;

export const withOwner = C => props => (
    <OwnerContext.Consumer>
        {value => <C {...value} {...props}/>}
    </OwnerContext.Consumer>
)