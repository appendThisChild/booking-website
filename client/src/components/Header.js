import React, { Component } from "react"

import Nav from "./Nav.js"

class Header extends Component {
    constructor(){
        super()
        this.state = {

        }
    }

    render(){
        return(
            <div className={"headerBackground"}>
                <h1 className={"headerTitle1"}>Euphoric</h1>
                <h1 className={"headerTitle2"}>Massage</h1>
                <span className={"navToggle"} onClick={this.props.sideNavToggler}>&#9776;</span>
                <Nav sideNavToggler={this.props.sideNavToggler} navSideToggle={this.props.navSideToggle}/> 
            </div>
        )
    }
}

export default Header;