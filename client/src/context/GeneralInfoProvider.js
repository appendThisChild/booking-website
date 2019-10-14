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
    render(){
        return(
            <GeneralInfoContext.Provider
                value={{
                    ...this.state,
                    getGeneralInfo: this.getGeneralInfo,
                    createGeneralInfo: this.createGeneralInfo,
                    updateGeneralInfo: this.updateGeneralInfo
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