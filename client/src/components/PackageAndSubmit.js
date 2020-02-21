import React, { Component } from "react"

import Secure from "../images/secure-stripe-payment-logo1.png"

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
        const { genInfo } = this.props
        const { appLengthInMinutes, _id, clientID, inStudio } = this.props.currentAppointmentInProgress
        const index = amounts.findIndex((num) => num === amount)
        let message = "-Minute Massage"
        let pChoice = 1
        if (index === 1){
            message+= " Package of 3"
            pChoice++
        }
        let length = 0
        if (appLengthInMinutes === 75){
            length = 1
        } else if (appLengthInMinutes === 90){
            length = 2
        }
        axios.post('/payment/charge', { 
            token, 
            isInStudio: inStudio,
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
                    amount: inStudio ? amount : amount + genInfo.onSitePricing,
                    status: "Paid",
                    chargeId: res.data.id,
                    amountTherapistPaid: pChoice === 1 ? amount : amount / 3,
                    travelFee: inStudio ? 0 : genInfo.onSitePricing
                }
                toast.update(display, {
                    render: "Payment Completed! Please wait...",
                    type: toast.TYPE.SUCCESS,
                    transition: Flip
                })
                this.props.updateAppointment(_id, updates, () => {
                    if (pChoice === 2){
                        let visitsIndex = 0
                        if (appLengthInMinutes === 75){
                            visitsIndex = 1
                        } else if (appLengthInMinutes === 90){
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
    handleTravelFee = (token) => {
        const display = toast("Receiving Payment, please wait...", {
            transition: Slide
        })
        const { amounts } = this.state
        const { genInfo, currentAppointmentInProgress } = this.props
        const { _id, appLengthInMinutes, clientID } = currentAppointmentInProgress
        axios.post('/payment/travelFee', {
            token,
            product : {
                name: "Travel Fee"
            }
        })
        .then(res => {
            if (res.data.status === "succeeded"){
                toast.update(display, {
                    render: "Payment Completed! Please wait...",
                    type: toast.TYPE.SUCCESS,
                    transition: Flip
                })
                const updates = {
                    packageChoice: 0,
                    amount: genInfo.onSitePricing,
                    status: "Paid",
                    chargeId: res.data.id,
                    amountTherapistPaid: amounts[1] / 3,
                    travelFee: genInfo.onSitePricing
                }
                this.props.updateAppointment( _id, updates, () => {
                    let visitsIndex = 0
                    if (appLengthInMinutes === 75){
                        visitsIndex = 1
                    } else if (appLengthInMinutes === 90){
                        visitsIndex = 2
                    }
                    this.props.updateVisits(clientID, { index: visitsIndex, adjust: -1 }, () => {
                        this.props.postEvent(this.props.currentAppointmentInProgress, (message) => {
                            this.props.history.push('/appointmentBooked')
                        })
                    })
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
            if (appLengthInMinutes === 75){
                visitsIndex = 1
            } else if (appLengthInMinutes === 90){
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
        window.scroll(0,0);
        const { currentAppointmentInProgress, genInfo } = this.props
        if (currentAppointmentInProgress.status === "Pending") {
            const length = currentAppointmentInProgress.appLengthInMinutes
            let amounts = []
            if (length === 60){
                amounts = genInfo.pricing[0]
            } else if (length === 75) {
                amounts = genInfo.pricing[1]
            } else if (length === 90) {
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
        } else { 
           this.props.history.push("/book")
        }
    }
    render(){
        const { dataIn, liabilityCheck, checkBoxMessage, amount, amounts, except } = this.state
        const { apiKey, genInfo } = this.props
        const { clientEmail, appointmentCreatedAt, inStudio } = this.props.currentAppointmentInProgress
        const date = new Date(appointmentCreatedAt).getTime()
        const mappedAmounts = amounts.map((amount, i) => {
            let description = "Single Massage"
            if (i === 1) description = "Package of Three"
            return <option key={i} value={amount}>{description} ${amount / 100}</option>
        })
        return(
            <>
                <ToastContainer autoClose={10000} />
                <div className="packageAndSubmit">
                    
                    {dataIn ?
                    <>  
                        <Appointment appointment={this.props.currentAppointmentInProgress} showAddress={this.props.currentAppointmentInProgress.inStudio ? false : true} showTherapistInfo={false}/>
                        <main className="selectPackage">
                            <Countdown date={date + 600000} renderer={this.tenMinuteTimer}/>
                            <h1>Select a package</h1>
                            <select name="amount" value={amount} onChange={this.handleChange}>
                                {except ? 
                                <option value={0}>Pre-Paid Massage</option>
                                :null}
                                {mappedAmounts}
                            </select>
                            {amount !== 0 ?
                            <div>
                                {!inStudio && genInfo.onSitePricing ?
                                    <span>${genInfo.onSitePricing / 100} Travel Fee will be added to this transaction.</span>
                                :null}
                                {liabilityCheck ? 
                                <>
                                    {checkBoxMessage ? <p>{checkBoxMessage}</p> : null}
                                    <StripeCheckout 
                                        name="Blissed Out Body Works"
                                        stripeKey={apiKey}
                                        token={this.handleSubmit}
                                        amount={inStudio ? amount : amount + genInfo.onSitePricing}
                                        email={clientEmail}
                                        ComponentClass="div"
                                    >
                                    <button>Pay With Card</button>
                                    </StripeCheckout>
                                </>
                                :
                                <>
                                    {checkBoxMessage ? <p>{checkBoxMessage}</p> : null}
                                    <div>
                                        <button onClick={this.checkBox}>Pay With Card</button>
                                    </div>
                                </>
                                }
                            </div>
                            :
                            <>
                            {!inStudio ?
                            <div>
                                {genInfo.onSitePricing ?
                                    <span>${genInfo.onSitePricing / 100} Travel Fee will be added to this transaction.</span>
                                :null}
                                {liabilityCheck ? 
                                <>
                                    {checkBoxMessage ? <p>{checkBoxMessage}</p> : null}
                                    {genInfo.onSitePricing ?
                                    <StripeCheckout 
                                        name="Blissed Out Body Works"
                                        stripeKey={apiKey}
                                        token={this.handleTravelFee}
                                        amount={genInfo.onSitePricing}
                                        email={clientEmail}
                                        ComponentClass="div"
                                    >
                                    <button>Pay With Card</button>
                                    </StripeCheckout>
                                    :
                                    <div>
                                        <button onClick={this.handlePrepaid}>Use Pre-Paid</button>
                                    </div>
                                    }
                                </>
                                :
                                <>
                                    {checkBoxMessage ? <p>{checkBoxMessage}</p> : null}
                                    {genInfo.onSitePricing ?
                                    <div>
                                        <button onClick={this.checkBox}>Pay With Card</button>
                                    </div>
                                    :
                                    <div>
                                        <button onClick={this.checkBox}>Use Pre-Paid</button>
                                    </div>
                                    }
                                </>
                                }
                            </div>
                            :
                            <div>
                                {checkBoxMessage ? <p>{checkBoxMessage}</p> : null}
                                <div>
                                    <button onClick={!liabilityCheck ? this.checkBox : this.handlePrepaid}>Use Pre-Paid</button>
                                </div>
                            </div>
                            }
                            </>
                            }
                            <aside>
                                <span><input type="checkbox" name="liabilityCheck" onChange={this.handleCheck}/> Read Liability Wavier.</span>
                            </aside>
                            <aside>
                                <span><a href={`data:application/pdf;base64,${this.state.dataPDF}`} download="Massage-Therapy-Wavier.pdf">Click Here</a> to download Liability Wavier.</span>
                            </aside>
                            <img src={Secure} alt="Stripe Secured Checkout"/>
                        </main>
                    </>
                    :null}
                </div>
                <CancelationPolicyDisplay />
            </>
        )
    }
}

export default withGeneral(withGoogle(withUser(withAppointment(PackageAndSubmit))));