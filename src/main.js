import Vue from 'vue'
import VCharts from 'v-charts'
import App from './App.vue'
import Login from './components/LoginComponent.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';



Vue.use(VCharts)
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})
