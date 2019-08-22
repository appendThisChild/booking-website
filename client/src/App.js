import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

// Component/Routes
import Header from "./components/Header.js"
import Home from "./components/Home.js"
import Book from "./components/Book.js"
import Contact from "./components/Contact.js"
import SignIn from "./components/SignIn.js"
import Footer from "./components/Footer.js"

//Providers


class App extends Component {
    constructor(){
        super()
        this.state = {

        }
    }

    render(){
        return(
            <div>
                <Header /> 
                <Switch>
                    <Route exact path="/" render={renderProps => <Home {...renderProps}/>}/>
                    <Route path="/book" render={renderProps => <Book {...renderProps}/>}/>
                    <Route path="/contact" render={renderProps => <Contact {...renderProps}/>}/>
                    <Route path="/signIn" render={renderProps => <SignIn {...renderProps}/>}/>
                </Switch>
                <Footer />
                {/* 2.) Footer component containing my business link information/copyright/ */}
            </div>
        )
    }
}

export default App;