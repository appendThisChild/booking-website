import React, { Component } from "react"
import axios from "axios"

import { withUser } from "../context/UserProvider.js"

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
        }
    }
    // posts a new image into the system
    postFile = (_id ,data) => {
        axios.post(`/images/upload/${_id}`, data)
            .then(res => {
                const updatedUser = res.data
                this.props.updateState(updatedUser)
            })
            .catch(err => console.log(err.response.data.errMsg))
    }
    // gets an image from the system and send it back as a callback
    getFile = (filename, callback) => {
        axios.get(`/images/download/${filename}`)
            .then(res => {
                const imageFile = `data:image/png;base64,${res.data}`
                callback(imageFile)
            })
            .catch(err => console.log(err.response.data.errMsg))
    }
    // gets all the images metadata from the system
    updateFile = (_id, filename, data) => {
        axios.put(`/images/${_id}/${filename}`, data)
            .then(() => window.location.reload())
            .catch(err => console.log(err.response.data.errMsg))
    }

    render(){
        return(
            <ImageContext.Provider
                value={{
                    ...this.state,
                    postFile: this.postFile,
                    getFile: this.getFile,
                    updateFile: this.updateFile
                }}>
                {this.props.children}
            </ImageContext.Provider>
        )
    }
}

export default withUser(ImageProvider);

export const withImage = C => props => (
    <ImageContext.Consumer>
        {value => <C {...value} {...props}/>}
    </ImageContext.Consumer>
)