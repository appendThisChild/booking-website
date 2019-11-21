import React, { useContext } from 'react'
import axios from "axios"

const PasswordRecoveryContext = React.createContext()

const PasswordRecoveryProvider = props => {
    const recoveryRequest = (email, callback) => {
        axios.post("/recover/request", { email: email })
            .then(res => callback(res.data))
            .catch(err => console.log(err.response.data.errMsg))
    }
    const checkForRequest = (id, callback) => {
        axios.get(`/recover/request/${id}`)
            .then(res => callback(res.data))
            .catch(err => console.log(err.response.data.errMsg))
    }
    const updatePassword = (id, password, callback) => {
        axios.put(`/recover/change/${id}`, { password: password })
            .then(res => callback(res.data))
            .catch(err => console.log(err.response.data.errMsg))
    }
    return(
        <PasswordRecoveryContext.Provider 
            value={{
                recoveryRequest,
                checkForRequest,
                updatePassword
            }} 
            {...props} 
        />
    )
}

const usePasswordRecovery = () => {
    const context = useContext(PasswordRecoveryContext)
    if (!context){
        throw new Error("You must use PasswordRecoveryProvider to consume PasswordRecovery Context")
    }
    return context
}

export { PasswordRecoveryProvider, usePasswordRecovery }