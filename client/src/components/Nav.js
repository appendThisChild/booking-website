import React from "react"
import { Link } from "react-router-dom"

// providers
import { withUser } from "../context/UserProvider.js"


const Nav = props => {
    const {token, logout} = props
    let signOut = null
    let signInLinkName = "Sign In"
    if (token){
        signOut = <Link to="/" onClick={logout}>Sign Out</Link>
        signInLinkName = "My Profile"
    }
    return(
        <div className={`navBarBaseClass ${props.navSideToggle ? "navBarShown" : "navBarHidden"}`}>
            <div className={"navBarLinks"}>
                <Link to="/">Home</Link>
                <Link to="/book">Book a Massage</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/profile">{signInLinkName}</Link>
                {signOut}
            </div>
        </div>
    )
}

export default withUser(Nav);