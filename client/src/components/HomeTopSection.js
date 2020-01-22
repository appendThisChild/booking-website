import React from 'react'

const HomeTopSection = ({ content, history }) => {
const mappedContent = content.map((para, i) => <p key={i}>{para}</p>)
    return(
        <main>
            <div>
                <button onClick={() => history.push("/book")}>Book a Massage</button>
                {mappedContent}
            </div>
        </main>
    )
}

export default HomeTopSection;