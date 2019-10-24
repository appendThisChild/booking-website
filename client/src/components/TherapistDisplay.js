import React, { Component } from 'react'

import Therapist from './Therapist.js'

import { withTherapist } from "../context/TherapistProvider.js"

class TherapistDisplay extends Component {
    constructor(){
        super()
        this.state = {

        }
    }
    componentDidMount(){
        this.props.getAllTherapists()
    }
    render(){
        const mappedTherapists = this.props.therapists.map(therapist => 
            <Therapist {...therapist} key={therapist._id}/>
        )
        return(
            <div className="therapistContainer">
                {mappedTherapists}
            </div>
        )
    }
}

export default withTherapist(TherapistDisplay);