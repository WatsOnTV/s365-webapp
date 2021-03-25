// Vue Components
import Vue from 'vue';
import App from './App.vue';
import Homepage from './Homepage.vue';

import axios from 'axios';
import VueAxios from 'vue-axios';

// VueSessionStorage because I was having problems with sessionStorage and localStorage
import VueSessionStorage from 'vue-sessionstorage'
Vue.use(VueSessionStorage);

Vue.use(VueAxios, axios);

// Vue Router
import VueRouter from 'vue-router';
Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    component: Homepage
  }
];
const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

Vue.mixin({
  data: function() {
    return {
      user_token: ''
    }
  }
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
