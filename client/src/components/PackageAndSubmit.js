import React, { Component } from "react"
import Countdown from "react-countdown-now"
import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'
import { ToastContainer, toast, Slide, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import { withAppointment } from "../context/AppointmentProvider.js"
import { withUser } from "../context/UserProvider.js"
import { withGoogle } from "../context/GoogleCalendarProvider.js"
import { withGeneral } from '../context/GeneralInfoProvider.js'

import Appointment from "./Appointment.js";
import CancelationPolicyDisplay from "./CancelationPolicyDisplay.js"

class PackageAndSubmit extends Component {
    constructor(){
        super()
        this.state = {
            dataIn: false,
            dataPDF: '',
            checkBoxMessage: '',
            liabilityCheck: false,
            amount: 0,
            amounts: [],
            except: false
        }
    }
    tenMinuteTimer = ({ hours, minutes, seconds, completed }) => {
        if (completed){
            this.props.history.push("/book")
            return null
        } else {
            let min = String(minutes)
            let sec = String(seconds)
            if (min.length === 1) min = "0" + minutes;
            if (sec.length === 1) sec = "0" + seconds;
            return <p>Time remaing: {min}:{sec}</p>;
        }
    }
    handleCheck = e => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        const name = e.target.name
        this.setState({ [name]: value})
    }
    checkBox = () => {
        this.setState({ checkBoxMessage: '"Wavier check required"' })
    }
    handleChange = e => {
        const value = parseInt(e.target.value)
        this.setState({ [e.target.name] : value })
    }
    handleSubmit = (token) => {
        const display = toast("Receiving Payment, please wait...", {
            transition: Slide
        })
        const { amount, amounts } = this.state
        const { appLengthInMinutes, _id, clientID } = this.props.currentAppointmentInProgress
        const index = amounts.findIndex((num) => num === amount)
        let message = "-Minute Massage"
        let pChoice = 1
        if (index === 1){
            message+= " Package of 3"
            pChoice++
        }
        let length = 0
        if (appLengthInMinutes === 90){
            length = 1
        } else if (appLengthInMinutes === 120){
            length = 2
        }
        axios.post('/payment/charge', { 
            token, 
            product: { 
                name: `${appLengthInMinutes}${message}`, 
                price: {
                    choice: pChoice - 1,
                    length: length
                }
            } 
        })
        .then(res => {
            if (res.data === "succeeded"){
                const updates = {
                    packageChoice: pChoice,
                    amount: amount,
                    status: "Paid"
                }
                toast.update(display, {
                    render: "Payment Completed! Please wait...",
                    type: toast.TYPE.SUCCESS,
                    transition: Flip
                })
                this.props.updateAppointment(_id, updates, () => {
                    if (pChoice === 2){
                        let visitsIndex = 0
                        if (appLengthInMinutes === 90){
                            visitsIndex = 1
                        } else if (appLengthInMinutes === 120){
                            visitsIndex = 2
                        }
                        this.props.updateVisits(clientID, { index: visitsIndex, adjust: 2 }, () => {
                            this.props.postEvent(this.props.currentAppointmentInProgress, (message) => {
                                this.props.history.push('/appointmentBooked')
                            })
                        })
                    } else {
                        this.props.postEvent(this.props.currentAppointmentInProgress, (message) => {
                            this.props.history.push('/appointmentBooked')
                        })
                    }
                })
            } else {
                toast.update(display, {
                    render: `Payment Failed: ${res.data}`,
                    type: toast.TYPE.ERROR,
                    transition: Flip
                })
            }
        })
        .catch(err => console.log(err.response.data.errMsg))
    }
    handlePrepaid = () => {
        toast.success("Completing Appointment! Please wait...", {
            transition: Slide
        })
        const { amount } = this.state
        const { _id, appLengthInMinutes, clientID } = this.props.currentAppointmentInProgress
        const updates = {
            packageChoice: 0,
            amount: amount,
            status: "Paid"
        }
        this.props.updateAppointment(_id, updates, () => {
            let visitsIndex = 0
            if (appLengthInMinutes === 90){
                visitsIndex = 1
            } else if (appLengthInMinutes === 120){
                visitsIndex = 2
            }
            this.props.updateVisits(clientID, { index: visitsIndex, adjust: -1 }, () => {
                this.props.postEvent(this.props.currentAppointmentInProgress, (message) => {
                    this.props.history.push('/appointmentBooked')
                })
            })
        })
    }
    componentDidMount(){
        const { currentAppointmentInProgress, genInfo } = this.props
        if (currentAppointmentInProgress === ""){ this.props.history.push("/book")} 
        else { 
            const length = currentAppointmentInProgress.appLengthInMinutes
            let amounts = []
            if (length === 60){
                amounts = genInfo.pricing[0]
            } else if (length === 90) {
                amounts = genInfo.pricing[1]
            } else if (length === 120) {
                amounts = genInfo.pricing[2]
            }
            this.props.downloadPDF((pdf) => {
                this.setState({ dataPDF: pdf })
            })
            this.props.checkVisitsRemaining(
                currentAppointmentInProgress.clientID, 
                currentAppointmentInProgress.appLengthInMinutes, 
                (visitsRemaining) => {
                if (visitsRemaining > 0){
                    this.setState({
                        dataIn: true,
                        amount: 0,
                        amounts: amounts,
                        except: true
                    })
                } else {
                    this.setState({
                        dataIn: true,
                        amount: amounts[0],
                        amounts: amounts
                    }) 
                }
            })
        }
    }
    render(){
        const { dataIn, liabilityCheck, checkBoxMessage, amount, amounts, except } = this.state
        const { apiKey } = this.props
        const { clientEmail, appLengthInMinutes, appointmentCreatedAt } = this.props.currentAppointmentInProgress
        const date = new Date(appointmentCreatedAt).getTime()
        const mappedAmounts = amounts.map((amount, i) => {
            let description = "Single"
            let s = ""
            if (i === 1){
                description = "Three"
                s = "s"
            }
            return <option key={i} value={amount}>${amount / 100} "{description} {appLengthInMinutes}-Minute Massage{s}"</option>
        })
        return(
            <div>
                <Countdown date={date + 600000} renderer={this.tenMinuteTimer}/>
                <ToastContainer autoClose={10000} />
                {dataIn ?
                <>
                    <Appointment appointment={this.props.currentAppointmentInProgress} showAddress={false}/>
                    <h2>Choose a package:</h2>
                    <select name="amount" value={amount} onChange={this.handleChange}>
                        {except ? 
                        <option value={0}>Pre-Paid {appLengthInMinutes}-Minute Massage</option>
                        :null}
                        {mappedAmounts}
                    </select>
                    <div>
                        <div>
                            <span>Read 'Liability Wavier' and check box: </span>
                            <input type="checkbox" name="liabilityCheck" onChange={this.handleCheck}/>
                            
                        </div>
                        <div>
                            <a href={`data:application/pdf;base64,${this.state.dataPDF}`} download="Massage-Therapy-Wavier.pdf">Click Here</a>
                            <span> to download Liability Wavier</span>
                        </div>
                    </div>
                    {amount !== 0 ?
                    <>
                        {liabilityCheck ? 
                        <StripeCheckout 
                            name="Euphoric Massage"
                            stripeKey={apiKey}
                            token={this.handleSubmit}
                            amount={amount}
                            email={clientEmail}
                        />
                        :
                        <button onClick={this.checkBox}>Pay With Card</button>
                        }
                    </>
                    :
                    <button onClick={!liabilityCheck ? this.checkBox : this.handlePrepaid}>Use Pre-Paid Visit</button>
                    }
                    <p>{checkBoxMessage}</p>
                </>
                :null}
                <CancelationPolicyDisplay />
            </div>
        )
    }
}

export default withGeneral(withGoogle(withUser(withAppointment(PackageAndSubmit))));