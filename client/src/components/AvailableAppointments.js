import React from "react"

import AvailableAppointmentDay from "./AvailableAppointmentDay.js"

const AvailableAppointments = props => {
    const { appointmentsArr, handlePackageAndSubmit } = props
    const mappedDays = appointmentsArr.map((day, i) => 
        <AvailableAppointmentDay handlePackageAndSubmit={handlePackageAndSubmit} {...day} key={i}/>
    )
    return(
        <div>
            {mappedDays}
        </div>
    )
}

export default AvailableAppointments;