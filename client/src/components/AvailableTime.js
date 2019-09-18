import React from "react"

const AvailableTime = props => {
    const { year, month, date, timeBlock, handlePackageAndSubmit } = props
    let minuteBlock = timeBlock[0]
    let secondBlock = timeBlock[1]
    let amPm = "am"
    if (timeBlock[0] > 12){
        minuteBlock = timeBlock[0] -12;
        amPm = "pm";
    }
    if (timeBlock[1] === 0) secondBlock = "00";
    return(
        <div>
            <button onClick={() => handlePackageAndSubmit(year, month, date, timeBlock[0], timeBlock[1])}>{minuteBlock}:{secondBlock} {amPm}</button>
        </div>
    )
}

export default AvailableTime;