import React from 'react'

import RecoveryRequest from "./RecoveryRequest.js"
import RecoveryChange from "./RecoveryChange.js"

const PasswordRecovery = props => {
    if (props.match.params.req === "request"){
        return <RecoveryRequest />
    } else if (props.match.params.req === "change") {
        return <RecoveryChange id={props.match.params.id} />
    } else {
        return <div></div>
    }
}

export default PasswordRecovery;