import React, { Component } from "react"

import TherapistTimeChoice from "./TherapistTimeChoice.js"
import TherapistDisplay from "./TherapistDisplay.js"
import PricingDisplay from './PricingDisplay.js';

import { withUser } from "../context/UserProvider.js"
import { withTherapist } from "../context/TherapistProvider.js"
import { withGeneral } from '../context/GeneralInfoProvider.js'

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
                <h3>Pricing</h3>
                <PricingDisplay pricing={this.props.genInfo.pricing} className={""}/>
                <TherapistDisplay />
            </div>
        )
    }
}

export default withGeneral(withTherapist(withUser(Book)));