import React from "react"

import AvailableTime from "./AvailableTime.js"

const AvailableAppointmentDay = props => {
    const { year, month, date, day, handlePackageAndSubmit } = props
    const mappedTimes = props.availableTimeBlocks.map((time, i) => 
        <AvailableTime year={year} month={month} date={date} timeBlock={time} handlePackageAndSubmit={handlePackageAndSubmit} key={i}/>
    )
    return(
        <div>
            <h1>{day}</h1>
            <p>{month + 1}/{date}</p>
            {mappedTimes}
        </div>
    )
}

export default AvailableAppointmentDay;