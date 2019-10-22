import React from "react"

import { withToggler } from "../components/Toggler.js"

const NumberChange = props => {
    const {handleChange, handleNumberDidChange, on, toggle, numberDisplay, clientPhoneNumber } = props
    return(
        <div>
            {on ?
            <>
                <p>{numberDisplay(clientPhoneNumber)}</p>
                <button onClick={() => {
                    handleNumberDidChange()
                    toggle()
                }}>Update</button>
            </>
            :
            <input type="tel" name="clientPhoneNumber" value={clientPhoneNumber} onChange={handleChange} />
            }
        </div>
    )
}

export default withToggler(NumberChange);