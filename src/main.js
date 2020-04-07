import Vue from 'vue'
import './plugins/fontawesome'
import App from './App.vue'
import axios from 'axios'

Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
