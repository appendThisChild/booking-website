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
    sendToReset = () => {
        this.props.history.push("/recover/request/0")
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
            firstName: this.props.inputLowercaseNospace(this.state.firstName),
            lastName: this.props.inputLowercaseNospace(this.state.lastName),
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
    render(){
        return(
            <div className="background">
                <div className="border">
                    <div className="loginSignup">
                        {this.state.formToggle ?
                        <div>
                            <h1>Sign Up</h1>
                            
                            <p>Already have an Account? <span onClick={this.toggleForm}>Click here</span> to Login!</p>
                            <SignupAuthForm
                                errMsg={this.props.errMsg}
                                firstName={this.state.firstName}
                                lastName={this.state.lastName}
                                email={this.state.email}
                                password={this.state.password}
                                handleChange={this.handleChange}
                                handleSubmit={this.handleSignupSubmit}
                                btnText="Sign Up"   
                            />
                            <p>Forgot password? <span onClick={this.sendToReset}>Click here</span> to reset.</p>
                        </div>
                        :
                        <div>
                            <h1>Login</h1>
                            <p>New Client? <span onClick={this.toggleForm}>Click here</span> to create an account!</p>
                            
                            <LoginAuthForm
                                errMsg={this.props.errMsg}
                                email={this.state.email}
                                password={this.state.password}
                                handleChange={this.handleChange}
                                handleSubmit={this.handleLoginSubmit}
                                btnText="Log In"   
                            />
                            <p>Forgot password? <span onClick={this.sendToReset}>Click here</span> to reset.</p>
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default withUser(SignIn);