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
        this.props.getAllTherapists(() => {})
    }
    handlePickTime = e => {
        e.preventDefault()
        this.props.makingAppointment()
        this.props.history.push('/pickTime')
        
    }
    render(){
        return(
            <div className="background">
                <div className="border">
                    <PricingDisplay pricing={this.props.genInfo.pricing} className={"bookingPriceDisplay"}/>
                    <div className="bookingTherapistDisplay">
                        <div>
                            <h3>Book a Massage:</h3>
                            <TherapistDisplay />
                            <TherapistTimeChoice handleSubmit={this.handlePickTime} className="selectTherapist"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withGeneral(withTherapist(withUser(Book)));