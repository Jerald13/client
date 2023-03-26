import React from "react"
import EventScanner from "./EventScanner"

function App(props) {
    const abi = [] // replace with your contract ABI

    return (
        <div>
            <h1>My Dapp</h1>
            <EventScanner abi={abi} />
        </div>
    )
}

export default App
