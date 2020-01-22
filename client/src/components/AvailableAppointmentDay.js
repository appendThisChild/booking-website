import React from "react"

import AvailableTime from "./AvailableTime.js"

const AvailableAppointmentDay = props => {
    const { year, month, date, day, handlePackageAndSubmit, viewedDay, newDay, nextDay } = props
    const mappedTimes = props.availableTimeBlocks.map((time, i) => 
        <AvailableTime year={year} month={month} date={date} timeBlock={time} handlePackageAndSubmit={handlePackageAndSubmit} key={i}/>
    )
    return(
        <>
            <div className="availableDays">
                <h1>{day}</h1>
                <p>{month + 1}/{date}</p>
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
                {props.availableTimeBlocks.length === 0 ? <p style={{ fontStyle: "italic", fontSize: "25px"}}>"No available times"</p> : mappedTimes}
            </div>
        </>
    )
}

export default AvailableAppointmentDay;