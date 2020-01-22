import React from 'react'
import StarRatings from 'react-star-ratings'


const HomeReviewsSection = ({ reviews, rating, showMore, reviewsShown, numberOfReviews }) => {
    const mappedReviews = reviews.map((review, i) => {
        if (i < reviewsShown){
            const month = new Date(review.createdAt).getMonth()
            const date = new Date(review.createdAt).getDate()
            const year = new Date(review.createdAt).getFullYear()
            return(
                <div key={i}>
                    <div>
                        <StarRatings
                            rating={review.rating}
                            starRatedColor="rgb(182, 0, 182)"
                            starDimension="18px"
                            starSpacing="0px"
                        />
                        <span> - {review.rating}/5</span>
                    </div>
                    <h3>{review.name}</h3> 
                    <p> ~ {review.message}</p>
                    <p> - {month + 1}/{date}/{year}</p>
                </div>
            )
        } else {
            return null
        }
    })
    return(
        <aside>
            <h1>Reviews</h1>
            <span>{numberOfReviews} Reviews</span>
            <div>
                <StarRatings 
                    rating={rating}
                    starRatedColor="rgb(219, 0, 219)"
                    starDimension="30px"
                    starSpacing="2px"
                />
                <span> - {rating}/5</span>
            </div>
            <section className="reviewsByThree">
                {mappedReviews}
            </section>
            <span onClick={showMore} className="addReviews">Show more</span>
        </aside>
    )
}

export default HomeReviewsSection;