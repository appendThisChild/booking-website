import React, { useState, useEffect } from 'react'

import DaysDisplay from "./DaysDisplay.js"

const DatesDisplayed = props => {
    const [datesOrdered, setDatesOrdered] = useState([])
    const { setViewedDay } = props

    useEffect(() => {
        reorderDates()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.month])

    const reorderDates = () => {
        const { month } = props
        const datesReordered = [
            ["S"],
            ["M"],
            ["T"],
            ["W"],
            ["T"],
            ["F"],
            ["S"]
        ]
        month.forEach(obj => {
            datesReordered[obj.date.getDay()].push(obj)
        })
        setDatesOrdered(datesReordered)
    }

    const datesMapped = datesOrdered.map((arr, i) => <DaysDisplay setViewedDay={setViewedDay} arr={arr} key={i}/>)
    return(
        <main>
            <div>
                {datesMapped}
            </div>
        </main>
    )
}

export default DatesDisplayed;