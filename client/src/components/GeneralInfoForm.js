import React from 'react'

const GeneralInfoForm = props => {
    const { homeTitle, homeInfo, homeTherapistSubtitle, pricing, cancelationPolicy, FAQs, handleChange, handleSubmit, removeLine, addLine } = props
    const mappedHomeInfo = homeInfo.map((para, i) => {
        const name = "homeInfo"
        const nameIndex = name + ` ${i}`
        return(
            <div key={i}>
                <p>{i + 1}.) </p>
                <textarea 
                    name={nameIndex} 
                    value={para} 
                    onChange={handleChange}
                    rows="4" 
                    cols="50"
                />
                <span onClick={() => removeLine(nameIndex)}> &#9747;</span>
            </div>
        )
    })
    const minutesArr = [60, 90, 120]
    const singles = []
    const triples = []
    pricing.forEach(priceArr => {
        priceArr.forEach((price, i) => {
            if (i === 0){ singles.push(price) } 
            else { triples.push(price) }  
        })
    })
    const mappedSingles = singles.map((price, i) => {
        const name = "pricing"
        const index2 = "0"
        const nameIndex = name + ` ${i} ` + index2
        return(
            <div key={i}>
                <p>{minutesArr[i]}-Minutes $</p>
                <input 
                    type="number"
                    name={nameIndex}
                    value={price}
                    onChange={handleChange}
                    placeholder="#####"
                />
            </div>
        )
    })
    const mappedTriples = triples.map((price, i) => {
        const name = "pricing"
        const index2 = "1"
        const nameIndex = name + ` ${i} ` + index2
        return(
            <div key={i}>
                <p>{minutesArr[i]}-Minutes $</p>
                <input 
                    type="number"
                    name={nameIndex}
                    value={price}
                    onChange={handleChange}
                    placeholder="###.##"
                />
            </div>
        )
    })
    const mappedCancelPolicy = cancelationPolicy.map((para, i) => {
        const name = "cancelationPolicy"
        const nameIndex = name + ` ${i}`
        return(
            <div key={i}>
                <p>{i + 1}.) </p>
                <textarea 
                    name={nameIndex} 
                    value={para} 
                    onChange={handleChange}
                    rows="4" 
                    cols="50"
                />
                <span onClick={() => removeLine(nameIndex)}> &#9747;</span>
            </div>
        )
    })
    const mappedFAQs = FAQs.map((obj, i) => {
        const name = "FAQs"
        const nameIndex = name + ` ${i}`
        const questionParam = "question"
        const answerParam = "answer"
        const qIndex = name + ` ${i} ` + questionParam
        const aIndex = name + ` ${i} ` + answerParam
        return(
            <div key={i}>
                <p>{i + 1}.) </p>
                <div>
                    <input 
                        type="text"
                        name={qIndex}
                        value={obj.question}
                        onChange={handleChange}
                        placeholder={"Place question here..."}
                    />
                    <textarea
                        name={aIndex}
                        value={obj.answer}
                        onChange={handleChange}
                        placeholder={"Place answer here..."}
                    />
                </div>
                <span onClick={() => removeLine(nameIndex)}> &#9747;</span>
            </div>
        )
    })
    return(
        <form onSubmit={handleSubmit}>
            <h2>Edit Cite Info</h2>
            <h3>Home's Main Title:</h3> 
            <input 
                type="text"
                name="homeTitle"
                value={homeTitle}
                onChange={handleChange}
                placeholder="Title..." 
            />
            <h3>Home's Main Paragraphs:</h3>
            {mappedHomeInfo}
            <aside>
                <p onClick={() => addLine("homeInfo")}> &#x2b; Add Line</p>
            </aside>
            <h3>Home's Therapist Subtitle:</h3>
            <textarea 
                name="homeTherapistSubtitle"
                value={homeTherapistSubtitle}
                onChange={handleChange}
                rows="4" 
                cols="50"
                placeholder="Text..." 
            />
            <h3>Pricing:</h3>
            <span>(in cents)</span>
            <h4>Single</h4>
            {mappedSingles}
            <h4>Triple</h4>
            {mappedTriples}
            <h3>Cancelation Policy:</h3>
            {mappedCancelPolicy}
            <aside>
                <p onClick={() => addLine("cancelationPolicy")}> &#x2b; Add Line</p>
            </aside>
            <h3>Frequently asked questions (FAQs):</h3>
            {mappedFAQs}
            <aside>
                <p onClick={() => addLine("FAQs")}> &#x2b; Add Line</p>
            </aside>
            <button>Submit Cite Changes</button>
        </form>
    )
}

export default GeneralInfoForm;