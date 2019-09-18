import React, { Component } from "react"

import { withAppointment } from "../context/AppointmentProvider.js"

class PackageAndSubmit extends Component {
    constructor(){
        super()
        this.state = {

        }
    }
    componentDidMount(){
        if (this.props.currentAppointmentInProgress === "") this.props.history.push("/book")
        // create a ten minute timer
        // this is where we ask for selecting of package & payment
        // shows selection details 
        // sign wavier required
        // send update to amount, package choice, and status

    }
    render(){
        console.log(this.props.currentAppointmentInProgress)
        return(
            <div>
                Pick a Package and Sumbit Payment
            </div>
        )
    }
}

export default withAppointment(PackageAndSubmit);