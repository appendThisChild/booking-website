import React from 'react'

import { withUser } from "../context/UserProvider.js"

import NumberChange from "./NumberChange.js"

const IntakeForm = props => {
    const { clientPhoneNumber, head, neck, shoulders, chest, abs, upperBack, middleBack, lowerBack, glute, thigh, calf, handleChange, handleSubmit, handleNumberDidChange, firstCharCap, numberDisplay } = props
    const bodyParts = ["head", "neck", "shoulders", "chest", "abs", "upperBack", "middleBack", "lowerBack", "glute", "thigh", "calf"]
    const bodyArrs = [head, neck, shoulders, chest, abs, upperBack, middleBack, lowerBack, glute, thigh, calf]
    const mappedBodyParts = bodyArrs.map((bodyPart, i) => {
        const mappedLeftRight = bodyPart.map((side, j) => {
            const nameIndex = bodyParts[i] + ` ${j}` 
            const input = <input type="checkbox" name={nameIndex} value={side} onChange={handleChange}/>
            return(
                <div key={j}>
                    <span>{j === 0 ? "Left Side: " : "Right Side: "}</span>
                    {input}
                </div>
            )
        })
        return(
            <div key={i}>
                <h5>{firstCharCap(bodyParts[i])}: </h5>
                {mappedLeftRight}
            </div>
        )
    })
    return(
        <form onSubmit={handleSubmit}>
            <h1>Before you go!</h1>
            <h2>Please fill in our Intake Form:</h2>
            <h4>Is this number correct?</h4>
            <NumberChange
                handleChange={handleChange}
                numberDisplay={numberDisplay}
                clientPhoneNumber={clientPhoneNumber}
                handleNumberDidChange={handleNumberDidChange}
            />
            <h4>Where are you experiencing pain?</h4>
            {mappedBodyParts}
            <button>Submit Intake Form</button>
        </form>
    )
}

export default withUser(IntakeForm);