import React, { Component } from 'react'

import Therapist from './Therapist.js'

import { withImage } from "../context/ImageProvider.js"
import { withTherapist } from "../context/TherapistProvider.js"

class TherapistDisplay extends Component {
    constructor(){
        super()
        this.state = {

        }
    }
    componentDidMount(){
        if (this.props.therapists.length === 0) {
            this.props.getAllTherapists(() => {
                this.props.therapists.forEach(therapist => {
                    if (therapist.profileImgName !== 'none'){
                        this.props.getFile(therapist.profileImgName, (image) => {
                            this.props.saveImageFile({ id: therapist._id, file: image})
                        })
                    }
                })
                
            })
        }
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

export default withImage(withTherapist(TherapistDisplay));