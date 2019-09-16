import React from "react"

import TherapistTimeChoice from "./TherapistTimeChoice.js"

const ChoiceDisplay = props => {
    const {editToggle, handleEdit, therapistName, appLengthInMinutes, editToggler, viewedWeek, newWeek} = props

    return(
        <div>
            {editToggle ? 
                <>
                    <TherapistTimeChoice />
                    <button onClick={handleEdit}>Done</button>
                </>
                :
                <>
                    <p>Therapist: {therapistName}</p>
                    <p>{appLengthInMinutes} Minutes</p>
                    <span onClick={editToggler}>Edit</span>
                </>
                }
                <div>
                    {viewedWeek < 6 ?
                    null
                    :
                    <span onClick={() => {newWeek(-7)}}>{"<<<"}</span>}
                    {viewedWeek > 90 ?
                    null
                    :
                    <span onClick={() => {newWeek(7)}}>{">>>"}</span>}
                </div>
        </div>
    )
}

export default ChoiceDisplay;