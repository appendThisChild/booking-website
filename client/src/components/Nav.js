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
            <div className={`navBarBaseClass ${this.props.navSideToggle ? "navBarShown" : "navBarHidden"}`} onClick={this.props.sideNavToggler}>
                <span className={"navToggle"}>&#9747;</span>
                <div className={"navBarLinks"}>
                    <Link to="/">Home</Link>
                    <Link to="/book">Book a Massage</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/signIn">Sign In</Link>
                </div>
            </div>
        )
    }
}

export default Nav;