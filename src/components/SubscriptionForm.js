import React, { useState, useEffect } from "react"
import Web3 from "web3"
import { ethers } from "ethers"

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
    },
    heading: {
        fontSize: "28px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "20px",
        fontFamily: "Montserrat, sans-serif",
    },
    eventList: {
        listStyleType: "none",
        padding: "0",
        margin: "0",
        textAlign: "center",
    },
    buyForm: {
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "5px",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    label: {
        marginBottom: "10px",
        textAlign: "left",
    },
    input: {
        marginLeft: "10px",
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        boxShadow: "0 0 2px 1px #ccc",
        fontFamily: "Arial, sans-serif",
    },
    button: {
        backgroundColor: "#4CAF50",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        marginTop: "10px",
        fontFamily: "Arial, sans-serif",
    },
}

const contractAbi = require("../../src/contracts/MyContract.json").abi
const { MyContract: contractAddress } = require("../../src/contracts/contract-address.json")
function SubscriptionForm({ alchemyKey }) {
    const [contractAddressInput, setContractAddress] = useState("")
    const [eventSignatureInput, setEventSignature] = useState("")
    const [subscribedEvents, setSubscribedEvents] = useState([])
    const [web3, setWeb3] = useState(null)
    const [productId, setProductId] = useState("")
    const [amount, setAmount] = useState("")
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
        handleSubscription(contractAddressInput, eventSignatureInput)
    }

    // const handleBuyProductFormSubmit = async (event) => {
    //     event.preventDefault()
    //     handleBuyProduct(productId, amount)
    // }

    const handleBuyProductFormSubmit = async (event) => {
        event.preventDefault()
        if (!web3) {
            return alert("Web3 is not initialized")
        }

        try {
            let accounts = []
            if (window.ethereum) {
                accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
            } else {
                accounts = await web3.eth.getAccounts()
            }
            const web3Instance = new Web3(window.ethereum)
            const contract = new web3Instance.eth.Contract(contractAbi, contractAddress)
            const amountTest = ethers.utils.parseEther((0.0005).toString())
            const transaction = await contract.methods.buyProduct(productId, amountTest).send({
                from: accounts[0],
                value: ethers.utils.parseEther((0.0005).toString()),
            })
            console.log(`Transaction hash: ${transaction.transactionHash}`)
        } catch (error) {
            console.log(`Error: ${error.message}`)
        }
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Subscribed events</h1>
            <ul style={styles.eventList}>
                {subscribedEvents.map((event, index) => (
                    <li key={index}>{JSON.stringify(event)}</li>
                ))}
            </ul>

            <h2 style={styles.heading}>Buy a product</h2>
            <form onSubmit={handleBuyProductFormSubmit} style={styles.buyForm}>
                <div style={styles.label}>
                    <label htmlFor="productId">Product ID:</label>
                    <input
                        type="number"
                        id="productId"
                        value={productId}
                        onChange={(event) => setProductId(event.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.label}>
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>
                    Buy
                </button>
            </form>
        </div>
    )
}

export default SubscriptionForm
