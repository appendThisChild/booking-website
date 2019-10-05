import React, { Component } from 'react'

import { withImage } from '../context/ImageProvider.js'

class ImageDisplay extends Component {
    constructor(props){
        super(props)
        this.state = {
            image: props.image,
            imageData: ""
        }
    }
    handleChange = e => {
        // console.log(URL.createObjectURL(e.target.files[0]))
        const data = new FormData()
        data.append('image', e.target.files[0])
        this.setState({
            image: URL.createObjectURL(e.target.files[0]),
            imageData : data
        })
    }
    handleUpload = () => {
        const data = this.state.imageData
        this.props.postFile(data)
    }
    componentDidMount(){
        this.props.getFile("f995b3dfc1967790a369480d3696528b.JPG", () => {
            this.setState({ image: this.props.image})
        })
    }

    render(){
        return(
            <div>
                <img src={this.state.image} alt="file" className="displayImg"/>
                <input type="file" onChange={(e) => this.handleChange(e)}/>
                <button onClick={this.handleUpload}>Upload</button>
            </div>
        )
    }
}

export default withImage(ImageDisplay);