import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import globalStyle from './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css'
import api from './axios'

Vue.prototype.$api = api
//解除双向绑定
Vue.prototype.$relieve = (obj) => JSON.parse(JSON.stringify(obj));
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
