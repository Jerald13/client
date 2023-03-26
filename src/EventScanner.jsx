import React, { useState } from "react"
import { ethers } from "ethers"

function EventScanner(props) {
    const [contractAddress, setContractAddress] = useState("")
    const [eventSignature, setEventSignature] = useState("")
    const [events, setEvents] = useState([])

    async function subscribe() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(contractAddress, props.abi, provider)

        contract.on(eventSignature, (...args) => {
            const event = {
                name: eventSignature,
                args: args,
            }
            setEvents([event, ...events])
        })
    }

    return (
        <div>
            <h2>Event Scanner</h2>
            <label>
                Contract Address:
                <input
                    type="text"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                />
            </label>
            <br />
            <label>
                Event Signature:
                <input
                    type="text"
                    value={eventSignature}
                    onChange={(e) => setEventSignature(e.target.value)}
                />
            </label>
            <br />
            <button onClick={subscribe}>Subscribe</button>
            <br />
            <h3>Event Logs</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Arguments</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event, index) => (
                        <tr key={index}>
                            <td>{event.name}</td>
                            <td>{JSON.stringify(event.args)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default EventScanner
