import Vue from "vue"
import App from "./App.vue"
import store from "./store"

Vue.config.productionTip = false
Vue.config.errorHandler = (error) => alert(error)

export const eventHub = new Vue()

new Vue({
  created: function () {
    store.subscribe((mutation, state) => {
      localStorage.setItem('orders', JSON.stringify(state.orders))
    })
  },
  beforeCreate() {
    let orders = localStorage.getItem('orders')
    this.$store.commit('loadOrders', JSON.parse(orders))
  },
  store,
  render: h => h(App),
}).$mount('#app')
