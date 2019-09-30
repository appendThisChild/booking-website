import React, { Component } from 'react'

import Blackout from './Blackout.js';

import { withBlackoutDates } from "../context/BlackoutDatesProvider.js"

class BlackoutDates extends Component {
    constructor(props){
        super(props)
        this.state = {
            therapistID: props.therapistID,
            blackoutDate: "",
            dataIn: false
        }
    }
    deleteBlackOut = id => {
        this.props.deleteBlackoutDate(id)
    }
    handleChange = e => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        this.setState({
            [e.target.name] : value
        })
    }
    handleSubmit = e => {
        e.preventDefault()
        const newBlackoutDate = {
            therapistID: this.state.therapistID,
            blackoutDate: new Date(this.state.blackoutDate)
        }
        this.props.postNewBlackoutDate(newBlackoutDate)
    }
    componentDidMount(){
        this.props.getTherapistsBlackoutDates(this.props.therapistID, () => {
            this.setState({ dataIn : true})
        })
    }
    render(){
        const { blackoutDates } = this.props
        const { blackoutDate, dataIn } = this.state
        const blackout = blackoutDates.sort((app1, app2) => new Date(app1.blackoutDate) - new Date(app2.blackoutDate))
        const mappedBlackoutDates = blackout.map(obj => <Blackout key={obj._id} date={obj.blackoutDate} handleDelete={this.deleteBlackOut} _id={obj._id}/>)
        return(
            <div>
                <h3>Reserve a date:</h3>
                <form onSubmit={this.handleSubmit}>
                    <input 
                        type="date"
                        name="blackoutDate"
                        value={blackoutDate}
                        onChange={this.handleChange}
                    />
                    <button>Submit Date</button>
                </form>
                <h3>Reserved Dates:</h3>
                {dataIn ?
                <>
                {mappedBlackoutDates}
                </>
                : null}
            </div>
        )
    }
}


export default withBlackoutDates(BlackoutDates);