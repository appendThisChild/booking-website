import React from "react"

const LoginAuthForm = props => {
    const { handleChange, handleSubmit, email, password, btnText } = props
    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                name="email" 
                value={email} 
                onChange={handleChange} 
                require="true"
                placeholder="Email"/>
            <input 
                type="password" 
                name="password" 
                value={password} 
                onChange={handleChange} 
                require="true"
                placeholder="Password"/>
            <button>{btnText}</button>
        </form>
    )
}

export default LoginAuthForm;