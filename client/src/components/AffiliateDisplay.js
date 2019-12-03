import React, { useEffect } from 'react'
import CreateAffiliate from './CreateAffiliate'

// Provider
import { useAffiliate } from "../context/AffiliateProvider.js"
import Affiliate from './Affiliate.js'

const AffiliateDisplay = () => {
    const { affiliates, getAffiliates, postAffiliate, deleteAffiliate } = useAffiliate()

    useEffect(() => {
        getAffiliates()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const mappedAffiliates = affiliates.map((affiliate, i) => <Affiliate key={affiliate._id} display={i + 1} handleDelete={deleteAffiliate} {...affiliate} />)
    return(
        <section>
            <h2>Affiliates</h2>
            <CreateAffiliate submit={postAffiliate} />
            {mappedAffiliates}
        </section>
    )
}

export default AffiliateDisplay;