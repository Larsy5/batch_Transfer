import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {ethers} from "ethers";

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(ethers)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
