import React from 'react'

import { withToggler } from "./Toggler.js"

const FAQsDisplay = props => {
    const { faq, on, toggle } = props
    return(
        <section>
            <div className={on ? "" : "questionOpened"}>
                <h1>{faq.question}</h1>
                <span onClick={toggle}>{on ? <>&#x2b;</> : <>&#x2212;</>}</span>
            </div>
            {!on ?
            <>
                <p>{faq.answer}</p>
            </>
            : null}
        </section>
    )
}

export default withToggler(FAQsDisplay);