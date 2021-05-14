import detectEthereumProvider from "@metamask/detect-provider"
import { eventHub } from "../main";
import Web3 from "web3"

export default async () => {
    let web3
    let accountAddress

    const provider = await detectEthereumProvider()

    if (provider) {

        window.ethereum.on('accountsChanged', (accounts) => {
            eventHub.$emit('changeAccount', accounts[0])
        })

        try {
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

            accountAddress = accounts[0]
        } catch (err) {

            if (err.code === 4001) {
                console.log('Please, connect to MetaMask.')
            } else {
                console.error(err)
            }
        }

        web3 = new Web3(provider)
    } else {
        alert('Please, install MetaMask')
    }

    return { web3, accountAddress }
}