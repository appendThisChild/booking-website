import React from 'react'
import { Link } from "react-router-dom"

import { withUser } from "../context/UserProvider.js"

const ProfileNav = props => {
    const { user } = props
    let { isOn } = props
    const links = ["/history", "/personalInfo"]
    const linkName = ["Your History", "Personal Information"]
    if (user.isTherapist){
        links.push("/therapistHistory")
        linkName.push("Your Therapist History")
    } else {
        if (isOn > 2) isOn--;
    }
    if (user.isOwner){
        links.push("/companyHistory", "/accounts", "/citeInfo")
        linkName.push("Company History", "All Accounts", "Cite Info")
    }
    const mappedLinks = links.map((link, i) => 
        <Link className={i === isOn ? "linkHighlight" : "linkNoHighlight"} to={`${link}`} key={i}>{linkName[i]}</Link>
    )
    return(
        <div className="profileNav">
            {mappedLinks}
        </div>
    )
}

export default withUser(ProfileNav);