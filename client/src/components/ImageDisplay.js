import React, { Component } from 'react'

import DefaultImg from "../images/default-img.jpg"

import { withImage } from '../context/ImageProvider.js'
import { withUser } from "../context/UserProvider.js"

class ImageDisplay extends Component {
    constructor(props){
        super(props)
        this.state = {
            imageData: "",
            imageDisplay: DefaultImg
        }
    }
    handleChange = e => {
        const data = new FormData()
        data.append('image', e.target.files[0])
        this.setState({
            imageDisplay: URL.createObjectURL(e.target.files[0]),
            imageData : data
        })
    }
    handleUpload = () => {
        const data = this.state.imageData
        const { _id } = this.props.user
        this.props.postFile(_id, data)
    }
    handleReplace = () => {
        const data = this.state.imageData
        const { _id, profileImgName } = this.props.user
        this.props.updateFile(_id, profileImgName, data)
    }
    componentDidMount(){
        const { profileImgName } = this.props.user
        if (profileImgName !== "none"){
            this.props.getFile(profileImgName, (image) => this.setState({ imageDisplay: image }))
        }
    }

    render(){
        const { profileImgName } = this.props.user
        return(
            <div>
                <img src={this.state.imageDisplay} alt="file" className="displayImg"/>
                {profileImgName === "none" ?
                <>
                    <input type="file" onChange={(e) => this.handleChange(e)}/>
                    <button onClick={this.handleUpload}>Upload</button>
                </>
                :
                <>
                    <input type="file" onChange={(e) => this.handleChange(e)}/>
                    <button onClick={this.handleReplace}>Replace</button>
                </>}
            </div>
        )
    }
}

export default withUser(withImage(ImageDisplay));