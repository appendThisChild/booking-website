import React, { Component } from "react"

import Logo from "../images/thisFlower.jpg"

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
                <section>
                    <img src={Logo} alt="Company Logo"/>
                </section>
                <div className={"titleContainer"}>
                    <h1 className={"headerTitle0"}>Blissed</h1>
                    <h1 className={"headerTitle1"} style={{ paddingLeft: "10px"}}>out</h1>
                    <h1 className={"headerTitle2"}>Body</h1>
                    <h1 className={"headerTitle3"} style={{ paddingLeft: "10px"}}>work</h1>
                </div>
                <span className={"navToggle"} onClick={this.props.sideNavToggler}>&#9776;</span>
                <Nav sideNavToggler={this.props.sideNavToggler} navSideToggle={this.props.navSideToggle}/> 
            </div>
        )
    }
}

export default Header;