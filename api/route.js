import express from 'express'
import Web3 from 'web3'
import HDWalletProvider from '@truffle/hdwallet-provider'
import Orders from '../backend/build/contracts/Orders.json'
import OrderService from './services/OrderService.js'

const router = express.Router()

const privateKeys = process.env.PRIVATE_KEYS.split(',')
const wallet = new HDWalletProvider(privateKeys, `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`)
const web3 = new Web3(wallet)

const contractAddress = '0xe309455Ec00a8339331dE6d93b043Edb8B7a6C7E'
const contract = new web3.eth.Contract(
    Orders.abi,
    contractAddress
)

router.get('/balance', async (req, res) => {

    let currentBalance = await web3.eth.getBalance(
        contractAddress
    );
    currentBalance = web3.utils.fromWei(
        currentBalance,
        'ether'
    );

    res.send(currentBalance)
})

router.post('/orders/add', async (req, res) => {

    try {

        const orderService = new OrderService(web3, contract, req.body.accountAddress)

        let tx = await orderService.add(req.body.id, req.body.totalPrice, new Date(req.body.deliveryDate))

        res.json(tx)
    }
    catch (err) {
        res.status(500).json({ status: false, message: err })
    }
})

router.post('/orders/pay', async (req, res) => {

    try {

        const orderService = new OrderService(web3, contract, req.body.accountAddress)

        let tx = await orderService.pay(req.body.id, req.body.totalPrice)

        res.json(tx)
    }
    catch (err) {
        res.status(500).json({ status: false, message: err })
    }
})

router.post('/orders/deliver', async (req, res) => {

    try {

        const orderService = new OrderService(web3, contract, req.body.accountAddress)

        let tx = await orderService.deliver(req.body.id)

        res.json(tx)
    }
    catch (err) {
        res.status(500).json({ status: false, message: err })
    }
})

router.post('/orders/refund', async (req, res) => {

    try {

        const orderService = new OrderService(web3, contract, req.body.accountAddress)

        let tx = await orderService.refund(req.body.id)

        res.json(tx)
    }
    catch (err) {
        res.status(500).json({ status: false, message: err })
    }
})

router.get('/orders/get', async (req, res) => {

    try {

        const orderService = new OrderService(web3, contract, req.body.accountAddress)

        let order = await orderService.get(req.body.id)

        res.json(order)
    }
    catch (err) {
        res.status(500).json({ status: false, message: err })
    }
})

export default router