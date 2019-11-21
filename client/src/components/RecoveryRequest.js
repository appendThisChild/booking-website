import React, { useState } from 'react'

import { usePasswordRecovery } from "../context/PasswordRecoveryProvider.js"

const Request = () => {
    const [email, setEmail] = useState("")
    const [request, setRequest] = useState(false)
    const { recoveryRequest } = usePasswordRecovery()

    const handleSubmit = e => {
        e.preventDefault()
        recoveryRequest(email, () => {
            setRequest(true)
        })
    }

    if (!request){
        return(
            <div className="passwordRecovery">
                <form onSubmit={handleSubmit}>
                    <h2>Enter email address</h2>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required={true}/> 
                    <button>Reset Password</button>
                </form>
            </div>
        )
    } else {
        return(
            <div className="passwordRecovery">
                <main>
                    <h2>Request Sent!</h2>
                    <p>Check email for password reset.</p>
                </main>
            </div>
        )
    }
    
}

export default Request;