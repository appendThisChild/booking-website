import React, { Component } from "react"
import StarRatings from 'react-star-ratings'

import TherapistDisplay from "./TherapistDisplay"

import { withGoogle } from "../context/GoogleCalendarProvider.js"
import { withGeneral } from '../context/GeneralInfoProvider.js'
import { withReview } from "../context/ReviewProvider.js"

class Home extends Component {
    constructor(){
        super()
        this.state = {
            reviewsShown: 3
        }
    }

    // 1.) Show intake form in each appointment 
    
    // 2.) Style


    showMore = () => {
        this.setState(prevState => ({ reviewsShown: prevState.reviewsShown + 3 }))
    }

    render(){
        const { homeTitle, homeInfo, homeTherapistSubtitle } = this.props.genInfo
        const mappedHomeInfo = homeInfo.map((para, i) => <p key={i}>{para}</p>)
        const mappedReviews = this.props.reviews.map((review, i) => {
            if (i < this.state.reviewsShown){
                const month = new Date(review.createdAt).getMonth()
                const date = new Date(review.createdAt).getDate()
                const year = new Date(review.createdAt).getFullYear()
                return(
                    <div key={i}>
                        <h3>{review.name}</h3> 
                        <StarRatings
                            rating={review.rating}
                            starRatedColor="gold"
                            starDimension="20px"
                            starSpacing="0px"
                        />
                        <span> {review.rating}/5</span>
                        <p> ~ "{review.message}"</p>
                        <p>{month}/{date}/{year}</p>
                    </div>
                )
            } else {
                return null
            }
        })
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
                        <StarRatings 
                            rating={this.props.rating}
                            starRatedColor="gold"
                            starDimension="30px"
                            starSpacing="3px"
                        />
                        <span> - {this.props.rating}/5</span>
                        {mappedReviews}
                        <span onClick={this.showMore}>Show more</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withReview(withGeneral(withGoogle(Home)));