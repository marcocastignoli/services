<template>
  <div class="container">
    <div class="row">
      <shop v-for="shop in data" :key="shop.id" v-bind:data="shop.template" v-bind:domain="shop.domain_name"></shop>
    </div>
  </div>
</template>

<script>
import Shop from "../components/Shop";

export default {
  props: {
    msg: String
  },
  data: function() {
    return {
      data: [],
      isConnected: false
    };
  },
  components: {
    shop: Shop
  },
  sockets: {
    connect() {
      this.isConnected = true;
    },
    disconnect() {
      this.isConnected = false;
    },
    "init"(data) {
      this.data = data;
    },
    "request.replied": function(data) {
      console.log(data);
    }
  }
};
</script>

<style>
</style>
