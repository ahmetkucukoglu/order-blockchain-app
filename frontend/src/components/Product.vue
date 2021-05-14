<template>
  <div class="col">
    <h4>{{ product.name }}</h4>
    <h6>
      {{ product.price }} ETH /
      {{ new Date(product.deliveryDate).toLocaleDateString("tr-TR") }}
    </h6>
    <button
      type="button"
      class="btn btn-sm btn-outline-primary"
      @click="addProductToCart"
    >
      <i class="bi bi-cart-plus"></i> Add to cart
    </button>
  </div>
</template>

<script>
import { eventHub } from "../main";

export default {
  name: "Product",
  props: {
    product: Object,
  },
  methods: {
    addProductToCart() {
      eventHub.$emit("addProductToCart", {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        deliveryDate: this.product.deliveryDate,
      });
    },
  },
};
</script>

<style scoped>
</style>