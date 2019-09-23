import React from 'react'
import { Link } from "react-router-dom"

import { withUser } from "../context/UserProvider.js"

const ProfileNav = props => {
    const { user } = props
    const links = ["/history", "/personalInfo"]
    const linkName = ["Your History", "Personal Information"]
    if (user.isTherapist){
        links.push("/therapistHistory")
        linkName.push("Your Therapist History")
    }
    if (user.isOwner){
        links.push("/companyHistory")
        linkName.push("Company History")
        // adding 
    }
    const mappedLinks = links.map((link, i) => 
        <Link to={`${link}`} key={i}>{linkName[i]}</Link>
    )
    return(
        <div>
            {mappedLinks}
        </div>
    )
}

export default withUser(ProfileNav);