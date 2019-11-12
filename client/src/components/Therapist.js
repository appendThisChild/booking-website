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
        const { firstName, lastName, address, firstCharCap, numbers } = this.props
        const mappedShownTherapists = numbers.total.map((bullet, i) => {
            return <span key={i} className={i === numbers.therapist ? "bulletBlack" : "bulletGray"}>&#x2022;</span>
        })
        return(
            <div className="therapist">
                <div className="displayImg">
                <img src={this.state.image} alt={"one"}/>
                </div>
                <div>
                    <p>{firstCharCap(firstName)} {firstCharCap(lastName)}</p>
                    <p>{address.city}, {address.state}</p>
                </div>
                <div className="bulletContainer">
                    {mappedShownTherapists}
                </div>
            </div>
        )
    }
}

export default withUser(withImage(Therapist));