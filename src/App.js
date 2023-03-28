import React, { useState, useEffect } from "react"
import Web3 from "web3"
import SubscriptionForm from "./components/SubscriptionForm"
const ethers = require("ethers")
const contractAbi = require("../src/contracts/MyContract.json").abi
const { MyContract: contractAddress } = require("../src/contracts/contract-address.json")
// import NavigationBar from "../src/components/NavigationBar"

function App() {
    const [web3, setWeb3] = useState(null)
    const [marketplaceContract, setMarketplaceContract] = useState(null)
    const [subscribedEvents, setSubscribedEvents] = useState([])

    useEffect(() => {
        async function connectToWeb3() {
            if (window.ethereum) {
                // Use MetaMask provider
                const web3Instance = new Web3(window.ethereum)
                try {
                    // Request account access
                    await window.ethereum.enable()
                    setWeb3(web3Instance)

                    // Load the marketplace contract
                    const contractInstance = new web3Instance.eth.Contract(
                        contractAbi,
                        contractAddress
                    )
                    setMarketplaceContract(contractInstance)
                } catch (error) {
                    console.error(error)
                }
            } else {
                // Use Alchemy provider
                const provider = new Web3.providers.HttpProvider(
                    "https://eth-sepolia.g.alchemy.com/v2/0qa4mNIYOwQeUgs1nJl3_X6sDRcuPkuE"
                    //connect to the network and make transactions or interact with smart contracts.
                )
                const web3Instance = new Web3(provider)
                setWeb3(web3Instance)

                // Load the marketplace contract
                const contractInstance = new web3Instance.eth.Contract(
                    contractAbi,
                    contractAddress
                )
                setMarketplaceContract(contractInstance)
            }
        }

        connectToWeb3()
    }, [])

    const handleSubscription = async (contractAddress, eventSignature) => {
        // Subscribe to the specified event on the marketplace contract
        const subscription = web3.eth.subscribe(
            "logs",
            {
                address: ["0xecd7157835da1f093b6e5fc8d5a020ae8a2b2740"],
                topics: ["0xc032f62758cac23a902e648ab54b6825665b9bc19e7cd0a8ab915cbf3eea4fa0"],
            },
            (error, result) => {
                console.log("Event signature:", eventSignature)
                if (!error) {
                    // Add the event to the subscribedEvents array
                    console.log("Received event:", result)
                    setSubscribedEvents((prevEvents) => [...prevEvents, result])
                } else {
                    console.error("Error in subscription:", error)
                }
            }
        )
        // Unsubscribe from the event when the component unmounts
        return () => subscription.unsubscribe()
    }

    const buyProduct = async (productId, amount, pricePerProduct) => {
        if (!web3) {
            return
        }

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        // const account = accounts[0]
        const [account] = await web3.eth.getAccounts()

        const provider = new ethers.providers.Web3Provider(web3.currentProvider)
        const signer = provider.getSigner(account)

        const contract = new ethers.Contract(contractAddress, contractAbi, signer)
        const tx = await contract.buyProduct(productId, amount, {
            value: amount * pricePerProduct,
        })
        await tx.wait()
        console.log(tx)
    }

    useEffect(() => {
        if (marketplaceContract) {
            // listen to the ProductBought event
            marketplaceContract.events.ProductBought((error, event) => {
                if (!error) {
                    console.log(
                        `Product ${event.returnValues.productId} bought by ${event.returnValues.buyer} for ${event.returnValues.amount} wei`
                    )
                    // Add the event to the subscribedEvents array
                    setSubscribedEvents((prevEvents) => [...prevEvents, event])
                }
            })
        }
    }, [marketplaceContract])

    return (
        <div className="App">
            {/* <NavigationBar /> */}
            <h1>Marketplace Event Subscriber</h1>
            <SubscriptionForm onSubmit={handleSubscription} buyProduct={buyProduct} />
            {subscribedEvents.map((event) => (
                <div key={event.transactionHash}>
                    <h2>New event:</h2>
                    <p>Transaction hash: {event.transactionHash}</p>
                    <p>Buyer address: {event.topics[1]}</p>
                    <p>Product ID: {web3.utils.hexToNumber(event.topics[2])}</p>
                    <p>Amount: {web3.utils.hexToNumber(event.data)}</p>
                </div>
            ))}
        </div>
    )
}

export default App
