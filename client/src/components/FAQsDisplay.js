import React from 'react'

import { withToggler } from "./Toggler.js"

const FAQsDisplay = props => {
    const { faq, on, toggle } = props
    return(
        <div>
            <h3>{faq.question} <span onClick={toggle}>{on ? <>&#x2b;</> : <>&#x2212;</>}</span></h3>
            {!on ?
            <>
                <p>{faq.answer}</p>
            </>
            : null}
        </div>
    )
}

export default withToggler(FAQsDisplay);