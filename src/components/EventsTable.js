import React from "react"

function EventsTable({ events }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Event Name</th>
                    <th>Transaction Hash</th>
                    <th>Block Number</th>
                </tr>
            </thead>
            <tbody>
                {events.map((event, i) => (
                    <tr key={i}>
                        <td>{event.event}</td>
                        <td>{event.transactionHash}</td>
                        <td>{event.blockNumber}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default EventsTable
