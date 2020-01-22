import React, { useEffect, useState } from 'react'
import Countdown from "react-countdown-now"

// Component
import Appointment from "./Appointment.js";

// Provider
import { withAppointment } from "../context/AppointmentProvider.js"

const OnSiteAddress = props => {
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        zipcode: ""
    })
    const [dataIn, setDataIn] = useState(false)
    const states = [ "AK","AL","AR","AS","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"]
    const { updateAppointment } = props
    const date = new Date(props.currentAppointmentInProgress.appointmentCreatedAt).getTime()
    const tenMinuteTimer = ({ hours, minutes, seconds, completed }) => {
        if (completed){
            props.history.push("/book")
            return null
        } else {
            let min = String(minutes)
            let sec = String(seconds)
            if (min.length === 1) min = "0" + minutes;
            if (sec.length === 1) sec = "0" + seconds;
            return <p>Time remaing: {min}:{sec}</p>;
        }
    }
    const handleChange = e => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = e => {
        e.preventDefault()
        updateAppointment(props.currentAppointmentInProgress._id, { address }, () => {
            props.history.push("/selectPackageAndSubmit")
        })
    }
    useEffect(() => {
        window.scroll(0,0)
        if (props.currentAppointmentInProgress.status === "Pending"){
            setDataIn(true)
        } else {
            props.history.push("/book")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const mappedStates = states.map((str, i) => <option value={str} key={i}>{str}</option> )
    return(
        <div className="onSiteAddress">
            {dataIn ? 
            <>
                <Appointment appointment={props.currentAppointmentInProgress} showAddress={false} showTherapistInfo={false}/>
                <form onSubmit={handleSubmit}>
                    <Countdown date={date + 600000} renderer={tenMinuteTimer}/>
                    <h1>On-Site Address</h1>
                    <h3>Address the Therapist will be visiting for appointment.</h3>
                    <input 
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleChange}
                        required={true}
                        placeholder="Street..."/>
                    <input 
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        required={true}
                        placeholder="City..."/>
                    <select name="state" value={address.state} onChange={handleChange} required={true}>
                        {mappedStates}
                    </select>
                    <input 
                        type="text"
                        name="zipcode"
                        value={address.zipcode}
                        onChange={handleChange}
                        required={true}
                        placeholder="Zip Code..."/>
                    <button>Submit Address</button>
                </form>
            </>
            :null}
        </div>
    )
}

export default withAppointment(OnSiteAddress);