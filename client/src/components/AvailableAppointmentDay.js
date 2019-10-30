import React from "react"

import AvailableTime from "./AvailableTime.js"

const AvailableAppointmentDay = props => {
    const { year, month, date, day, handlePackageAndSubmit, viewedWeek, newWeek } = props
    const mappedTimes = props.availableTimeBlocks.map((time, i) => 
        <AvailableTime year={year} month={month} date={date} timeBlock={time} handlePackageAndSubmit={handlePackageAndSubmit} key={i}/>
    )
    return(
        <div>
            <div className="weekToggleContainer">
                {viewedWeek < 6 ?
                null
                :
                <span onClick={() => {newWeek(-7)}} className="prevWeek" >{"<<<"}</span>}
                {viewedWeek > 90 ?
                null
                :
                <span onClick={() => {newWeek(7)}} className="nextWeek" >{">>>"}</span>}
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