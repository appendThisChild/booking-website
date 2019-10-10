import React, { Component } from "react"

import TherapistDisplay from "./TherapistDisplay"

import { withGoogle } from "../context/GoogleCalendarProvider.js"

class Home extends Component {
    constructor(){
        super()
        this.state = {

        }
    }

    componentDidMount(){
        this.props.getEvents()
        // this.props.deleteEvent("be4f6q8p3v7v90se6kmfma7oh4")
        // "be4f6q8p3v7v90se6kmfma7oh4"
    }

    render(){
        return(
            <div className={"bodyBackground"}>
                <div className={"homeBorder"}>
                    <div className={`homeContainer ${"homeContainer1"}`}>
                        <h1>Our Mission</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur in doloremque ipsum ipsa cum dignissimos aperiam voluptas, modi aut excepturi ducimus magnam reiciendis eos vitae quos praesentium enim sit corporis.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur in doloremque ipsum ipsa cum dignissimos aperiam voluptas, modi aut excepturi ducimus magnam reiciendis eos vitae quos praesentium enim sit corporis.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur in doloremque ipsum ipsa cum dignissimos aperiam voluptas, modi aut excepturi ducimus magnam reiciendis eos vitae quos praesentium enim sit corporis.</p>
                    </div>
                    <div className={"homeContainer2"}>
                        <h1>Our Therapists</h1>
                        {/* <TherapistDisplay /> */}
                    </div>
                    <div className={`homeContainer ${"homeContainer3"}`}>
                        <h1>Reviews</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur in doloremque ipsum ipsa cum dignissimos aperiam voluptas, modi aut excepturi ducimus magnam reiciendis eos vitae quos praesentium enim sit corporis.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur in doloremque ipsum ipsa cum dignissimos aperiam voluptas, modi aut excepturi ducimus magnam reiciendis eos vitae quos praesentium enim sit corporis.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur in doloremque ipsum ipsa cum dignissimos aperiam voluptas, modi aut excepturi ducimus magnam reiciendis eos vitae quos praesentium enim sit corporis.</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default withGoogle(Home);