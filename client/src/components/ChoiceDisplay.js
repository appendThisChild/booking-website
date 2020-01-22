import React from "react"

import TherapistTimeChoice from "./TherapistTimeChoice.js"

const ChoiceDisplay = props => {
    const { editToggle, handleEdit, therapistName, appLengthInMinutes, isInStudio, editToggler } = props

    return(
        <>
            {editToggle ? 
            <TherapistTimeChoice handleSubmit={handleEdit} className="choiceDisplay" cancelButton={true} cancelFunction={editToggler}/>
            :
            <div className="choiceDisplay">
                <button onClick={editToggler}>Edit</button>
                <div>
                    <p>{therapistName}</p>
                    <p>{appLengthInMinutes} Minutes</p>
                    <p>{isInStudio === "true" ? "In Studio" : "On-Site"}</p>
                </div>
            </div>
            }
        </>
    )
}

export default ChoiceDisplay;