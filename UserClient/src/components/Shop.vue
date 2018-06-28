<template>
    <div class="col-md-3 shop-box-container">
        <div class="shop-box">
            <h1>{{data.name}}</h1>
            <div class="form-group" v-for="property in data.properties" :key="property.name">
                <label v-if="property.type !== 'submit'">{{property.label}}</label>
                <input class="form-control" v-if="property.type === 'text'" type="text" v-model="shop[property.name]">
                <input class="form-control" v-if="property.type === 'int'" type="number" v-model="shop[property.name]">
                <select class="form-control" v-if="property.type === 'select'" type="text" v-model="shop[property.name]">
                    <option v-for="option in property.options" :key="option.value" v-bind:value="option.value">{{option.label}}</option>
                </select>

                <button v-if="property.type === 'submit'" v-on:click="request(property.action)">{{property.label}}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "Shop",
  props: {
    data: Object,
    domain: String
  },
  data: function() {
    return {
      shop: {}
    };
  },
  methods: {
    request(action) {
      this.$socket.emit("request.send", {
        domain: this.domain,
        parameters: {
          action: action,
          arguments: this.shop
        }
      });
    }
  }
};
</script>

<style scoped>
.shop-box-container {
  padding: 10px;
}
.shop-box {
  background-color: #eeeeee;
  padding: 20px;
  border-radius: 20px;
}

input,
select,
button {
  margin: 10px;
}
</style>
