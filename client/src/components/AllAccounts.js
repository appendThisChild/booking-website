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
    getHistory = (_id, isTherapist) => {
        this.props.history.push(`/accountHistory/${_id}`)
    }
    componentDidMount(){
        this.props.getAllAccounts()
    }
    render(){
        const { accounts } = this.props
        accounts.sort((a, b)=> {
            const x = a.lastName.toLowerCase();
            const y = b.lastName.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        })
        const owners = accounts.filter(account => account.isOwner === true && account.isTherapist === false)
        const therapists = accounts.filter(account => account.isTherapist === true)
        const clients = accounts.filter(account => account.isTherapist === false && account.isOwner === false)
        const mappedOwners = owners.map((account, i) => <Account key={account._id} order={i} {...account} getHistory={this.getHistory}/>)
        const mappedTherapists = therapists.map((account, i) => <Account key={account._id} order={i} {...account} getHistory={this.getHistory}/>)
        const mappedClients = clients.map((account, i) => <Account key={account._id} order={i} {...account} getHistory={this.getHistory}/>)
        return(
            <div>
                <ProfileNav isOn={4}/>
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