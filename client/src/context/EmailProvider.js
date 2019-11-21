import React, { Component } from 'react'
import axios from 'axios'

const EmailContext = React.createContext()

const dataAxios = axios.create()

dataAxios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

class EmailProvider extends Component {
    constructor(){
        super()
        this.state = {

        }
    }
    sendEmail = (from, subject, message, callback) => {
        const data = {
            from: from,
            subject: subject + ` - from: ${from}`,
            message: message
        }
        axios.post('/email/contact', data)
            .then(res => { callback(res.data) })
            .catch(err => console.log(err.response.data.errMsg))

    }

    render(){
        return(
            <EmailContext.Provider
                value={{
                    ...this.state,
                    sendEmail: this.sendEmail
                }}>
                {this.props.children}
            </EmailContext.Provider>
        )
    }
}

export default EmailProvider;

export const withEmail = C => props => (
    <EmailContext.Consumer>
        {value => <C {...value} {...props}/>}
    </EmailContext.Consumer>
)