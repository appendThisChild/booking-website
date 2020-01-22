import React from 'react'

import TherapistDisplay from "./TherapistDisplay"

const HomeTherapistSection = ({ subTitle }) => {
    return(
        <section>
            <TherapistDisplay />
            <main>
                <p>{subTitle}</p>
            </main>
        </section>
    )
}

export default HomeTherapistSection;