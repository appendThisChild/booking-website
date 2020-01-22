import React from "react"

import AvailableAppointmentDay from "./AvailableAppointmentDay.js"

const AvailableAppointments = props => {
    const { appointmentsArr, handlePackageAndSubmit, viewedDay, newDay, nextDay } = props
    const mappedDays = appointmentsArr.map((day, i) => 
        <AvailableAppointmentDay viewedDay={viewedDay} newDay={newDay} nextDay={nextDay} handlePackageAndSubmit={handlePackageAndSubmit} {...day} key={i}/>
    )
    return(
        <div className="availableAppointments">
            <h1>Select a Time</h1>
            {mappedDays}
        </div>
    )
}

export default AvailableAppointments;