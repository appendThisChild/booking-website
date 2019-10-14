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
            dataIn: false
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
        // send info to update



        this.props.toggle()
        console.log(newGenInfo)
    }
    componentDidMount(){
        this.props.getGeneralInfo(() => {
            const { homeTitle, homeInfo, homeTherapistSubtitle, pricing, cancelationPolicy } = this.props.genInfo
            this.setState({
                homeTitle: homeTitle, 
                homeInfo: homeInfo, 
                homeTherapistSubtitle: homeTherapistSubtitle, 
                pricing: pricing, 
                cancelationPolicy: cancelationPolicy,
                dataIn: true
            })
        })
    }
    render(){
        // updateGeneralInfo
        const { genInfo, createGeneralInfo, on, toggle } = this.props
        const { dataIn } = this.state
        return(
            <div>
                <ProfileNav />
                {dataIn ?
                <>
                    {genInfo ? 
                    <>
                        {on ?
                        <>
                            <button onClick={toggle}>Edit Cite Info</button>
                            <GeneralInfoDisplay {...genInfo}/>
                        </>
                        :
                        <>
                            <button onClick={toggle}>Cancel Edit</button>
                            <GeneralInfoForm 
                                {...this.state}
                                handleChange={this.handleChange}
                                handleSubmit={this.handleSubmit}

                            />
                        </>
                        }
                    </>
                    :
                    <>
                        <button onClick={createGeneralInfo}>Create General Info</button>
                    </>
                    }
                </>
                :null}
            </div>
        )
    }
}

export default withToggler(withGeneral(CiteInfo));