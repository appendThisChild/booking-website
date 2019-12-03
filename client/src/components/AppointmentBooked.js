import React, { Component } from "react"

import { withAppointment } from "../context/AppointmentProvider.js"
import { withUser } from "../context/UserProvider.js"

import Appointment from "./Appointment.js";
import IntakeForm from "./IntakeForm.js"
import CheckingAffiliate from "./CheckingAffiliate.js"

class AppointmentBooked extends Component {
    constructor(props){
        super(props)
        this.state = {
            dataIn: false,
            formDone: false,
            numberDidChange: false,
            clientPhoneNumber: props.currentAppointmentInProgress.clientPhoneNumber,
            head: [false, false],
            neck: [false, false],
            shoulders: [false, false],
            chest: [false, false],
            abs: [false, false],
            upperBack: [false, false],
            middleBack: [false, false],
            lowerBack: [false, false],
            glute: [false, false],
            thigh: [false, false],
            calf: [false, false],
            comments: ''
        }
    }
    handleChange = e => {
        const name = e.target.name
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        const nameArr = name.split(" ")
        if (nameArr.length > 1){
            const newArr = this.state[nameArr[0]].map((arrValue, i) => {
                if (i === Number(nameArr[1])){
                    return value
                } else { return arrValue }
            })
            this.setState({ [nameArr[0]]: newArr })
        } else {
            this.setState({ [nameArr[0]]: value })
        }
    }
    handleSubmit = e => {
        e.preventDefault()
        const { clientPhoneNumber, head, neck, shoulders, chest, abs, upperBack, middleBack, lowerBack, glute, thigh, calf, comments, numberDidChange } = this.state
        const data = {
            clientPhoneNumber: this.props.numberDeconstruct(clientPhoneNumber),
            intake: {
                body: {
                    head,
                    neck,
                    shoulders,
                    chest,
                    abs,
                    upperBack,
                    middleBack,
                    lowerBack,
                    glute,
                    thigh,
                    calf
                },
                comments
            },
            numberDidChange
        }
        this.props.updateIntake(this.props.currentAppointmentInProgress._id, data, () => {
            this.setState({ formDone: true })
        })
    }
    handleNumberDidChange = () => {
        this.setState({ numberDidChange: true })
    }
    componentDidMount(){
        const { currentAppointmentInProgress } = this.props
        if (currentAppointmentInProgress.status === "Paid") {
            this.props.appointmentSubmitted()
            this.props.eraseKey()
            this.setState({dataIn: true})
            window.scrollTo(0, 0);
        } else {
            this.props.history.push("/book")
        }
    }
    render(){
        const { dataIn, formDone } = this.state
        return(
            <div className="background">
                <div className="border">
                {dataIn ?
                <>  
                    <div className="appointmentBookedCentered">
                        <div className="appointmentBookedContainers">
                            <div>
                                <h1>{formDone ? "Form submitted!" : "Appointment booked!"}</h1>
                            </div>
                        </div>
                        <div className={`appointmentBookedContainers ${formDone ? "intakeFormDone" : ""}`}>
                            <div className="bookedInside2">
                                <Appointment appointment={this.props.currentAppointmentInProgress} showAddress={true}/>
                            </div>
                        </div>
                    </div>
                    {!formDone ?
                    <div className="appointmentBookedContainers">
                        <IntakeForm 
                            handleChange={this.handleChange}
                            handleSubmit={this.handleSubmit}
                            handleNumberDidChange={this.handleNumberDidChange}
                            {...this.state}
                        />
                    </div>
                    :null}
                    <CheckingAffiliate appointment={this.props.currentAppointmentInProgress} />
                </>
                :null}
                </div>
            </div>
        )
    }
}

export default withUser(withAppointment(AppointmentBooked));