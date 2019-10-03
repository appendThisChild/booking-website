import React, { Component } from "react"
import axios from "axios"

import DefaultImg from "../images/default-img.jpg"

const ImageContext = React.createContext()

const dataAxios = axios.create()

dataAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

class ImageProvider extends Component {
    constructor(){
        super()
        this.state = {
            viewImage: DefaultImg
        }
    }

    getImageFiles = () => {
        axios.get('/image/images')
            .then(res => {
                console.log(res.data)
            })
            .catch(err => console.log(err.response.data.errMsg))
    }
    getImageFile = (filename) => {
        axios.get(`/image/images/${filename}`)
            .then(res => {
                console.log(res.data)
                this.setState({viewImage: res.data})
            })
            .catch(err => console.log(err.response.data.errMsg))
    }

    postImage = (imageFormObj) => {
        axios.post('/image/upload', imageFormObj)
            .then(res => {
            if (res.data.success) {
                console.log("Image has been successfully uploaded using multer")
            }
            })
            .catch(err => console.log(err.response.data.errMsg))
    }

    render(){
        return(
            <ImageContext.Provider
                value={{
                    ...this.state,
                    postImage: this.postImage,
                    getImageFiles: this.getImageFiles,
                    getImageFile: this.getImageFile
                }}>
                {this.props.children}
            </ImageContext.Provider>
        )
    }
}

export default ImageProvider;

export const withImage = C => props => (
    <ImageContext.Consumer>
        {value => <C {...value} {...props}/>}
    </ImageContext.Consumer>
)