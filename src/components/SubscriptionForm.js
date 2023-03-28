import React, { useState, useEffect } from "react"
import Web3 from "web3"

function SubscriptionForm({ alchemyKey }) {
    const [contractAddress, setContractAddress] = useState("")
    const [eventSignature, setEventSignature] = useState("")
    const [subscribedEvents, setSubscribedEvents] = useState([])
    const [web3, setWeb3] = useState(null)

    useEffect(() => {
        const initWeb3 = async () => {
            // Connect to Alchemy WebSocket endpoint
            const provider = new Web3.providers.WebsocketProvider(
                `wss://eth-sepolia.g.alchemy.com/v2/0qa4mNIYOwQeUgs1nJl3_X6sDRcuPkuE`
            )
            const web3Instance = new Web3(provider)
            setWeb3(web3Instance)
        }
        initWeb3()
    }, [alchemyKey])

    const handleSubscription = async (contractAddress, eventSignature) => {

        let options = {
            fromBlock: 0,
            address: ["0xecd7157835da1f093b6e5fc8d5a020ae8a2b2740"], //Only get events from specific addresses
            topics: ["0xc032f62758cac23a902e648ab54b6825665b9bc19e7cd0a8ab915cbf3eea4fa0"], //What topics to subscribe to
        }

        let subscription = web3.eth.subscribe("logs", options, (err, event) => {
            if (!err) console.log(event)
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        handleSubscription(contractAddress, eventSignature)
    }

    return (
        <div>
            <h2>Subscribe to events</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Contract address:
                    <input
                        type="text"
                        value={contractAddress}
                        onChange={(event) => setContractAddress(event.target.value)}
                    />
                </label>
                <br />
                <div style={{ border: "1px solid black", padding: "10px" }}>
                    <label style={{ display: "block", marginBottom: "10px" }}>
                        Event signature:
                    </label>
                    <input
                        type="text"
                        value={eventSignature}
                        onChange={(event) => setEventSignature(event.target.value)}
                    />
                </div>
                <br />
                <button type="submit">Subscribe</button>
            </form>
            <h2>Subscribed events</h2>
            <ul>
                {subscribedEvents.map((event, index) => (
                    <li key={index}>{JSON.stringify(event)}</li>
                ))}
            </ul>
        </div>
    )
}

export default SubscriptionForm
