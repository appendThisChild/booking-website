import React from 'react'

const Blackout = props => {
    const { date, handleDelete, _id } = props
    const year = new Date(date).getUTCFullYear()
    const month = new Date(date).getUTCMonth() + 1
    const day = new Date(date).getUTCDate()
    return(
        <div>
            <span>{month}/{day}/{year} -</span>
            <span onClick={() => handleDelete(_id)}>Delete</span>
        </div>
    )
}

export default Blackout;