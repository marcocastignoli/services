<template>
  <div class="container">
    <div class="row">
      <shop v-if="shop" :data="shop.template" :domain="shop.domain_name"></shop>
    </div>
  </div>
</template>

<script>
import Shop from "../components/Shop";

export default {
  props: {
    domain_name: String,
    shops: Array
  },
  data: function() {
    return {}
  },
  computed: {
    shop: function() {
      return this.shops.find(s => s.domain_name === this.domain_name)
    }
  },
  components: {
    shop: Shop
  }
};
</script>

<style>
</style>
