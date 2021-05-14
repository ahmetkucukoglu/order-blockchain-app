<template>
  <div
    id="orders"
    class="card shadow-sm mt-3"
    v-if="this.$store.state.orders.length > 0"
  >
    <div class="card-body">
      <h5 class="card-title">Orders</h5>
      <hr />
      <div class="row fw-bold">
        <div class="col-1">#ID</div>
        <div class="col">Total Price</div>
        <div class="col">Delivery Date</div>
        <div class="col"></div>
      </div>
      <Order
        :key="order.id"
        :order="order"
        v-for="order in this.$store.state.orders"
      />
    </div>
  </div>
</template>

<script>
import Order from "./Order.vue";
import { eventHub } from "../main";
import OrderService from "../services/OrderService";

export default {
  name: "Orders",
  components: {
    Order,
  },
  props: {},
  methods: {
    async add(totalPrice, deliveryDate) {
      let order = {
        id: this.$store.state.orders.length + 1,
        totalPrice: totalPrice,
        deliveryDate: deliveryDate,
      };

      let orderService = new OrderService(
        this.$store.state.web3,
        this.$store.state.contract,
        this.$store.state.accountAddress
      );

      await orderService.add(order.id, totalPrice, deliveryDate);

      this.$store.commit("addOrder", order);
    },
  },
  async created() {
    eventHub.$on("createOrder", async (order) => {
      await this.add(order.totalPrice, order.deliveryDate);
    });
  },
};
</script>

<style scoped>
</style>