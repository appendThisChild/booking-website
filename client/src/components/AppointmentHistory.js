import React from 'react'

import AppointmentBullet from "./AppointmentBullet.js"

const AppointmentHistory = props => {
    const { title, subTitle, history, future, client, owner, month, year, switchMonth, toggle, therapist } = props
    const monthsOftheYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const mappedHistory = history.map(app => <AppointmentBullet {...app} client={client} therapist={therapist} future={future} key={app._id}/> )
    const filterNotCanceled = history.filter(app => app.therapistPaid === true)
    let adjustment = 0
    if (owner){
        const websiteDeductedAlready = history.filter(app => app.therapistPaid === true && app.canceled === true && app.packageChoice === 1)
        adjustment = ((websiteDeductedAlready.reduce((total, sum) => total + sum.amount, 0) / 100) * .1).toFixed(2)
    }
    const monthEarnings = filterNotCanceled.reduce((total, sum) => total + sum.amount, 0) / 100
    const websiteDeductions = (monthEarnings * .1).toFixed(2) - Number(adjustment)
    const therapistEarnings = (monthEarnings * .8).toFixed(2)
    const companyEarnings = (monthEarnings - websiteDeductions - therapistEarnings).toFixed(2)
    const serviceDeducted = (parseFloat(websiteDeductions) + parseFloat(companyEarnings))
    const monthHours = history.reduce((total, sum) => total + sum.appLengthInMinutes, 0) / 60
    const count60 = history.filter(app => app.appLengthInMinutes === 60).length
    const count90 = history.filter(app => app.appLengthInMinutes === 90).length
    const count120 = history.filter(app => app.appLengthInMinutes === 120).length
    return(
        <div>
            <h1>{title}</h1>
            <p>{subTitle}</p>
            {future ?
            <>
                {toggle !== 0 ?
                <>
                    <span onClick={() => switchMonth(-1)}>{"<<< Previous Month"}</span>
                    <span onClick={() => switchMonth(1)}>{"Next Month >>>"}</span>
                </>
                :
                    <span onClick={() => switchMonth(1)}>{" Next Month >>>"}</span>
                }
            </>
            :
            <>
                {toggle !== 0 ?
                <>
                    <span onClick={() => switchMonth(-1)}>{"<<< Previous Month"}</span> 
                    <span onClick={() => switchMonth(1)}>{"Next Month >>>"}</span>
                </>
                :
                    <span onClick={() => switchMonth(-1)}>{"<<< Previous Month"}</span>
                }
            </>
            }
            <h2>{monthsOftheYear[month]} {year}</h2>
            <p>"Click on Appointment to Expand"</p>
            {mappedHistory}
            {client ? 
            null
            :
            <>
                {!future ?
                <>
                    <div>
                        <span>60-Minute Appointments: #{count60}</span>
                        <span>90-Minute Appointments: #{count90}</span>
                        <span>120-Minute Appointments: #{count120}</span>
                        <span>Total Hours: {monthHours}hrs</span>
                    </div>
                    {owner ?
                    <div>
                        <span>{monthsOftheYear[month]}'s Company Earnings: ${monthEarnings} - "80% Therapist(s) Payment (-${therapistEarnings})" - "10% Website Service (-${websiteDeductions})" = ${companyEarnings}</span>
                    </div>
                    :
                    <div>
                        <span>{monthsOftheYear[month]}'s Earnings: ${monthEarnings} - "20% Service Deductions (-${serviceDeducted})" = ${therapistEarnings}</span>
                    </div>
                    }
                </>
                :
                null
                }
            </>
            }
        </div>
    )
}

export default AppointmentHistory;