import React, { Component } from "react"
import { Link } from "react-router-dom"

// providers
import { withUser } from "../context/UserProvider.js"

class Nav extends Component {
    constructor(){
        super()
        this.state = {
            
        }
    }

    render(){
        const {token, logout} = this.props
        let signOut = null
        let signInLinkName = "Sign In"
        if (token){
            signOut = <Link to="/" onClick={logout}>Sign Out</Link>
            signInLinkName = "My Bookings"
        }
        return(
            <div className={`navBarBaseClass ${this.props.navSideToggle ? "navBarShown" : "navBarHidden"}`}>
                <div className={"navBarLinks"}>
                    <Link to="/">Home</Link>
                    <Link to="/book">Book a Massage</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/user">{signInLinkName}</Link>
                    {signOut}
                </div>
            </div>
        )
    }
}

export default withUser(Nav);