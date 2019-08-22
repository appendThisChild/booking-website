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
            <div className={"headerDiv"}>
                <div className={"sagSymbol"}>
                    <h1>Blissed Out Body Work</h1>
                    <span>By Matthew Sweatness</span>
                    <Nav /> 
                </div>
            </div>
        )
    }
}

export default Header;