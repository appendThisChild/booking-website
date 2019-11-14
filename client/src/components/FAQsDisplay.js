import React from 'react'

import { withToggler } from "./Toggler.js"

const FAQsDisplay = props => {
    const { faq, on, toggle } = props
    return(
        <div>
            <div className={on ? "" : "questionOpened"}>
                <h3>{faq.question}</h3>
                <span onClick={toggle}>{on ? <>&#x2b;</> : <>&#x2212;</>}</span>
            </div>
            
            {!on ?
            <>
                <p>{faq.answer}</p>
            </>
            : null}
        </div>
    )
}

export default withToggler(FAQsDisplay);