import React, { Component } from 'react'

import DefaultImg from "../images/default-img.jpg"

import { withTherapist } from "../context/TherapistProvider.js"
import { withUser } from "../context/UserProvider.js"

class Therapist extends Component {
    constructor(){
        super()
        this.state = {
            image: DefaultImg
        }
    }
    setImage = () => {
        const { profileImgName, _id } = this.props
        if (profileImgName !== 'none'){
            const therapistImage = this.props.therapistImages.filter((imageObj) => {
                return imageObj.id === _id
            })
            if (therapistImage.length > 0) this.setState({ image: therapistImage[0].file });
        }
    }
    componentDidMount(){
        this.setImage()
    }
    componentDidUpdate(prevProps){
        if (this.state.image === DefaultImg && prevProps.therapistImages !== this.props.therapistImages) this.setImage();
    }
    render(){
        const { firstName, lastName, address, firstCharCap, numbers } = this.props
        const mappedShownTherapists = numbers.total.map((bullet, i) => {
            return <span key={i} className={i === numbers.therapist ? "bulletBlack" : "bulletGray"}></span>
        })
        return(
            <div className="therapist">
                <div className="displayImgContainer">
                <img src={this.state.image} alt={"one"} className="displayImg"/>
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

export default withTherapist(withUser(Therapist));