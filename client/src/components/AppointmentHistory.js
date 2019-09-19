import React from 'react'

const AppointmentHistory = props => {
    const { title, subTitle, history } = props
    // leaving on this idea
    const years = [{year: 2019, app: []}]
    const startYear = new Date(history[0].appDate).getFullYear()
    // split up appointments by year

    // I need to

    console.log(startYear)
    return(
        <div>
            <h1>{title}</h1>
            <p>{subTitle}</p>
            Appointment History

        </div>
    )
}

export default AppointmentHistory;