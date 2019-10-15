import React, { Component } from 'react'

import ProfileNav from './ProfileNav.js';
import GeneralInfoDisplay from './GeneralInfoDisplay.js'
import GeneralInfoForm from './GeneralInfoForm.js'

import { withGeneral } from '../context/GeneralInfoProvider.js'
import { withToggler } from "./Toggler.js"

class CiteInfo extends Component {
    constructor(props){
        super(props)
        this.state = {
            homeTitle: props.genInfo.homeTitle, 
            homeInfo: props.genInfo.homeInfo, 
            homeTherapistSubtitle: props.genInfo.homeTherapistSubtitle, 
            pricing: props.genInfo.pricing, 
            cancelationPolicy: props.genInfo.cancelationPolicy,
            dataPDF: ''
        }
    }
    handleChange = e => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        const name = e.target.name
        const nameArr = name.split(" ")
        if (nameArr.length > 1){
            const newArr = this.state[nameArr[0]].map((element, i) => {
                if (i === Number(nameArr[1])){
                    if (nameArr[2]){
                        return element.map((price, j) => {
                            if (j === Number(nameArr[2])){ return Number(value) }
                            else { return price }
                        })
                    } else { return value }
                } else { return element }
            })
            this.setState({ [nameArr[0]]: newArr })
        } else {
            this.setState({ [name]: value })
        }
    }
    handleSubmit = e => {
        e.preventDefault()
        const { homeTitle, homeInfo, homeTherapistSubtitle, pricing, cancelationPolicy } = this.state
        const newGenInfo = {
            homeTitle: homeTitle, 
            homeInfo: homeInfo, 
            homeTherapistSubtitle: homeTherapistSubtitle, 
            pricing: pricing,
            cancelationPolicy: cancelationPolicy
        }
        this.props.updateGeneralInfo(this.props.genInfo._id, newGenInfo)
        this.props.toggle()
    }
    removeLine = nameIndex => {
        const nameArr = nameIndex.split(" ")
        const newArr = this.state[nameArr[0]]
        newArr.splice(Number(nameArr[1]), 1)
        this.setState({ [nameArr[0]]: newArr })
    }
    addLine = name => {
        this.setState(prevState => ({ [name]: [...prevState[name], "new text..."] }))
    }
    handleUpload = e => {
        const data = new FormData()
        data.append('pdf', e.target.files[0])
        this.props.postPDF(data, (pdf) => {
            this.setState({dataPDF: pdf})
        })
    }
    handleReplace = e => {
        const data = new FormData()
        data.append('pdf', e.target.files[0])
        this.props.updatePDF(data, (pdf) => {
            this.setState({dataPDF: pdf})
        })
    }
    componentDidMount(){
        // downloads pdf
        if (this.props.genInfo.liabilityWavierId !== "none"){
            this.props.downloadPDF((pdf) => {
                this.setState({dataPDF: pdf})
            })
        }
    }
    render(){
        const { genInfo, createGeneralInfo, on, toggle } = this.props
        return(
            <div>
                <ProfileNav />
                {genInfo ? 
                <>
                    {on ?
                    <>
                        <button onClick={toggle}>Edit Cite Info</button>
                        <GeneralInfoDisplay 
                            handleUpload={this.handleUpload}
                            handleReplace={this.handleReplace}
                            pdf={this.state.dataPDF}
                            {...genInfo}
                        />
                    </>
                    :
                    <>
                        <button onClick={toggle}>Cancel Edit</button>
                        <GeneralInfoForm 
                            {...this.state}
                            handleChange={this.handleChange}
                            handleSubmit={this.handleSubmit}
                            removeLine={this.removeLine}
                            addLine={this.addLine}
                        />
                    </>
                    }
                </>
                :
                <>
                    <button onClick={createGeneralInfo}>Create General Info</button>
                </>
                }
            </div>
        )
    }
}

export default withToggler(withGeneral(CiteInfo));