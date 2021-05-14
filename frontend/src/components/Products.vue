<template>
  <div id="products" class="card shadow-sm mt-3">
    <div class="card-body">
      <h5 class="card-title">Products</h5>
      <hr />
      <div class="row">
        <Product
          :key="product.id"
          :product="product"
          v-for="product in this.products"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Product from "./Product.vue";

export default {
  name: "Products",
  components: {
    Product,
  },
  props: {},
  data() {
    return {
      products: [
        {
          id: 100,
          name: "Apple iPhone 12 Pro Max",
          price: 3,
          deliveryDate: "2021-05-16",
        },
        {
          id: 200,
          name: "Xiaomi Mi 11 Ultra",
          price: 2,
          deliveryDate: "2021-05-17",
        },
        {
          id: 300,
          name: "Huawei Mate 40 Pro",
          price: 1,
          deliveryDate: "2021-05-18",
        },
        {
          id: 400,
          name: "Samsung Galaxy S21 Ultra",
          price: 0.5,
          deliveryDate: "2021-05-13",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style scoped>
</style>