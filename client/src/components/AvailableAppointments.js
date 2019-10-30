import React from "react"

import AvailableAppointmentDay from "./AvailableAppointmentDay.js"

const AvailableAppointments = props => {
    const { appointmentsArr, handlePackageAndSubmit, viewedWeek, newWeek } = props
    const mappedDays = appointmentsArr.map((day, i) => 
        <AvailableAppointmentDay viewedWeek={viewedWeek} newWeek={newWeek} handlePackageAndSubmit={handlePackageAndSubmit} {...day} key={i}/>
    )
    return(
        <div className="availableAppointments">
            <div>
                <h1>Select a time:</h1>
                {mappedDays}
            </div>
        </div>
    )
}

export default AvailableAppointments;