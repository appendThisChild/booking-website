import React, { Component } from "react"
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import { withEmail } from '../context/EmailProvider.js'
import { withGeneral } from '../context/GeneralInfoProvider.js'

import FAQsDisplay from './FAQsDisplay.js'

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
        const { FAQs } = this.props.genInfo
        const mappedFAQs = FAQs.map((obj, i) => <FAQsDisplay key={i} faq={obj} />)
        return(
            <div className="background">
                <div className="border">
                    <ToastContainer autoClose={10000} />
                    <div className="contact">
                        <div>
                            <h2>FAQs</h2>
                            {mappedFAQs}
                        </div>
                    </div>
                    <div className="contact">
                        <form onSubmit={this.handleSubmit}>
                            <h2>Contact Us:</h2>
                            <p>Email:</p>
                            <input type="email" name="from" value={from} onChange={this.handleChange} required={true} placeholder="Your Email..."/>
                            <p>Subject:</p>
                            <input type="text" name="subject" value={subject} onChange={this.handleChange} required={true} placeholder="Subject..."/>
                            <p>Message:</p>
                            <textarea name="message" value={message} onChange={this.handleChange} rows="4" cols="50" required={true} placeholder="Message..." />
                            <button>Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withGeneral(withEmail(Contact));