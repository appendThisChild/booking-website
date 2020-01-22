import React, { Component } from "react"
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import Picture from "../images/shutterstock_99093647.jpg"

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
            <div className="contactContainer">
                <ToastContainer autoClose={10000} />
                <div className="contact">
                    <img src={Picture} alt="Hot Stones"/>
                    <section>
                        <form onSubmit={this.handleSubmit}>
                            <h1>Contact Us</h1>
                            <div>
                                <input type="email" name="from" value={from} onChange={this.handleChange} required={true} placeholder="Your Email..."/>
                                <input type="text" name="subject" value={subject} onChange={this.handleChange} required={true} placeholder="Subject..."/>
                                <textarea name="message" value={message} onChange={this.handleChange} rows="4" cols="50" required={true} placeholder="Message..." />
                                <button>Send Message</button>
                            </div>
                        </form>
                        <aside>
                            <h1>FAQs</h1>
                            <h2>(Frequently Asked Questions)</h2>
                            {mappedFAQs}
                        </aside>
                    </section>
                </div>
            </div>
        )
    }
}

export default withGeneral(withEmail(Contact));