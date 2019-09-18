import React, { Component } from "react"
import { withUser } from "../context/UserProvider.js"

import LoginAuthForm from "./LoginAuthForm.js"
import SignupAuthForm from "./SignupAuthForm.js"

class SignIn extends Component {
    constructor(){
        super()
        this.state = {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            formToggle: false
        }
    }
    toggleForm = () => {
        this.setState(prevState => ({ formToggle: !prevState.formToggle }))
    }
    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleLoginSubmit = e => {
        e.preventDefault()
        const credentials = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.login(credentials)
        this.setState({
            email: "",
            password: ""
        })
    }
    handleSignupSubmit = e => {
        e.preventDefault()
        const credentials = {
            firstName: this.inputLowercaseNospace(this.state.firstName),
            lastName: this.inputLowercaseNospace(this.state.lastName),
            email: this.state.email,
            password: this.state.password
        }
        this.props.signup(credentials)
        this.setState({
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        })
    }
    inputLowercaseNospace = str => {
        const strPhase1 = str.trim()
        const strFinal = strPhase1.toLowerCase()
        return strFinal
    }
    render(){
        return(
            <div>
                {this.state.formToggle ?
                <>
                    <h1>Sign Up</h1>
                    <p>{this.props.errMsg}</p>
                    <SignupAuthForm
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        email={this.state.email}
                        password={this.state.password}
                        handleChange={this.handleChange}
                        handleSubmit={this.handleSignupSubmit}
                        btnText="Sign Up"   
                    />
                    <p onClick={this.toggleForm}>Already have an Account? Click here to Login!</p>
                </>
                :
                <>
                    <h1>Login</h1>
                    <p>{this.props.errMsg}</p>
                    <LoginAuthForm
                        email={this.state.email}
                        password={this.state.password}
                        handleChange={this.handleChange}
                        handleSubmit={this.handleLoginSubmit}
                        btnText="Log In"   
                    />
                    <p onClick={this.toggleForm}>New Client? Click here to create an account!</p>
                </>
                }
            </div>
        )
    }
}

export default withUser(SignIn);