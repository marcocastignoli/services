import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import router from './router'
import '../node_modules/bootstrap/scss/bootstrap.scss';

import VueSocketio from 'vue-socket.io';
Vue.use(VueSocketio, 'http://localhost:3000');

Vue.use(VueRouter)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
