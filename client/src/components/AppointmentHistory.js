import React from 'react'

import AppointmentBullet from "./AppointmentBullet.js"

const AppointmentHistory = props => {
    const { title, subTitle, history, future, client, month, year, switchMonth, toggle } = props
    const monthsOftheYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const thisMonthsHistory = history.filter(app => new Date(app.appDate).getFullYear() === year && new Date(app.appDate).getMonth() === month )
    const mappedHistory = thisMonthsHistory.map(app => <AppointmentBullet {...app} key={app._id}/> )
    const monthTotal = thisMonthsHistory.reduce((total, sum) => {
        return total + sum.amount
    }, 0)
    console.log(monthTotal)
    return(
        <div>
            <h1>{title}</h1>
            <p>{subTitle}</p>
            {future ?
            <>
                {toggle !== 0 ?
                <>
                    <span onClick={() => switchMonth(-1)}>{"<<<"}</span>
                    <span onClick={() => switchMonth(1)}>{">>>"}</span>
                </>
                :
                    <span onClick={() => switchMonth(1)}>{">>>"}</span>
                }
            </>
            :
            <>
                {toggle !== 0 ?
                <>
                    <span onClick={() => switchMonth(-1)}>{"<<<"}</span> 
                    <span onClick={() => switchMonth(1)}>{">>>"}</span>
                </>
                :
                    <span onClick={() => switchMonth(-1)}>{"<<<"}</span>
                }
            </>
            }
            <h2>{monthsOftheYear[month]} {year}</h2>
            {mappedHistory}
            {client ? 
            null
            :
            <p>
                <span>Month Total: {monthTotal}</span>
                {/* Number of hours total */}
                {/* Number of 60 minute massages */}
                {/* Number of 90 minute massages */}
                {/* Number of 120 minute massages */}
                <span></span>
            </p>
            }
        </div>
    )
}

export default AppointmentHistory;