import React, { Component } from 'react'

import { withOwner } from "../context/OwnerProvider.js"

import ProfileNav from './ProfileNav';
import Account from "./Account.js"

class AllAccounts extends Component {
    constructor(){
        super()
        this.state = {

        }
    }
    sendToAccount = () => {
        this.props.history.push("/accountHistory")
    }

    componentDidMount(){
        this.props.getAllAccounts()
    }
    render(){
        const { accounts } = this.props
        const owners = accounts.filter(account => account.isOwner === true && account.isTherapist === false)
        const therapists = accounts.filter(account => account.isTherapist === true)
        const clients = accounts.filter(account => account.isTherapist === false && account.isOwner === false)
        const mappedOwners = owners.map(account => <Account key={account._id} {...account} callback={this.sendToAccount}/>)
        const mappedTherapists = therapists.map(account => <Account key={account._id} {...account} callback={this.sendToAccount}/>)
        const mappedClients = clients.map(account => <Account key={account._id} {...account} callback={this.sendToAccount}/>)
        return(
            <div>
                <ProfileNav />
                <h2>Therapists: </h2>
                {mappedTherapists}
                <h2>Clients: </h2>
                {mappedClients}
                <h2>Owners: </h2>
                {mappedOwners}
            </div>
        )
    }
}

export default withOwner(AllAccounts);