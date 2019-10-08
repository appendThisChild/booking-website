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
                <div className={"titleContainer"}>
                    <h1 className={"headerTitle1"}>Blissed</h1>
                    <h1 className={"headerTitle2"}>Out</h1>
                    <h1 className={"headerTitle3"}>Body</h1>
                    <h1 className={"headerTitle4"}>Works</h1>
                </div>
                <span className={"navToggle"} onClick={this.props.sideNavToggler}>&#9776;</span>
                <Nav sideNavToggler={this.props.sideNavToggler} navSideToggle={this.props.navSideToggle}/> 
            </div>
        )
    }
}

export default Header;