<template>
  <div class="row mt-3">
    <div class="col">{{ cartItem.productName }}</div>
    <div class="col">
      <input
        type="text"
        class="form-control count"
        v-model="cartItem.quantity"
      />
    </div>
    <div class="col">{{ getTotalPrice }} ETH</div>
    <div class="col">
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary"
        @click="removeProductFromCart"
      >
        <i class="bi bi-cart-dash"></i> Remove from cart
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CartItem",
  props: {
    cartItem: Object,
  },
  methods: {
    removeProductFromCart() {
      this.$emit("removeProductFromCart", this.cartItem.productId);
    },
  },
  computed: {
    getTotalPrice() {
      var totalPrice = this.cartItem.quantity * this.cartItem.productPrice;

      return totalPrice;
    },
  },
};
</script>

<style scoped>
.count {
  width: 45px;
}
</style>