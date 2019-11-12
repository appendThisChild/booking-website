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
        const bulletArray = []
        for (let i = 0; i < this.props.therapists.length; i++){
            bulletArray.push("bullet")
        }
        const mappedTherapists = this.props.therapists.map((therapist, i) => 
            <Therapist {...therapist} key={therapist._id} numbers={{ therapist: i, total: bulletArray }}/>
        )
        return(
            <div className="therapistContainer">
                {mappedTherapists}
            </div>
        )
    }
}

export default withTherapist(TherapistDisplay);