import React, { useContext, useState } from 'react'
import axios from "axios"

const AffiliateContext = React.createContext()

const AffiliateProvider = props => {
    const [affiliates, setAffiliates] = useState([])

    const getAffiliates = () => {
        axios.get('/affiliate')
            .then(res => setAffiliates(res.data))
            .catch(err => console.log(err.response.data.errMsg))
    }
    const postAffiliate = data => {
        axios.post('/affiliate', data)
            .then(res => setAffiliates([...affiliates, res.data]))
            .catch(err => console.log(err.response.data.errMsg))
    }
    const updateAffiliateVisit = id => {
        axios.put(`/affiliate/visits/${id}`)
    }
    const updateAffiliatePurchase = (id, data) => {
        axios.put(`/affiliate/purchase/${id}`, data)
    }
    const deleteAffiliate = id => {
        axios.delete(`/affiliate/${id}`)
            .then(res => setAffiliates(affiliates.filter(affiliates => affiliates._id !== res.data._id)))
            .catch(err => console.log(err.response.data.errMsg))
    }
    return(
        <AffiliateContext.Provider 
            value={{
                affiliates,
                getAffiliates,
                postAffiliate,
                updateAffiliateVisit,
                updateAffiliatePurchase,
                deleteAffiliate
            }}
            {...props}
        />
    )
}

const useAffiliate = () => {
    const context = useContext(AffiliateContext)
    if (!context){
        throw new Error("You must use Provider to consume Context")
    }
    return context
}

export { AffiliateProvider, useAffiliate }