import React from "react"

const Footer = () => {
    return(
        <div className={"footer"}>
            <div>
                <p className={"ryanLink"} onClick={() => window.open("https://www.pettingill-industries.com/")}>&#169; 2020 Pettingill Industries</p>
                <p>&#169; 2020 Blissed Out Body Work</p>
                <p> All rights reserved.</p>
            </div>
        </div>
    )
}

export default Footer; 