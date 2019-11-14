import React from "react"

const SignupAuthForm = props => {
    const { handleChange, handleSubmit, firstName, lastName, email, password, btnText } = props
    return (
        <form onSubmit={handleSubmit}>
            <span>{props.errMsg}</span>
            <div>
                <input 
                    type="text" 
                    name="firstName" 
                    value={firstName} 
                    onChange={handleChange} 
                    required={true}
                    placeholder="First Name"/>
                <input 
                    type="text" 
                    name="lastName" 
                    value={lastName} 
                    onChange={handleChange} 
                    required={true}
                    placeholder="Last Name"/>
            </div>
            <div>
                <input 
                    type="email" 
                    name="email" 
                    value={email} 
                    onChange={handleChange} 
                    required={true}
                    placeholder="Email"/>
                <input 
                    type="password" 
                    name="password" 
                    value={password} 
                    onChange={handleChange} 
                    required={true}
                    placeholder="Password"/>
            </div>
            <button>{btnText}</button>
        </form>
    )
}

export default SignupAuthForm;