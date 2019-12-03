import { useAffiliate } from "../context/AffiliateProvider.js"

const CheckingAffiliate = ({ appointment }) => {
    const { updateAffiliatePurchase } = useAffiliate()
    const affiliate = JSON.parse(localStorage.getItem('connect'))
    if (affiliate){
        const today = new Date()
        const yesterday = new Date(today.setDate(today.getDate() - 1))
        const expiry = new Date(affiliate.expiry_date)
        if (expiry > yesterday && appointment.packageChoice > 0){
            let index1 = 0
            if (appointment.appLengthInMinutes === 90){
                index1 = 1
            } else if (appointment.appLengthInMinutes === 120){
                index1 = 2
            }
            const data = {index: [index1, appointment.packageChoice - 1]}
            updateAffiliatePurchase(affiliate.id, data)
        } 
    }
    return null
}

export default CheckingAffiliate;