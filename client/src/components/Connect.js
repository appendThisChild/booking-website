// Provider
import { useAffiliate } from "../context/AffiliateProvider.js"

const Connect = props => {
    const { id } = props.match.params
    const { updateAffiliateVisit } = useAffiliate()
    updateAffiliateVisit(id)
    localStorage.connect = JSON.stringify({ id, expiry_date: new Date()})
    props.history.push("/")
    return null
}

export default Connect;