import React, { Component } from "react"

class Toggler extends Component {
    constructor(){
        super()
        this.state = {
            on: true
        }
    }
    toggle = () => {
        this.setState({on: !this.state.on})
    }
    render(){
        const {on} = this.state
        const {component, ...props} = this.props
        const C = component
        return(
            <C on={on} toggle={this.toggle} {...props}/>
        )
    }
}

export const withToggler = C => props => <Toggler component={C}{...props}/>