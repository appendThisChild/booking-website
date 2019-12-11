import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

// Providers
import { withUser } from "./context/UserProvider.js"
import { withGeneral } from './context/GeneralInfoProvider.js'

// Component/Routes
import Header from "./components/Header.js"
import Home from "./components/Home.js"
import Book from "./components/Book.js"
import PickTime from "./components/PickTime.js"
import OnSiteAddress from "./components/OnSiteAddress.js"
import PackageAndSubmit from "./components/PackageAndSubmit.js"
import AppointmentBooked from "./components/AppointmentBooked.js"
import Contact from "./components/Contact.js"
import SignIn from "./components/SignIn.js"
import History from "./components/History.js"
import PersonalInfo from "./components/PersonalInfo.js"
import TherapistHistory from "./components/TherapistHistory.js"
import CompanyHistory from "./components/CompanyHistory.js"
import AllAccounts from "./components/AllAccounts.js"
import AccountHistory from "./components/AccountHistory.js"
import CiteInfo from "./components/CiteInfo.js"
import Reviews from "./components/Reviews.js"
import PasswordRecovery from "./components/PasswordRecovery.js"
import Connect from "./components/Connect.js"
import Footer from "./components/Footer.js"



class App extends Component {
    constructor(){
        super()
        this.state = {
            navSideToggle: false,
            dataIn: false
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
    componentDidMount(){
        this.props.getGeneralInfo(() => this.setState({ dataIn: true }))
    }
    render(){
        const { token } = this.props
        return(
            <div onClick={this.closeSideNav}>
                <Header 
                    sideNavToggler={this.sideNavToggler} 
                    navSideToggle={this.state.navSideToggle}/> 
                { this.state.dataIn ?
                <Switch>
                    <Route exact path="/" render={renderProps => <Home {...renderProps}/>}/>
                    <Route path="/book" render={renderProps => <Book {...renderProps}/>}/>
                    <Route path="/pickTime" render={renderProps => (
                        token 
                        ? <PickTime {...renderProps}/>
                        : <SignIn {...renderProps}/>
                    )}/>
                    <Route path="/on-site-address" render={renderProps => <OnSiteAddress {...renderProps}/>}/>
                    <Route path="/selectPackageAndSubmit" render={renderProps => <PackageAndSubmit {...renderProps}/>}/>
                    <Route path="/appointmentBooked" render={renderProps => <AppointmentBooked {...renderProps}/>}/>
                    <Route path="/contact" render={renderProps => <Contact {...renderProps}/>}/>
                    <Route path="/history" render={renderProps => (
                        token
                        ? <History {...renderProps}/>
                        : <SignIn {...renderProps}/>
                    )}/>
                    <Route path="/personalInfo" render={renderProps => <PersonalInfo {...renderProps}/>}/>
                    <Route path="/therapistHistory" render={renderProps => <TherapistHistory {...renderProps}/>}/> 
                    <Route path="/companyHistory" render={renderProps => <CompanyHistory {...renderProps}/>}/> 
                    <Route path="/accounts" render={renderProps => <AllAccounts {...renderProps}/>}/> 
                    <Route path="/accountHistory/:id" render={renderProps => <AccountHistory {...renderProps}/>}/> 
                    <Route path="/citeInfo" render={renderProps => <CiteInfo {...renderProps}/>}/>
                    <Route path="/review" render={renderProps => <Reviews {...renderProps}/>}/>
                    <Route path="/recovery/:req/:id" render={renderProps => <PasswordRecovery {...renderProps}/>}/>
                    <Route path="/connect/:id" render={renderProps => <Connect {...renderProps}/>}/>
                </Switch>
                :null}
                <Footer />
            </div>
        )
    }
}

export default withGeneral(withUser(App));