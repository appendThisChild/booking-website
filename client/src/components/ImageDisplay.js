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

        imageFormObj.append("imageName", "multer-image-" + Date.now())
        imageFormObj.append("file", e.target.files[0])

        // stores a readable instance of 
        // the image being uploaded using multer
        this.setState({
            multerImage: URL.createObjectURL(e.target.files[0])
        });

       this.props.postImage(imageFormObj)
    }
    getThisImage = () => {
        this.props.getImageFile("86a21212e065e683441be3156646b5cd.png")
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