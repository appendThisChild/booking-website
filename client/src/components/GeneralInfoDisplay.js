import React from 'react'

import PricingDisplay from './PricingDisplay.js';

const GeneralInfoDisplay = props => {
    const { homeTitle, homeInfo, homeTherapistSubtitle, pricing, cancelationPolicy, FAQs, liabilityWavierId, handleUpload, handleReplace, pdf, onSitePricing } = props
    const mappedHomeInfo = homeInfo.map((para, i) => <p key={i}>{i + 1}.) {para}</p>)
    const mappedCancelPolicy = cancelationPolicy.map((para, i) => <p key={i}>{i + 1}.) {para}</p>)
    const mappedFAQs = FAQs.map((obj, i) => {
        return(
            <section key={i}>
                <p>{i + 1}.)</p>
                <div>
                    <h4>Question:</h4>
                    <p>"{obj.question}"</p>
                    <h4>Answer:</h4>
                    <p>"{obj.answer}"</p>
                </div>
            </section>
        )
    })
    return(
        <section>
            <h2>Cite Info</h2>
            <h3>Home Title:</h3>
            <p>{homeTitle}</p>
            <h3>Home Paragraphs:</h3>
            {mappedHomeInfo}
            <h3>Home Therapist Subtitle:</h3>
            <p>{homeTherapistSubtitle}</p>
            <PricingDisplay pricing={pricing} className={""}/>
            <h3>Travel Fee:</h3>
            <p>Fee: ${onSitePricing / 100}</p>
            <h3>Cancelation Policy:</h3>
            {mappedCancelPolicy}
            <h3>Frequently asked questions (FAQs):</h3>
            {mappedFAQs}
            {liabilityWavierId !== "none" ?
            <>
                <h3>Liability Wavier:</h3>
                {/* Creates download link for pdf */}
                <a href={`data:application/pdf;base64,${pdf}`} download="Massage-Therapy-Wavier.pdf">Download Wavier</a>
                <h4>Replace Wavier (pdf)</h4>
                <input type="file" onChange={(e) => handleReplace(e)} accept="application/pdf"/>
            </>
            :
            <>
                <h3>Liability Wavier:</h3>
                <h4>Upload a Liability Wavier (pdf)</h4>
                <input type="file" onChange={(e) => handleUpload(e)} accept="application/pdf"/>
            </>
            }
        </section>
    )
}

export default GeneralInfoDisplay;