import React from 'react'

const Availability = props => {
    const timesArr = []
    let isNone = false
    props.arr.forEach(time => {
        const orig = time / 10
        let hour = orig
        let min = "00"
        let amPm = "am"
        if (orig === 0){
            hour = 12
        } else if (orig === 12){
            amPm = "pm"
        } else if (orig > 12){
            hour = hour - 12;
            amPm = "pm";
        }
        if (orig % 1 === .5){
            hour = hour - .5;
            min = "30";
        }
        if (orig === -1){
            isNone = true
        }
        timesArr.push(hour, min, amPm)
    })
    return( 
        <div>
            <h3>{props.day}</h3>
            {isNone ?
            <>
                <p>Start Time: No Availability</p>
                <p>End Time: No Availability</p>
            </>
            :
            <>
                <p>Start Time: {timesArr[0]}:{timesArr[1]} {timesArr[2]}</p>
                <p>End Time: {timesArr[3]}:{timesArr[4]} {timesArr[5]}</p>
            </>
            }
        </div>
    )
}

export default Availability;