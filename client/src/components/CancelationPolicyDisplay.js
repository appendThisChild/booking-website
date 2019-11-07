import React from 'react'

import { withGeneral } from '../context/GeneralInfoProvider.js'

const Cancelation = props => {
    const { cancelationPolicy } = props.genInfo
    const mappedCancelation = cancelationPolicy.map((para, i) => <p key={i}>&#8226; {para}</p>)
    return(
        <div className="pAndSInside1">
            <div className="inside3">
                <div>
                    <h2>Cancelation Policy:</h2>
                    {mappedCancelation}
                </div>
            </div>
        </div>
    )
    
}

export default withGeneral(Cancelation);