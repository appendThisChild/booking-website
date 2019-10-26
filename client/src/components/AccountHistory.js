import React, {Component} from 'react'

import { withOwner } from "../context/OwnerProvider.js"
import { withUser } from "../context/UserProvider.js"

import ProfileNav from "./ProfileNav.js"
import AppointmentHistory from "./AppointmentHistory.js"

class AccontHistory extends Component {
    constructor(props){
        super(props)
        this.state = {
            presentMonth: new Date().getMonth() + 1,
            presentYear: new Date().getFullYear(),
            pastMonth: new Date().getMonth() + 1,
            pastYear: new Date().getFullYear(),
            presentToggle: 0,
            pastToggle: 0
        }
    }
    // get client history
    switchPresentMonth = (num) => {
        const { presentMonth, presentYear } = this.state
        if (num === 1 && presentMonth === 11){
            const dateData = {
                month: 0,
                year: presentYear + 1
            }
            this.props.getAccountTherapistHistory(this.props.searchedAccount._id, dateData, () => {
                this.setState(prevState => ({
                    presentYear: prevState.presentYear + 1,
                    presentMonth: 0,
                    presentToggle: prevState.presentToggle + num
                }))
            })
        } else if (num === -1 && presentMonth === 0){
            const dateData = {
                month: 11,
                year: presentYear - 1
            }
            this.props.getAccountTherapistHistory(this.props.searchedAccount._id, dateData, () => {
                this.setState(prevState => ({
                    presentYear: prevState.presentYear - 1,
                    presentMonth: 11,
                    presentToggle: prevState.presentToggle + num
                }))
            })
        } else {
            const dateData = {
                month: presentMonth + num,
                year: presentYear
            }
            this.props.getAccountTherapistHistory(this.props.searchedAccount._id, dateData, () => {
                this.setState(prevState => ({
                    presentMonth: prevState.presentMonth + num,
                    presentToggle: prevState.presentToggle + num
                }))
            })
        }
    }
    // get therapist history 
    switchPastMonth = (num) => {
        const { pastMonth, pastYear } = this.state
        if (num === 1 && pastMonth === 11){
            const dateData = {
                month: 0,
                year: pastYear + 1
            }
            this.props.getAccountClientHistory(this.props.searchedAccount._id, dateData, () => {
                this.setState(prevState => ({
                    pastYear: prevState.pastYear + 1,
                    pastMonth: 0,
                    pastToggle: prevState.pastToggle + num
                }))
            })
        } else if (num === -1 && pastMonth === 0){
            const dateData = {
                month: 11,
                year: pastYear - 1
            }
            this.props.getAccountClientHistory(this.props.searchedAccount._id, dateData, () => {
                this.setState(prevState => ({
                    pastYear: prevState.pastYear - 1,
                    pastMonth: 11,
                    pastToggle: prevState.pastToggle + num
                }))
            })
        } else {
            const dateData = {
                month: pastMonth + num,
                year: pastYear
            }
            this.props.getAccountClientHistory(this.props.searchedAccount._id, dateData, () => {
                this.setState(prevState => ({
                    pastMonth: prevState.pastMonth + num,
                    pastToggle: prevState.pastToggle + num
                }))
            })
        }
    }
    render(){
        const { searchedAccount, firstCharCap } = this.props
        const { presentToggle, pastToggle, pastMonth, pastYear, presentMonth, presentYear } = this.state
        const { searchedTherapistHistory, searchedClientHistory } = this.props
        const { switchPastMonth, switchPresentMonth } = this
        return(
            <div>
                <ProfileNav />
                {searchedAccount.firstName ? 
                <h1>{firstCharCap(searchedAccount.firstName)} {firstCharCap(searchedAccount.lastName)}</h1>
                :null}
                <h3>{searchedAccount.isTherapist ? "Therapist History" : "History"}</h3>
                {searchedAccount.isTherapist ?
                <AppointmentHistory 
                history={searchedTherapistHistory} 
                title={""} 
                subTitle={"Old to Oldest"} 
                future={false}
                therapist={false}
                client={false}
                owner={false}
                month={presentMonth} 
                year={presentYear} 
                toggle={presentToggle}
                switchMonth={switchPresentMonth}/>
                :null}
                <h3>{searchedAccount.isTherapist ? "Client History" : null}</h3>
                <AppointmentHistory 
                history={searchedClientHistory} 
                title={""} 
                subTitle={"Old to Oldest"} 
                future={false}
                client={true}
                therapist={false}
                owner={false} 
                month={pastMonth} 
                year={pastYear} 
                toggle={pastToggle}
                switchMonth={switchPastMonth}/>
            </div>
        )
    }
}

export default withUser(withOwner(AccontHistory));