import React from 'react'


const Affiliate = ({ display, _id, name, visitsUsing, purchases, handleDelete }) => {
    const handleFocus = e => e.target.select();
    return(
        <aside>
            <h3>{display}.) {name}</h3>
            <div>
                <h4>Visits using link:</h4>
                <p>{visitsUsing}</p>
                <h4>Purchases made with link:</h4>
                <p>60-Min Single: {purchases[0][0]}</p>
                <p>60-Min Triple: {purchases[0][1]}</p>
                <p>90-Min Single: {purchases[1][0]}</p>
                <p>90-Min Triple: {purchases[1][1]}</p>
                <p>120-Min Single: {purchases[2][0]}</p>
                <p>120-Min Triple: {purchases[2][1]}</p>
                <h4>Affiliate Link:</h4>
                <input readOnly value={`https://www.mtmscheduling.com/connect/${_id}`} onFocus={handleFocus}/>
            </div>
            <button onClick={() => handleDelete(_id)}>delete</button>
        </aside>
    )
}

export default Affiliate;