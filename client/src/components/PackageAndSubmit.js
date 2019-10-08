import React, { Component } from "react"
import Countdown from "react-countdown-now"
import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'
import { toast } from 'react-toastify'

import { withAppointment } from "../context/AppointmentProvider.js"
import { withUser } from "../context/UserProvider.js"

import Appointment from "./Appointment.js";

class PackageAndSubmit extends Component {
    constructor(){
        super()
        this.state = {
            dataIn: false,
            apiKey: "pk_test_Ey7aoXR5LLcmV14JOonguHik00jlEq8OT3",
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
    handleChange = e => {
        const value = parseInt(e.target.value)
        this.setState({ [e.target.name] : value })
    }
    handleSubmit = (token) => {
        const { amount, amounts } = this.state
        const { appLengthInMinutes } = this.props.currentAppointmentInProgress
        const index = amounts.findIndex((num) => num === amount)
        let message = "-Minute Massage"
        let pChoice = 1
        if (index === 1){
            message+= " Package of 3"
            pChoice++
        }
        axios.post('/payment/charge', { 
            token, 
            product: { 
                name: `${appLengthInMinutes}${message}`, 
                price: amount 
            } 
        })
        .then(res => {
            console.log(res.data)
            if (res.data === "succeeded"){
                console.log("Win")
                // handle success



            } else {
                console.log('Loose')
                // handle failure



            }
        })
        .catch(err => console.log(err.response.data.errMsg))
        //// Update
        // package choice 1, or 2
        // console.log(pChoice)
        // amount 
        // console.log(amount)
        // status
        // send email and creat appointment in gmail in backend

    }
    handlePrepaid = () => {
        console.log("Clicked")

        //// Update
        // package choice 0
        // amount 
        // status
        // send email and creat appointment in gmail

    }
    componentDidMount(){
        const { currentAppointmentInProgress } = this.props
        if (currentAppointmentInProgress === ""){ this.props.history.push("/book")} 
        else { 
            const length = currentAppointmentInProgress.appLengthInMinutes
            const amounts = []
            if (length === 60){
                amounts.push(9999, 19998)
            } else if (length === 90) {
                amounts.push(14998, 29997)
            } else if (length === 120) {
                amounts.push(19997, 39996)
            }
            this.props.checkVisitsRemaining(
                currentAppointmentInProgress.clientID, 
                currentAppointmentInProgress.appLengthInMinutes, 
                (visitsRemaining) => {
                if (visitsRemaining !== 0){
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


        // sign wavier required
        // 
        // create owner link for purchase details
        // includes prices and wavier doc.
        //
        // finish purchase with update appointment details 
        // 











    }
    render(){
        const { dataIn, apiKey, amount, amounts, except } = this.state
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
                {dataIn ?
                <>
                    <Appointment appointment={this.props.currentAppointmentInProgress}/>
                    <h2>Choose a package:</h2>
                    <select name="amount" value={amount} onChange={this.handleChange}>
                        {except ? 
                        <option value={0}>Pre-Paid {appLengthInMinutes}-Minute Massage</option>
                        :null}
                        {mappedAmounts}
                    </select>
                    {amount !== 0 ?
                    <StripeCheckout 
                        name="Euphoric Massage"
                        stripeKey={apiKey}
                        token={this.handleSubmit}
                        amount={amount}
                        email={clientEmail}
                    />
                    :
                    <button onClick={this.handlePrepaid}>Use Pre-Paid Visit</button>
                    }
                </>
                :null}
            </div>
        )
    }
}

export default withUser(withAppointment(PackageAndSubmit));