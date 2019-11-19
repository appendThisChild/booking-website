import React, { Component } from 'react'



import { withImage } from '../context/ImageProvider.js'
import { withUser } from "../context/UserProvider.js"

class ImageDisplay extends Component {
    constructor(props){
        super(props)
        this.state = {
            imageData: "",
            imageDisplay: props.imageDisplay
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
    handleUpload = e => {
        e.preventDefault()
        const data = this.state.imageData
        const { _id } = this.props.user
        this.props.postFile(_id, data)
    }
    handleReplace = e => {
        e.preventDefault()
        const data = this.state.imageData
        const { _id, profileImgName } = this.props.user
        this.props.updateFile(_id, profileImgName, data)
    }
    componentDidUpdate(prevProps){
        if (prevProps.imageDisplay !== this.props.imageDisplay){
            this.setState({imageDisplay: this.props.imageDisplay})
        }
    }
    render(){
        const { profileImgName } = this.props.user
        return(
            <article>
                <h2>Profile Image:</h2>
                <img src={this.state.imageDisplay} alt="file" className="displayImg"/>
                {profileImgName === "none" ?
                <form onSubmit={this.handleUpload}>
                    <p>Upload a Image:</p>
                    <div>
                        <p>Choose File</p>
                        <input type="file" required={true} onChange={(e) => this.handleChange(e)}/>
                    </div>
                    <button>Upload</button>
                </form>
                :
                <form onSubmit={this.handleReplace}>
                    <p>Replace the Iamge:</p>
                    <div>
                        <p>Choose File</p>
                        <input type="file" required={true} onChange={(e) => this.handleChange(e)} />
                    </div>
                    <button>Replace</button>
                </form>}
            </article>
        )
    }
}

export default withUser(withImage(ImageDisplay));