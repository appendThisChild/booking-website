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
            image: DefaultImg
        }
    }
    postFile = data => {
        // console.log(data)
        axios.post('/image/', data)
            .then( res => {
                console.log(res.data)
            })
            .catch(err => console.log(err.response.data.errMsg))
    }
    getFile = (id, callback) => {
        axios.get(`/image/${id}`)
            .then( res => {
                console.log(res.data)
                this.setState({
                    image: `data:image/png;base64,${res.data}`
                }, () => callback())
            })
            .catch(err => console.log(err.response.data.errMsg))
    }

    render(){
        return(
            <ImageContext.Provider
                value={{
                    ...this.state,
                    postFile: this.postFile,
                    getFile: this.getFile
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