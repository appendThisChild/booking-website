import React, { useState, useEffect } from 'react'

import DatesDisplayed from "./DatesDisplayed.js"

const MonthDisplay = props => {
    const [dateArr, setDateArr] = useState([])
    const [viewedYear, setViewedYear] = useState(props.startDay.getFullYear())
    const [viewedMonth, setViewedMonth] = useState(props.startDay.getMonth())
    const { setViewedDay } = props

    useEffect(() => {
        createDisplayArrays()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.startDay, viewedMonth, props.viewedDay])

    const toggleMonth = (num) => {
        if (viewedMonth + num > 11){
            setViewedMonth(0)
            setViewedYear(viewedYear + num)
        } else if (viewedMonth + num < 0) {
            setViewedMonth(11)
            setViewedYear(viewedYear + num)
        } else {
            setViewedMonth(viewedMonth + num)
        }
        
    }

    const createDisplayArrays = () => {
        const date = props.startDay
        const newDate = new Date()
        const dateSet = new Date(newDate.setDate(newDate.getDate() + props.viewedDay))
        const monthArr = createMonth(date, dateSet)
        setDateArr(monthArr)
    }

    const createMonth = (origDate, selectedDate) => {
        const sudoDate = new Date(origDate)
        const month = []
        const startOfMonth = new Date(new Date(new Date(sudoDate.setDate(1)).setMonth(viewedMonth)).setFullYear(viewedYear))
        const startOfMonthDay = startOfMonth.getDay()
        const nextMonth = new Date(sudoDate.setMonth(viewedMonth + 1))
        const lastDayOfMonth = new Date(nextMonth.setDate(nextMonth.getDate() - 1)).getDate()
        const startOfWeek = new Date(startOfMonth.setDate(startOfMonth.getDate() - startOfMonthDay))
        for (let i = 0; i < lastDayOfMonth - 1 + startOfMonthDay; i++){
            for (let j = 0; j < 7; j++){
                const date = new Date(startOfWeek)
                const newDate = new Date(date.setDate(date.getDate() + i))
                let selected = false
                if (selectedDate.getFullYear() === newDate.getFullYear() 
                    && selectedDate.getMonth() === newDate.getMonth() 
                    && selectedDate.getDate() === newDate.getDate()){
                    selected = true
                }
                const daysAway = Math.round((newDate - origDate) / 86400000) + (props.nextDay - 1)
                const dayObj = {
                    date: newDate,
                    available: newDate >= origDate && daysAway <= 90 + props.nextDay ? true : false,
                    selected,
                    daysAway
                }
                month.push(dayObj)
                i++
            }
            i--
        }
        return month
    }
    
    return(
        <div className="calendar">
            <h4>{props.monthsOfTheYear[viewedMonth]}</h4>
            <div className="weekToggleContainer">
                <span onClick={() => {toggleMonth(-1)}} className="prevWeek" >{"<"}</span>
                <span onClick={() => {toggleMonth(1)}} className="nextWeek" >{">"}</span>
            </div>
            <DatesDisplayed month={dateArr} setViewedDay={setViewedDay}/>
        </div>
    )
}

export default MonthDisplay;