import React, { Component } from "react"

import TherapistTimeChoice from "./TherapistTimeChoice.js"

import { withUser } from "../context/UserProvider.js"
import { withTherapist } from "../context/TherapistProvider.js"

class Book extends Component {
    constructor(){
        super()
        this.state = {

        }
    }
    componentDidMount(){
        this.props.getAllTherapists()
    }
    handlePickTime = () => {
        this.props.makingAppointment()
        this.props.history.push('/pickTime')
    }
    render(){
        return(
            <div>
                <TherapistTimeChoice />
                <button onClick={this.handlePickTime}>Pick Time</button>
            </div>
        )
    }
}

export default withTherapist(withUser(Book));