import React, { Component } from 'react'

import { withImage } from '../context/ImageProvider.js'

class ImageDisplay extends Component {
    constructor(props){
        super(props)
        this.state = {
            multerImage: props.viewImage
        }
    }

    uploadImage = e => {
        let imageFormObj = new FormData();
        imageFormObj.append("file", e.target.files[0])
        this.setState({
            multerImage: URL.createObjectURL(e.target.files[0])
        });
       this.props.postImage(imageFormObj)
    }
    getThisImage = () => {
        this.props.getImageFile("1fa28df229dcbdf1c3bec63079de507f.png")
    }

    componentDidMount(){
        this.props.getImageFiles()

    }
    render(){
        return(
            <div>
                <input type="file" onChange={(e) => this.uploadImage(e)} />
                <img src={this.state.multerImage} alt="uploadedImg" className="displayImg"/>
                <button onClick={this.getThisImage}>Get Image</button>
            </div>
        )
    }
}

export default withImage(ImageDisplay);