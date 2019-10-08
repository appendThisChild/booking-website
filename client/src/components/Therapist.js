import React, { Component } from 'react'

import DefaultImg from "../images/default-img.jpg"

import { withImage } from "../context/ImageProvider.js"
import { withUser } from "../context/UserProvider.js"

class Therapist extends Component {
    constructor(){
        super()
        this.state = {
            image: DefaultImg
        }
    }

    componentDidMount(){
        const { profileImgName } = this.props
        if (profileImgName !== 'none'){
            this.props.getFile(profileImgName, (image) => {
                this.setState({image: image})
            })
        }
    }
    render(){
        const { firstName, lastName, address, firstCharCap } = this.props
        return(
            <div>
                <img src={this.state.image} alt={"one"} className="displayImg"/>
                <p>{firstCharCap(firstName)} {firstCharCap(lastName)}</p>
                <p>{address.city}, {address.state}</p>
            </div>
        )
    }
}

export default withUser(withImage(Therapist));