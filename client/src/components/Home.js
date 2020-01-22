import React, { Component } from "react"

import HomeTopSection from "./HomeTopSection.js"
import HomeTherapistSection from "./HomeTherapistSection.js"

import { withGoogle } from "../context/GoogleCalendarProvider.js"
import { withGeneral } from '../context/GeneralInfoProvider.js'
import { withReview } from "../context/ReviewProvider.js"
import HomeReviewsSection from "./HomeReviewsSection.js"

class Home extends Component {
    constructor(){
        super()
        this.state = {
            reviewsShown: 2
        }
    }
    showMore = () => {
        this.setState(prevState => ({ reviewsShown: prevState.reviewsShown + 2 }))
    }
    componentDidMount(){
        window.scroll(0,0)
    }
    render(){
        const { homeTitle, homeInfo, homeTherapistSubtitle } = this.props.genInfo
        const { reviews, rating, numberOfReviews, history } = this.props
        
        return(
            <div className="home">
                <div className="firstDivide">
                    <div>
                        <h1>{homeTitle}</h1>
                    </div>
                </div>
                <HomeTopSection content={homeInfo} history={history} />
                <div className="secondDivide">
                    <div>
                        <h1>Love YOU and your Body</h1>
                    </div>
                </div>
                <HomeTherapistSection subTitle={homeTherapistSubtitle} />
                <HomeReviewsSection numberOfReviews={numberOfReviews} reviews={reviews} rating={rating} showMore={this.showMore} reviewsShown={this.state.reviewsShown}/>
            </div>
        )
    }
}

export default withReview(withGeneral(withGoogle(Home)));