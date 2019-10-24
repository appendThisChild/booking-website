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
    showMore = () => {
        this.setState(prevState => ({ reviewsShown: prevState.reviewsShown + 3 }))
    }
    render(){
        const { homeTitle, homeInfo, homeTherapistSubtitle } = this.props.genInfo
        const mappedHomeInfo = homeInfo.map((para, i) => <p key={i}> {para}</p>)
        const mappedReviews = this.props.reviews.map((review, i) => {
            if (i < this.state.reviewsShown){
                const month = new Date(review.createdAt).getMonth()
                const date = new Date(review.createdAt).getDate()
                const year = new Date(review.createdAt).getFullYear()
                return(
                    <div key={i} className="reviewItem">
                        <div className="ratings2">
                            <StarRatings
                                rating={review.rating}
                                starRatedColor="gold"
                                starDimension="20px"
                                starSpacing="0px"
                            />
                            <span> - {review.rating}/5</span>
                        </div>
                        <h3>{review.name}</h3> 
                        <p> ~ {review.message}</p>
                        <p> - {month}/{date}/{year}</p>
                    </div>
                )
            } else {
                return null
            }
        })
        return(
            <div className={"bodyBackground"}>
                <div className={"homeBorder"}>
                    <div className={`homeContainer ${"homeContainerInside"}`}>
                        <div>
                            <h1>{homeTitle}</h1>
                            {mappedHomeInfo}
                        </div>
                    </div>
                    <div className={`homeContainer ${"homeContainerInside"}`}>
                        <div>
                            <h1>Our Therapists</h1>
                            <p>{homeTherapistSubtitle}</p>
                            <TherapistDisplay />
                        </div>
                    </div>
                    <div className={`homeContainer`}>
                        <div>
                            <h1>Reviews</h1>
                            <div className="ratings">
                                <StarRatings 
                                    rating={this.props.rating}
                                    starRatedColor="gold"
                                    starDimension="35px"
                                    starSpacing="2px"
                                />
                                <span> - {this.props.rating}/5</span>
                            </div>
                            {mappedReviews}
                            <span onClick={this.showMore} className="addReviews">Show more</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withReview(withGeneral(withGoogle(Home)));