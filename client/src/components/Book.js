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
        window.scroll(0,0)
    }
    handlePickTime = e => {
        e.preventDefault()
        this.props.makingAppointment()
        this.props.history.push('/pickTime')
        
    }
    render(){
        return(
            <div className="book">
                <main>
                    <div>
                        <h1>Book a Massage</h1>
                        <div>
                            <TherapistDisplay />
                            <TherapistTimeChoice handleSubmit={this.handlePickTime} className=""/>
                        </div>
                    </div>
                </main>
                <div className="firstBookDivide"></div>
                <PricingDisplay pricing={this.props.genInfo.pricing} travelFee={this.props.genInfo.onSitePricing} className={""}/>
            </div>
        )
    }
}

export default withGeneral(withTherapist(withUser(Book)));