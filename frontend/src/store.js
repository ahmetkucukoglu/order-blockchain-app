import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        contractAddress: '0xC01301B0c38B744a4Ca49962E275d8728dF4165D',
        accountAddress: null,
        web3: null,
        contract: null,
        orders: []
    },
    mutations: {
        setWeb3(state, web3) {
            state.web3 = web3
        },
        setContract(state, contract) {
            state.contract = contract
        },
        setAccountAddress(state, address) {
            state.accountAddress = address
        },
        addOrder(state, order) {
            state.orders.push(order)
        },
        loadOrders(state, orders) {
            state.orders = orders ?? []
        },
    },
    getters: {
    },
    actions: {
    }
})