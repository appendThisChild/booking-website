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
            if (res.data.status === "succeeded"){
                const updates = {
                    packageChoice: pChoice,
                    amount: amount,
                    status: "Paid",
                    chargeId: res.data.id,
                    amountTherapistPaid: pChoice === 1 ? amount : amount / 3
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
        const { amount, amounts } = this.state
        const { _id, appLengthInMinutes, clientID } = this.props.currentAppointmentInProgress
        const updates = {
            packageChoice: 0,
            amount: amount,
            status: "Paid",
            amountTherapistPaid: amounts[1] / 3
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
        if (currentAppointmentInProgress.status === "Pending") {
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
            window.scrollTo(0, 0);
        } else { 
           this.props.history.push("/book")
        }
    }
    render(){
        const { dataIn, liabilityCheck, checkBoxMessage, amount, amounts, except } = this.state
        const { apiKey } = this.props
        const { clientEmail, appointmentCreatedAt } = this.props.currentAppointmentInProgress
        const date = new Date(appointmentCreatedAt).getTime()
        const mappedAmounts = amounts.map((amount, i) => {
            let description = "Single Massage"
            if (i === 1) description = "Package of Three"
            return <option key={i} value={amount}>{description} ${amount / 100}</option>
        })
        return(
            <div className="background">
                <div className="border">
                    <ToastContainer autoClose={10000} />
                    {dataIn ?
                    <>  
                        <div className="pAndSInside">
                            <div className="inside1">
                                <Countdown date={date + 600000} renderer={this.tenMinuteTimer}/>
                                <Appointment appointment={this.props.currentAppointmentInProgress} showAddress={false}/>
                            </div>
                        </div>
                        <div className="pAndSInside1">
                            <div className="inside2">
                                <h2>Select a package:</h2>
                                <div>
                                    <select name="amount" value={amount} onChange={this.handleChange}>
                                        {except ? 
                                        <option value={0}>Pre-Paid Massage</option>
                                        :null}
                                        {mappedAmounts}
                                    </select>
                                </div>
                                {amount !== 0 ?
                                <div>
                                    {liabilityCheck ? 
                                    <>
                                        <StripeCheckout 
                                            name="Blissed Out Body Works"
                                            stripeKey={apiKey}
                                            token={this.handleSubmit}
                                            amount={amount}
                                            email={clientEmail}
                                            ComponentClass="div"
                                        >
                                        <button>Pay With Card</button>
                                        </StripeCheckout>
                                        <p>{checkBoxMessage}</p>
                                    </>
                                    :
                                    <>
                                        <button onClick={this.checkBox}>Pay With Card</button>
                                        <p>{checkBoxMessage}</p>
                                    </>
                                    }
                                </div>
                                :
                                <div>
                                    <button onClick={!liabilityCheck ? this.checkBox : this.handlePrepaid}>Use Pre-Paid</button>
                                    <p>{checkBoxMessage}</p>
                                </div>
                                }
                                <div>
                                    <input type="checkbox" name="liabilityCheck" onChange={this.handleCheck}/>
                                    <span>Read Liability Wavier.</span>
                                </div>
                                <div>
                                    <a href={`data:application/pdf;base64,${this.state.dataPDF}`} download="Massage-Therapy-Wavier.pdf">Click Here</a>
                                    <span> to download Liability Wavier.</span>
                                </div>
                                
                            </div>
                        </div>
                    </>
                    :null}
                    <CancelationPolicyDisplay />
                </div>
            </div>
        )
    }
}

export default withGeneral(withGoogle(withUser(withAppointment(PackageAndSubmit))));