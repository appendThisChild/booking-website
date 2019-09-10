import React, { Component } from "react"
import { withUser } from "../context/UserProvider.js"
import { withAppointment } from "../context/AppointmentProvider.js"


class Book extends Component {
    constructor(){
        super()
        this.state = {

        }
    }
    handlePickTime = e => {
        e.preventDefault()

        this.props.makingAppointment()
        this.props.history.push('/pickTime')
    }
    render(){


        return(
            <div>
                <form onSubmit={this.handlePickTime}>
                    {}
                    <input
                    
                    />
                    <button>Pick Time</button>
                </form>
            </div>
        )
    }
}

export default withAppointment(withUser(Book));