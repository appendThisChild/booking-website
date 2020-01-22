import React from 'react'

const PricingDisplay = props => {
    const { pricing, className, travelFee } = props
    const minutesArr = [60, 75, 90]
    const singles = []
    const triples = []
    pricing.forEach(priceArr => {
        priceArr.forEach((price, i) => {
            if (i === 0){
                singles.push(price)
            } else {
                triples.push(price)
            }  
        })
    })
    const mappedSingles = singles.map((price, i) => <p key={i}>{minutesArr[i]} Minutes - ${price / 100}</p>)
    const mappedTriples = triples.map((price, i) => <p key={i}>{minutesArr[i]} Minutes - ${price / 100}</p>)
    return(
        <section className={className}>
            <div>
                <h1>Pricing</h1>
                <div>
                    <div>
                        <h4>Single Massage</h4>
                        {mappedSingles}
                    </div>
                    <div>
                        <h4>Package of 3</h4>
                        {mappedTriples}
                    </div>
                    {travelFee ?
                    <div>
                        <h4>On-Site Travel Fee</h4>
                        <p>${travelFee / 100} will be added for individual bookings. Travel fee is NOT refundable.</p>
                        {/* <p></p> */}
                    </div>
                    :null}
                </div>
            </div>
        </section>
    )
}

export default PricingDisplay;