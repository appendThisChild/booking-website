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
                <span className={"navToggle"}>&#9776;</span>
                <h1 className={"headerTitle1"}>Euphoric</h1>
                <h1 className={"headerTitle2"}>Massage</h1>
                <Nav /> 
            </div>
        )
    }
}

export default Header;