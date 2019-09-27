import React, {Component} from 'react'

import { withOwner } from "../context/OwnerProvider.js"
import { withUser } from "../context/UserProvider.js"

import ProfileNav from "./ProfileNav.js"
import AppointmentHistory from "./AppointmentHistory.js"

class AccontHistory extends Component {
    constructor(props){
        super(props)
        this.state = {
            searchedTherapistHistory: props.searchedTherapistHistory, 
            searchedClientHistory: props.searchedClientHistory,
            presentMonth: new Date().getMonth() + 1,
            presentYear: new Date().getFullYear(),
            pastMonth: new Date().getMonth() + 1,
            pastYear: new Date().getFullYear(),
            presentToggle: 0,
            pastToggle: 0
        }
    }

    switchPresentMonth = (num) => {
        const { presentMonth } = this.state
        if (num === 1 && presentMonth === 11){
            this.setState(prevState => ({
                presentYear: prevState.presentYear + 1,
                presentMonth: 0,
                presentToggle: prevState.presentToggle + num
            }))
        } else if (num === -1 && presentMonth === 0){
            this.setState(prevState => ({
                presentYear: prevState.presentYear - 1,
                presentMonth: 11,
                presentToggle: prevState.presentToggle + num
            }))
        } else {
            this.setState(prevState => ({
                presentMonth: prevState.presentMonth + num,
                presentToggle: prevState.presentToggle + num
            }))
        }
    }
    switchPastMonth = (num) => {
        const { pastMonth } = this.state
        if (num === 1 && pastMonth === 11){
            this.setState(prevState => ({
                pastYear: prevState.pastYear + 1,
                pastMonth: 0,
                pastToggle: prevState.pastToggle + num
            }))
        } else if (num === -1 && pastMonth === 0){
            this.setState(prevState => ({
                pastYear: prevState.pastYear - 1,
                pastMonth: 11,
                pastToggle: prevState.pastToggle + num
            }))
        } else {
            this.setState(prevState => ({
                pastMonth: prevState.pastMonth + num,
                pastToggle: prevState.pastToggle + num
            }))
        }
    }
    render(){
        const { searchedAccount, firstCharCap } = this.props
        const { searchedTherapistHistory, searchedClientHistory, presentMonth, pastMonth, presentYear, pastYear, presentToggle, pastToggle } = this.state
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
                client={true}
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