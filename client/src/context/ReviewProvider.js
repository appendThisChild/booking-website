import React, { Component } from 'react'
import axios from 'axios';

const ReviewContext = React.createContext()

class ReviewProvider extends Component {
    constructor(){
        super()
        this.state = {
            reviews: [],
            rating: 5,
            numberOfReviews: 0
        }
    }
    getReviews = callback => {
        axios.get('/reviews')
            .then(res => this.setState({ reviews: res.data.reviews, rating: res.data.rating, numberOfReviews: res.data.numberOfReviews }, () => callback()))
            .catch(err => console.log(err.response.data.errMsg))
    }
    postReview = (data, callback) => {
        axios.post('/reviews', data)
            .then(() => { 
                // create local storage for reviews
                localStorage.review = JSON.stringify(false)
                callback({ message: "Thanks! Review Submitted!" }) 
            })
            .catch(err => { 
                console.log(err.response.data.errMsg)
                callback({ error: 'Something Went Wrong!' }) 
            })
    }

    render(){
        return(
            <ReviewContext.Provider
                value={{
                    ...this.state,
                    getReviews: this.getReviews,
                    postReview: this.postReview
                }}>
                {this.props.children}
            </ReviewContext.Provider>
        )
    }
}

export default ReviewProvider;

export const withReview = C => props => (
    <ReviewContext.Consumer>
        {value => <C {...value} {...props}/>}
    </ReviewContext.Consumer>
)