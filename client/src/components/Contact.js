import React, { Component } from "react"
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import { withEmail } from '../context/EmailProvider.js'
import { withGeneral } from '../context/GeneralInfoProvider.js'

class Contact extends Component {
    constructor(){
        super()
        this.state = { 
            from: '',
            subject: '',
            message: ''
        }
    }
    handleChange = e => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        const name = e.target.name
        this.setState({ [name]: value})
    }
    handleSubmit = e => {
        e.preventDefault()
        const { from, subject, message } = this.state
        this.props.sendEmail(from, subject, message, (message) => {
            this.setState({
                from: '',
                subject: '',
                message: ''
            })
            toast(message, {
                type: toast.TYPE.SUCCESS,
                transition: Slide
            })
        })
    }

    render(){
        const { from, subject, message } = this.state
        return(
            <div>
                <ToastContainer autoClose={10000} />
                {/* frequently asked questions */}
                {/* if faqs === 0 ? no show */}
                <h2>FAQs</h2>
                

                <h2>Contact Us:</h2>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="from" value={from} onChange={this.handleChange} require="true" placeholder="Your Email"/>
                    <input type="text" name="subject" value={subject} onChange={this.handleChange} require="true" placeholder="Subject"/>
                    <textarea name="message" value={message} onChange={this.handleChange} rows="4" cols="50" require="true" placeholder="Message" />
                    <button>Send Message</button>
                </form>
            </div>
        )
    }
}

export default withGeneral(withEmail(Contact));