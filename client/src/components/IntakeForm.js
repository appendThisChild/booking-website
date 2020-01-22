import React from 'react'

import { withUser } from "../context/UserProvider.js"

import NumberChange from "./NumberChange.js"

const IntakeForm = props => {
    const { clientPhoneNumber, head, neck, shoulders, chest, abs, upperBack, middleBack, lowerBack, glute, thigh, calf, comments, handleChange, handleSubmit, handleNumberDidChange, firstCharCap, numberDisplay } = props
    const bodyParts = ["head", "neck", "shoulders", "chest", "abs", "upperBack", "middleBack", "lowerBack", "glute", "thigh", "calf"]
    const bodyArrs = [head, neck, shoulders, chest, abs, upperBack, middleBack, lowerBack, glute, thigh, calf]
    const mappedBodyParts = bodyArrs.map((bodyPart, i) => {
        const mappedLeftRight = bodyPart.map((side, j) => {
            const nameIndex = bodyParts[i] + ` ${j}` 
            return(
                <input key={j} type="checkbox" name={nameIndex} value={side} onChange={handleChange}/>
            )
        })
        return(
            <div key={i}>
                <h5>{firstCharCap(bodyParts[i])}</h5>
                {mappedLeftRight}
            </div>
        )
    })
    return(
        <form onSubmit={handleSubmit} className="intakeForm">
            <h1>Before you go!</h1>
            <h4>Is this number correct?</h4>
            <NumberChange
                handleChange={handleChange}
                numberDisplay={numberDisplay}
                clientPhoneNumber={clientPhoneNumber}
                handleNumberDidChange={handleNumberDidChange}
            />
            <h4>Where are you experiencing pain?</h4>
            <section>
                <div>
                    <p></p>
                    <p>Left Side</p>
                    <p>Right Side</p>
                </div>
                {mappedBodyParts}
            </section>
            <h4>Anything else we should know?</h4>
            <textarea 
                name="comments"
                value={comments}
                onChange={handleChange}
                placeholder="Comments..."
            />
            <button>Submit Intake Form</button>
        </form>
    )
}

export default withUser(IntakeForm);