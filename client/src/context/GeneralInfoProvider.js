import React, { Component } from 'react'
import axios from 'axios';

const GeneralInfoContext = React.createContext()

const dataAxios = axios.create()

dataAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

class GeneratorInfoProvider extends Component {
    constructor(){
        super()
        this.state = {
            genInfo: {}
        }
    }
    getGeneralInfo = callback => {
        axios.get("/generalInfo")
            .then(res => this.setState({genInfo: res.data[0]}, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    createGeneralInfo = () => {
        dataAxios.post('/api/owner/generalInfo')
            .then(res => this.setState({genInfo: res.data}))
            .catch(err => console.log(err.response.data.errMsg))
    } 
    updateGeneralInfo = (_id, updates) => {
        dataAxios.put(`/api/owner/generalInfo/${_id}`, updates)
            .then(res => this.setState({genInfo: res.data}))
            .catch(err => console.log(err.response.data.errMsg))
    }
    postPDF = (data, callback) => {
        dataAxios.post(`/api/owner/generalInfo/upload/${this.state.genInfo._id}`, data)
            .then(res => this.setState({genInfo: res.data}, () => {
                this.downloadPDF(callback)
            }))
            .catch(err => console.log(err.response.data.errMsg))
        
    }
    updatePDF = (data, callback) => {
        dataAxios.put(`/api/owner/generalInfo/upload/${this.state.genInfo._id}/${this.state.genInfo.liabilityWavierId}`, data)
            .then(res => this.setState({genInfo: res.data}, () => {
                this.downloadPDF(callback)
            }))
            .catch(err => console.log(err.response.data.errMsg))
    }
    downloadPDF = callback => {
        axios.get(`/generalInfo/download/${this.state.genInfo.liabilityWavierId}`)
            .then(res => { callback(res.data) })
            .catch(err => console.log(err.response.data.errMsg))
    }
    render(){
        return(
            <GeneralInfoContext.Provider
                value={{
                    ...this.state,
                    getGeneralInfo: this.getGeneralInfo,
                    createGeneralInfo: this.createGeneralInfo,
                    updateGeneralInfo: this.updateGeneralInfo,
                    postPDF: this.postPDF,
                    updatePDF: this.updatePDF,
                    downloadPDF: this.downloadPDF
                }}>
                {this.props.children}
            </GeneralInfoContext.Provider>
        )
    }
}

export default GeneratorInfoProvider;

export const withGeneral = C => props => (
    <GeneralInfoContext.Consumer>
        {value => <C {...value} {...props}/>}
    </GeneralInfoContext.Consumer>
)