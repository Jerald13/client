import React, { useState, useRef } from "react"
import SignatureCanvas from "react-signature-canvas"

function SubscriptionForm({ onSubmit, buyProduct }) {
  const [contractAddress, setContractAddress] = useState("")
  const [productId, setProductId] = useState("")
  const [amount, setAmount] = useState("")
  const signatureCanvasRef = useRef(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    const signature = signatureCanvasRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png")
    onSubmit(contractAddress, signature)
  }

  const handleBuyProduct = async (event) => {
    event.preventDefault()
    await buyProduct(productId, amount)
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
          <SignatureCanvas
            penColor="black"
            canvasProps={{
              width: 500,
              height: 200,
              className: "sigCanvas",
              style: { border: "1px solid black" },
            }}
            ref={signatureCanvasRef}
          />
        </div>
        <br />
        <button type="submit">Subscribe</button>
      </form>
      <h2>Buy a product</h2>
      <form onSubmit={handleBuyProduct}>
        <label>
          Product ID:
          <input
            type="number"
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
          />
        </label>
        <br />
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        <br />
        <button type="submit">Buy</button>
      </form>
    </div>
  )
}

export default SubscriptionForm
