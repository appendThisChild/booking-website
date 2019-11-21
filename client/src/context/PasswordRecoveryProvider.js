import React, { useContext } from 'react'
import axios from "axios"

const PasswordRecoveryContext = React.createContext()

const PasswordRecoveryProvider = props => {
    // const [count, setCount] = useState(0)
    // const countMeno = useMemo(() => ({ count, setCount }), [count])
    // const state = {
    //     // count
    // }


    const recoveryRequest = (email, callback) => {
        console.log(email)
        // create recovery instance 
        axios.post("/recover", {email: email})
            .then(res => console.log(res.data))
            .catch(err => console.log(err.response.data.errMsg))
        callback()
    }
    return(
        <PasswordRecoveryContext.Provider 
            value={{
                recoveryRequest
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