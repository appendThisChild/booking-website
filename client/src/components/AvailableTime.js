import React from "react"

const AvailableTime = props => {
    const { year, month, date, timeBlock, handlePackageAndSubmit } = props
    let secondBlock = timeBlock[1]
    if (timeBlock[1] === 0){
        secondBlock = "00"
    }
    return(
        <div>
            <button onClick={() => handlePackageAndSubmit(year, month, date, timeBlock[0], timeBlock[1])}>{timeBlock[0]}:{secondBlock}</button>
        </div>
    )
}

export default AvailableTime;