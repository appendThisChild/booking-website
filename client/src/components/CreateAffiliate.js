import React, { useState } from 'react'

const CreateAffiliate = ({ submit }) => {
   const [affiliate, setAffiliate] = useState("")

    const handleSubmit = e => {
        e.preventDefault()
        submit({ name: affiliate })
    }
    
    return(
        <form onSubmit={handleSubmit}>
            <h3>Create Affiliate</h3>
            <input type="text" value={affiliate} onChange={e => setAffiliate(e.target.value)} required={true} placeholder="Name of Affliate..." />
            <button>Create </button>
        </form>
    )
}

export default CreateAffiliate;