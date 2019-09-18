import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

// Providers
import { withUser } from "./context/UserProvider.js"

// Component/Routes
import Header from "./components/Header.js"
import Home from "./components/Home.js"
import Book from "./components/Book.js"
import PickTime from "./components/PickTime.js"
import PackageAndSubmit from "./components/PackageAndSubmit.js"
import AppointmentBooked from "./components/AppointmentBooked.js"
import Contact from "./components/Contact.js"
import SignIn from "./components/SignIn.js"
import Profile from "./components/Profile.js"
import Footer from "./components/Footer.js"


class App extends Component {
    constructor(){
        super()
        this.state = {
            navSideToggle: false
        }
    }
    sideNavToggler = () => {
        this.setState(prevState => ({
            navSideToggle: !prevState.navSideToggle
        }))
    }
    closeSideNav = () => {
        if (this.state.navSideToggle){
            this.setState({
                navSideToggle: false
            })
        } 
    }

    render(){
        const { token } = this.props
        return(
            <div onClick={this.closeSideNav}>
                <Header 
                    sideNavToggler={this.sideNavToggler} 
                    navSideToggle={this.state.navSideToggle}/> 
                <Switch>
                    <Route exact path="/" render={renderProps => <Home {...renderProps}/>}/>
                    <Route path="/book" render={renderProps => <Book {...renderProps}/>}/>
                        <Route path="/pickTime" render={renderProps => (
                            token 
                            ? <PickTime {...renderProps}/>
                            : <SignIn {...renderProps}/>
                        )}/>
                            <Route path="/selectPackageAndSubmit" render={renderProps => <PackageAndSubmit {...renderProps}/>}/>
                                <Route path="/appointmentBooked" render={renderProps => <AppointmentBooked {...renderProps}/>}/>
                    <Route path="/contact" render={renderProps => <Contact {...renderProps}/>}/>
                    <Route path="/user" render={renderProps => (
                        token
                        ? <Profile {...renderProps}/>
                        : <SignIn {...renderProps}/>
                    )}/>

                </Switch>
                <Footer />
            </div>
        )
    }
}

export default withUser(App);