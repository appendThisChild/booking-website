import React from "react"

import AvailableTime from "./AvailableTime.js"

const AvailableAppointmentDay = props => {
    const { year, month, date, day, handlePackageAndSubmit, viewedDay, newDay, nextDay } = props
    const mappedTimes = props.availableTimeBlocks.map((time, i) => 
        <AvailableTime year={year} month={month} date={date} timeBlock={time} handlePackageAndSubmit={handlePackageAndSubmit} key={i}/>
    )
    return(
        <div>
            <div className="weekToggleContainer">
                {viewedDay < nextDay ?
                null
                :
                <span onClick={() => {newDay(-1)}} className="prevWeek" >{"<<<"}</span>}
                {viewedDay > 90 + nextDay ?
                null
                :
                <span onClick={() => {newDay(1)}} className="nextWeek" >{">>>"}</span>}
            </div>
            <div className="availableDays">
                <h1>{day}</h1>
                <p>{month + 1}/{date}</p>
                {mappedTimes}
            </div>
        </div>
    )
}

export default AvailableAppointmentDay;