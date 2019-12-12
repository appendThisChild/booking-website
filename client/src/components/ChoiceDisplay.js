import React from "react"

import TherapistTimeChoice from "./TherapistTimeChoice.js"

const ChoiceDisplay = props => {
    const { editToggle, handleEdit, therapistName, appLengthInMinutes, isInStudio, editToggler } = props

    return(
        <div>
            {editToggle ? 
                <div className="choiceDisplay">
                    <TherapistTimeChoice handleSubmit={handleEdit} className="" cancelButton={true} cancelFunction={editToggler}/>
                </div>
                :
                <div className="choiceDisplay">
                    <div>
                        <button onClick={editToggler}>Edit</button>
                        <div>
                            <p>{therapistName}</p>
                            <p>{appLengthInMinutes} Minutes</p>
                            <p>{isInStudio === "true" ? "In Studio" : "On-Site"}</p>
                        </div>
                    </div>
                </div>
                }
        </div>
    )
}

export default ChoiceDisplay;