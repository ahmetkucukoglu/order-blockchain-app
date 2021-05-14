<template>
  <div id="app">
    <StatusBar />
    <Products />
    <Cart />
    <Orders />
  </div>
</template>

<script>
import StatusBar from "./components/StatusBar.vue";
import Products from "./components/Products.vue";
import Cart from "./components/Cart.vue";
import Orders from "./components/Orders.vue";

export default {
  name: "App",
  components: {
    StatusBar,
    Products,
    Cart,
    Orders,
  },
  methods: {},
};
</script>

<style>
</style>