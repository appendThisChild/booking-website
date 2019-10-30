import React from 'react'

const DaysDisplay = props => {
    const { arr, setViewedDay } = props

    const daysMapped = arr.map((element, i) => {
        let unselected = "calendarDateUnselected"
        if (!element.available){
            unselected = "calendarDateUnselectedNotAvailable"
        }
        return(
            <div key={i} className="buttonContainer">
                {typeof element === "string" ?
                    <button>{element}</button>
                :
                    <button 
                        className={element.selected ? "calendarDateSelected" : unselected}
                        onClick={element.available ? () => setViewedDay(element.daysAway) : null}
                    >{element.date.getDate()}</button>
                }
            </div>
        )
    })
    return(
        <div>
            {daysMapped}
        </div>
    )
}

export default DaysDisplay;