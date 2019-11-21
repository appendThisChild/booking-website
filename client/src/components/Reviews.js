import React, { Component} from 'react'
import StarRatings from 'react-star-ratings'
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import { withReview } from "../context/ReviewProvider.js"

class Reviews extends Component {
    constructor(){
        super()
        this.state = {
            email: "",
            name: "",
            message: "",
            rating: 5
        }
    }
    handleChange = e => {
        const value = e.target.value
        const name = e.target.name
        this.setState({ [name]: value})
    }
    handleRatingChange = (newRating, name) => {
        this.setState({ [name]: newRating })
    }
    handleSubmit = e => {
        e.preventDefault()
        const { email, name, message, rating } = this.state
        let nameUsed = name
        if (name === ""){
            nameUsed = "Anonymous"
        }
        const newReview = {
            email,
            name: nameUsed,
            message,
            rating
        }
        this.props.postReview(newReview, (res) => {
            if (res.error){
                toast.error(res.error, {
                    transition: Slide
                })
            } else {
                window.location.reload();
            }
        })
    }
    componentDidMount(){
        if (JSON.parse(localStorage.getItem('review')) === null){
            localStorage.review = JSON.stringify(true)
            window.location.reload();
        }
    }
    render(){
        const { email, name, message, rating } = this.state
        return(
            <div className="reviewPage">
                {JSON.parse(localStorage.getItem('review')) ?
                <form onSubmit={this.handleSubmit}>
                    <ToastContainer autoClose={10000} />
                    <h2>Give us a review!</h2>
                    <span>We appreciate your feedback!</span>
                    <StarRatings
                        rating={rating}
                        starDimension="30px"
                        changeRating={this.handleRatingChange}
                        name="rating"
                    />
                    <p>Email:</p>
                    <input type="email" name="email" value={email} onChange={this.handleChange} required={true}  placeholder="Email"/>
                    <p>First name (or leave blank):</p>
                    <input type="text" name="name" value={name} onChange={this.handleChange} placeholder="First Name"/>
                    <p>Comment:</p>
                    <textarea 
                        name="message"
                        value={message}
                        onChange={this.handleChange}
                        placeholder="Comment..." 
                        required={true}
                    />
                    <button>Submit</button>
                </form>
                :
                <main>
                    <h2>Your Review was Submitted!</h2>
                    <p>We appreciate you taking the time to leave us a review. Your feedback is very important to us.</p>
                    <h3>Thank you!</h3>
                </main>
                }
            </div>
        )
    }
}

export default withReview(Reviews);