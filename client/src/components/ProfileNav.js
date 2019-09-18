import React from 'react'
import { Link } from "react-router-dom"

import { withUser } from "../context/UserProvider.js"

const ProfileNav = props => {

    // get the user info for links


    const mappedLinks = props.links.map((link, i) => 
        <Link to={`/${link}`} key={i}>{props.firstCharCap(link)}</Link>
    )
    return(
        <div>
            Nav
            {mappedLinks}
        </div>
    )
}

export default withUser(ProfileNav);