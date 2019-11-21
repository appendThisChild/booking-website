import React, { Component } from 'react'
import axios from 'axios';

import { withReview } from "./ReviewProvider.js"

const GeneralInfoContext = React.createContext()

const dataAxios = axios.create()

dataAxios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token")
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
        const noInfo = {
            _id: "none",
            homeTitle: "Our Mission",
            homeInfo: ["nothing"],
            homeTherapistSubtitle: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur in doloremque ipsum ipsa cum dignissimos aperiam voluptas, modi aut excepturi ducimus magnam reiciendis eos vitae quos praesentium enim sit corporis.",
            pricing: [
                    [9999, 19998],
                    [14998, 29997],
                    [19997, 39996]
                ],
            cancelationPolicy: ["nothing"],
            liabilityWavierId: 'none',
            FAQs: [
                {
                    question: "",
                    answer: ""
                }
            ]
        }
        axios.get("/generalInfo")
            .then(res => this.setState({genInfo: res.data[0] || noInfo}, () => {
                this.props.getReviews(callback)
            }))
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
    connectWithStripe = (authCode, callback) => {
        dataAxios.post('/api/owner/generalInfo/payment/auth', authCode)
            .then(res => { callback("Success, Refresh Page!") })
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
                    downloadPDF: this.downloadPDF,
                    connectWithStripe: this.connectWithStripe
                }}>
                {this.props.children}
            </GeneralInfoContext.Provider>
        )
    }
}

export default withReview(GeneratorInfoProvider);

export const withGeneral = C => props => (
    <GeneralInfoContext.Consumer>
        {value => <C {...value} {...props}/>}
    </GeneralInfoContext.Consumer>
)