import React, { useState, useEffect } from "react"
import Web3 from "web3"
import "../src/index.css"
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

    const handleConnect = async () => {
        if (!window.ethereum) {
            alert("MetaMask not detected!")
            return
        }

        try {
            // Request account access
            await window.ethereum.enable()
            const web3Instance = new Web3(window.ethereum)
            setWeb3(web3Instance)

            // Load the marketplace contract
            const contractInstance = new web3Instance.eth.Contract(contractAbi, contractAddress)
            setMarketplaceContract(contractInstance)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDisconnect = () => {
        setWeb3(null)
        setMarketplaceContract(null)
        setSubscribedEvents([])
    }

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
                    // Extract the transaction hash from the result
                    const { transactionHash, ...eventData } = result

                    // Create a new object with both the event data and transaction hash
                    const eventWithTxHash = { transactionHash, ...eventData }
                    setSubscribedEvents((prevEvents) => [...prevEvents, eventWithTxHash])
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
        try {
            if (marketplaceContract) {
                // Get all past ProductBought events and add them to subscribedEvents state
                marketplaceContract
                    .getPastEvents("ProductBought", {
                        fromBlock: 0,
                        toBlock: "latest",
                    })
                    .then((events) => {
                        setSubscribedEvents(events)
                    })

                // listen to the ProductBought event
                marketplaceContract.events.ProductBought((error, event) => {
                    if (!error) {
                        console.log("Event received:", event)
                        // const eventData = web3.eth.contractAbi.decodeLog(
                        //     event.raw.data,
                        //     event.raw.topics.slice(1),
                        //     subscribedEvents.find((e) => e.name === event.event)?.contractAbi?.inputs
                        // )
                        console.log(
                            `Product ${event.returnValues.productId} bought by ${event.returnValues.buyer} for ${event.returnValues.pricePerProduct} wei`
                        )
                        // ${event.returnValues.amount}
                        // Add the event to the subscribedEvents array
                        setSubscribedEvents((prevEvents) => [...prevEvents, event])
                    }
                })
            }
        } catch (error) {
            console.log
        }
    }, [marketplaceContract])

    return (
        <div className="App">
            <header className="App-header">
                {web3 ? (
                    <button onClick={handleDisconnect}>Disconnect</button>
                ) : (
                    <button onClick={handleConnect}>Connect</button>
                )}
            </header>
            {/* <NavigationBar /> */}
            <SubscriptionForm onSubmit={handleSubscription} buyProduct={buyProduct} />

            <table>
                <thead>
                    <tr>
                        <th>Event ID</th>
                        <th>Transaction Hash</th>
                        <th>Transaction From</th>
                        <th>Contract Address</th>
                        <th>Event Signature</th>
                        <th>Buyer</th>
                        <th>Product ID</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {subscribedEvents.map((event, index) => (
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{event.transactionHash}</td>
                            <td>{event.address}</td>
                            <td>{event.signature}</td>
                            <td>{event.returnValues.buyer}</td>
                            <td>{event.returnValues.productId}</td>
                            <td>{event.returnValues.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default App
