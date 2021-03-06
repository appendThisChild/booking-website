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
    const travelFees = history.reduce((total, sum) =>  total + sum.travelFee, 0) / 100
    const websiteDeductions = (monthEarnings * .1).toFixed(2) - Number(adjustment)
    const therapistEarnings = (monthEarnings * .5).toFixed(2)
    const companyEarnings = (monthEarnings - websiteDeductions - therapistEarnings).toFixed(2)
    const serviceDeducted = (parseFloat(websiteDeductions) + parseFloat(companyEarnings)).toFixed(2)
    const monthHours = history.reduce((total, sum) => total + sum.appLengthInMinutes, 0) / 60
    const count60 = history.filter(app => app.appLengthInMinutes === 60).length
    const count75 = history.filter(app => app.appLengthInMinutes === 75).length
    const count90 = history.filter(app => app.appLengthInMinutes === 90).length
    return(
        <div className="mappedAppointments">
            <h1>{title}</h1>
            <p>{subTitle}</p>
            {future ?
            <nav className="monthTogglers">
                {toggle !== 0 ?
                <>
                    <span className="leftToggle" onClick={() => switchMonth(-1)}>{"Prev Month"}</span>
                    <span className="rightToggle" onClick={() => switchMonth(1)}>{"Next Month"}</span>
                </>
                :
                    <span className="rightToggle" onClick={() => switchMonth(1)}>{" Next Month"}</span>
                }
            </nav>
            :
            <nav className="monthTogglers">
                {toggle !== 0 ?
                <>
                    <span className="leftToggle" onClick={() => switchMonth(-1)}>{"Prev Month"}</span> 
                    <span className="rightToggle" onClick={() => switchMonth(1)}>{"Next Month"}</span>
                </>
                :
                    <span className="leftToggle" onClick={() => switchMonth(-1)}>{"Prev Month"}</span>
                }
            </nav>
            }
            <h2>{monthsOftheYear[month]} {year}</h2>
            {history.length === 0 ? <section>"No Appointments"</section> : mappedHistory}
            {client ? 
            null
            :
            <>
                {!future ?
                <aside>
                    
                    {owner ?
                    <>
                        <div>
                            <p>{monthsOftheYear[month]}'s Company Earnings</p>
                            <span>${(monthEarnings + travelFees).toFixed(2)} "Earnings"</span>
                            <span>- ${(parseFloat(therapistEarnings) + travelFees).toFixed(2)} "50% Therapist(s) Payment"</span>
                            <span>- ${websiteDeductions} "10% Website Service"</span>
                            <span>= ${companyEarnings}</span>
                        </div>
                        <div>
                            <p>{props.year}'s Company Earnings</p>
                            <span>${props.yearEarnings} "Earnings"</span>
                            <span>- ${props.yearTherapistEarnings} "50% Therapist(s) Payment"</span>
                            <span>- ${props.yearWebsiteDeductions} "10% Website Service"</span>
                            <span>= ${props.yearCompanyEarnings}</span>
                        </div>
                    </>
                    :
                    <>
                        <div>
                            <p>{monthsOftheYear[month]}'s Hours</p>
                            <span>60-Min Count: {count60}</span>
                            <span>75-Min Count: {count75}</span>
                            <span>90-Min Count: {count90}</span>
                            <span>Total Hours: {monthHours}</span>
                        </div>
                        <div>
                            <p>{monthsOftheYear[month]}'s Earnings</p>
                            <span>${(monthEarnings + travelFees).toFixed(2)} "Earnings"</span>
                            <span>- ${serviceDeducted} "50% Service Deductions"</span>
                            <span>= ${(parseFloat(therapistEarnings) + travelFees).toFixed(2)}</span>
                        </div>
                        {props.yearView ?
                        <div>
                            <p>{props.year}'s Earnings</p>
                            <span>${props.yearEarnings} "Earnings"</span>
                            <span>- ${props.yearServiceDeducted} "50% Service Deductions"</span>
                            <span>= ${props.yearTherapistEarnings}</span>
                        </div>
                        : null}
                    </>
                    }
                </aside>
                :
                null
                }
            </>
            }
        </div>
    )
}

export default AppointmentHistory;