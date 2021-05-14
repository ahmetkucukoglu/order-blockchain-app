export const Orders = require("../../../backend/build/contracts/Orders.json")

export default (web3, contractAddress) => {

    const contract = new web3.eth.Contract(
        Orders.abi,
        contractAddress
    )

    contract.events.allEvents({}, (error, event) => {
        console.log('Event', event)
    })

    return contract
}