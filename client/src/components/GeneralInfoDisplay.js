import React from 'react'

import PricingDisplay from './PricingDisplay.js';

const GeneralInfoDisplay = props => {
    const { homeTitle, homeInfo, homeTherapistSubtitle, pricing, cancelationPolicy } = props
    const mappedHomeInfo = homeInfo.map((para, i) => <p key={i}>{i + 1}.) {para}</p>)
    const mappedCancelPolicy = cancelationPolicy.map((para, i) => <p key={i}>{i + 1}.) {para}</p>)
    // liabilityWavierId
    return(
        <div>
            <h2>Cite Info</h2>
            <h3>Home Title:</h3>
            <p>{homeTitle}</p>
            <h3>Home Paragraphs:</h3>
            {mappedHomeInfo}
            <h3>Home Therapist Subtitle:</h3>
            <p>{homeTherapistSubtitle}</p>
            <h3>Pricing:</h3>
            <PricingDisplay pricing={pricing} className={""}/>
            <h3>Cancelation Policy:</h3>
            {mappedCancelPolicy}
        </div>
    )
}

export default GeneralInfoDisplay;