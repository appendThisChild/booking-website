import React, { Component } from "react"
import { Link } from "react-router-dom"

class Nav extends Component {
    constructor(){
        super()
        this.state = {

        }
    }

    render(){
        return(
            <div className={"navBar"}>
                <Link to="/">Home</Link>
                <Link to="/book">Book a Massage</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/signIn">Sign In</Link>
            </div>
        )
    }
}

export default Nav;