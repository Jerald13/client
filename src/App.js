import React, { useState, useEffect } from "react"
import { Container, Table } from "react-bootstrap"
import Web3 from "web3"
import EventsTable from "./components/EventsTable"

const contractAddress = require("../src/contracts/contract-address.json").CM
const contractAbi = require("../src/contracts/CM.json").abi

function App() {
    const [logs, setLogs] = useState([])
    const [contractAddressInput, setContractAddressInput] = useState("")
    const [eventSignature, setEventSignature] = useState("")

    const provider = new Web3.providers.HttpProvider(
        "https://eth-goerli.g.alchemy.com/v2/J0r4HncWaCOXf0EsYHEnDz26fj3Sla3i"
    ) // Update with correct address
    const web3 = new Web3(provider)
    const contract = new web3.eth.Contract(contractAbi, contractAddress)

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            contract.events[eventSignature]((error, event) => {
                // Update event name
                if (error) {
                    console.log(error)
                } else {
                    setLogs((prevLogs) => [...prevLogs, event.returnValues])
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddressChange = (event) => {
        setContractAddressInput(event.target.value)
    }

    const handleSignatureChange = (event) => {
        setEventSignature(event.target.value)
    }

    return (
        <div className="App">
            <h1>Ethereum Event Scanner</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Contract Address:
                    <input
                        type="text"
                        value={contractAddressInput}
                        onChange={handleAddressChange}
                    />
                </label>
                <label>
                    Event Signature:
                    <input type="text" value={eventSignature} onChange={handleSignatureChange} />
                </label>
                <button type="submit">Subscribe</button>
            </form>
            <EventsTable events={logs} />
        </div>
    )
}
export default App
