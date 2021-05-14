<template>
  <div class="row mt-3">
    <div class="col-1">{{ order.id }}</div>
    <div class="col">{{ order.totalPrice }} ETH</div>
    <div class="col">
      {{ new Date(order.deliveryDate).toLocaleDateString("tr-TR") }}
    </div>
    <div class="col">
      <button type="button" class="btn btn-sm btn-success me-1" @click="pay">
        <i class="bi bi-credit-card"></i> Make payment
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary me-1"
        @click="deliver"
      >
        <i class="bi bi-truck"></i> Deliver
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary me-1"
        @click="refund"
      >
        <i class="bi bi-cash"></i> Refund
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary"
        @click="get"
      >
        <i class="bi bi-box-seam"></i> Get
      </button>
    </div>
  </div>
</template>

<script>
import { eventHub } from "../main";
import OrderService from "../services/OrderService";

export default {
  name: "Order",
  props: {
    order: Object,
  },
  methods: {
    async pay() {
      let orderService = new OrderService(
        this.$store.state.web3,
        this.$store.state.contract,
        this.$store.state.accountAddress
      );

      await orderService.pay(this.order.id, this.order.totalPrice);

      eventHub.$emit("updateBalance");
    },
    async deliver() {
      let orderService = new OrderService(
        this.$store.state.web3,
        this.$store.state.contract,
        this.$store.state.accountAddress
      );

      await orderService.deliver(this.order.id);
    },
    async refund() {
      let orderService = new OrderService(
        this.$store.state.web3,
        this.$store.state.contract,
        this.$store.state.accountAddress
      );

      await orderService.refund(this.order.id);

      eventHub.$emit("updateBalance");
    },
    async get() {
      let orderService = new OrderService(
        this.$store.state.web3,
        this.$store.state.contract,
        this.$store.state.accountAddress
      );

      let order = await orderService.get(this.order.id);

      alert(
        `
        Status:${order.status}
        CreatedDate:${order.createdDate}
        DeliveryDate:${order.deliveryDate}
        DeliveredDate:${order.deliveredDate}`
      );
    },
  },
};
</script>

<style scoped>
</style>