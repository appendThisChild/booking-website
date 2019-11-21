import React, { useEffect, useState } from 'react'

import { usePasswordRecovery } from "../context/PasswordRecoveryProvider.js"

const Change = props => {
    const [dataIn, setDataIn] = useState(false)
    const [status, setStatus] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [finished, setFinished] = useState(false)
    const [errMsg, setErrMsg] = useState("")

    const { checkForRequest, updatePassword } = usePasswordRecovery()

    const changePassword = () => {
        if ( password.length > 7){
            if (password === confirmPassword) {
                updatePassword(props.id, password, () => {
                    setFinished(true)
                })
            } else {
                setErrMsg('"Passwords do not match!"')
            }
        } else {
            setErrMsg('"Password is not long enough!"')
        }
    }

    useEffect(() => {
        checkForRequest(props.id, (response) => {
            setStatus(response.live)
            setDataIn(true)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return(
        <div className="passwordRecovery">
            {dataIn ? 
            <section>
                {status ? 
                <>
                    {finished ?
                    <>
                        <h2>Password Change Successful!</h2>
                    </>
                    :
                    <>
                        <h3>Change Password:</h3>
                        <h5>Must be at least 8 characters</h5>
                        <p>{errMsg}</p>
                        <article>
                            <span>New Password:</span>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        </article>
                        <article>
                            <span>Confirm Password:</span>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
                        </article>
                        <button onClick={changePassword}>Change Password</button>
                    </>
                    }
                </>
                :
                <>
                    <h2>Password Reset Expired!</h2>
                </>
                }
            </section>
            : 
            <section>
                <h2>Waiting for Response!</h2>
            </section>}
        </div>
    )
}

export default Change;