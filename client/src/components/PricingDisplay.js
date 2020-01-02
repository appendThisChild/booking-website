import React from 'react'

const PricingDisplay = props => {
    const { pricing, className, travelFee } = props
    const minutesArr = [60, 90, 120]
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
        <div className={className}>
            <div>
                <h3>Pricing:</h3>
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
                        <p>${travelFee / 100} will be added for individual bookings.</p>
                        <p>( Travel fee is NOT refundable )</p>
                    </div>
                    :null}
                </div>
            </div>
        </div>
    )
}

export default PricingDisplay;