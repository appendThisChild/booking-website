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
                toast.success(res.message, {
                    transition: Slide
                })
            }
        })
    }
    render(){
        const { email, name, message, rating } = this.state
        return(
            <form onSubmit={this.handleSubmit}>
                <ToastContainer autoClose={10000} />
                <h2>Give us a review!</h2>
                <p>We appreciate your feedback!</p>
                <StarRatings
                    rating={rating}
                    starDimension="25px"
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
                    rows="4" 
                    cols="50"
                    placeholder="Comment..." 
                    required={true}
                />
                <button>Submit</button>
            </form>
        )
    }
}

export default withReview(Reviews);