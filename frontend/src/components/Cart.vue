<template>
  <div id="cart" class="card shadow-sm mt-3" v-if="this.cart.items.length > 0">
    <div class="card-body">
      <h5 class="card-title">Cart</h5>
      <hr />
      <div class="row fw-bold">
        <div class="col">Name</div>
        <div class="col">Quantity</div>
        <div class="col">Total Price</div>
        <div class="col"></div>
      </div>
      <CartItem
        :key="cartItem.productId"
        :cartItem="cartItem"
        v-for="cartItem in this.cart.items"
        @removeProductFromCart="removeProductFromCart"
      />

      <button
        type="button"
        class="btn btn-sm btn-outline-primary"
        @click="createOrder"
      >
        <i class="bi bi-box-seam"></i> Create order
      </button>
    </div>
  </div>
</template>

<script>
import CartItem from "./CartItem.vue";
import { eventHub } from "../main";

export default {
  name: "Cart",
  components: {
    CartItem,
  },
  props: {},
  data() {
    return {
      cart: {
        items: [],
      },
    };
  },
  methods: {
    addProductToCart(productId, productName, productPrice, deliveryDate) {
      var cartItems = this.cart.items.filter((x) => x.productId == productId);

      if (cartItems.length == 0) {
        this.cart.items.push({
          productId: productId,
          productName: productName,
          productPrice: productPrice,
          deliveryDate: deliveryDate,
          quantity: 1,
        });
      } else {
        cartItems[0].quantity++;
      }
    },
    removeProductFromCart(productId) {
      let items = this.cart.items.filter((x) => x.productId != productId);
      this.cart.items = items;
    },
    async createOrder() {
      let totalPrice = this.cart.items
        .map((x) => x.productPrice * x.quantity)
        .reduce((p, c) => p + c);

      let deliveryDate = new Date(
        Math.max.apply(
          null,
          this.cart.items.map((x) => new Date(x.deliveryDate))
        )
      );

      eventHub.$emit("createOrder", { totalPrice, deliveryDate });

      this.cart.items = [];
    },
  },
  created() {
    eventHub.$on("addProductToCart", (product) => {
      this.addProductToCart(
        product.id,
        product.name,
        product.price,
        product.deliveryDate
      );
    });
  },
};
</script>

<style scoped>
</style>