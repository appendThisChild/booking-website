import React, { Component } from "react"

import TherapistDisplay from "./TherapistDisplay"

import { withGoogle } from "../context/GoogleCalendarProvider.js"
import { withGeneral } from '../context/GeneralInfoProvider.js'
import { withReview } from "../context/ReviewProvider.js"

class Home extends Component {
    constructor(){
        super()
        this.state = {
            
        }
    }
    
    // 1.) Create 'intake' object for appointment booked finish section
        // update appointment model
        // add route
        // add in info to therapist/owner appointment details


    // 2.) add in review ability for customers... 
        // create seperate portal to backend
            // checking for unique emails
            // adding title & comments section
            // adding in stars

    // 4.) Style
        

    render(){
        const { homeTitle, homeInfo, homeTherapistSubtitle } = this.props.genInfo
        const mappedHomeInfo = homeInfo.map((para, i) => <p key={i}>{para}</p>)
        // map through three of the reviews and reveal 3 with additional clicks
        console.log(this.props.reviews)
        return(
            <div className={"bodyBackground"}>
                <div className={"homeBorder"}>
                    <div className={`homeContainer ${"homeContainer1"}`}>
                        <h1>{homeTitle}</h1>
                        {mappedHomeInfo}
                    </div>
                    <div className={"homeContainer2"}>
                        <h1>Our Therapists</h1>
                        <p>{homeTherapistSubtitle}</p>
                        <TherapistDisplay />
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

export default withReview(withGeneral(withGoogle(Home)));