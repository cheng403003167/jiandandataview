import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuescroll from 'vuescroll/dist/vuescroll-native'
import router from './router'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'

Vue.use(ElementUI, { locale })
Vue.use(vuescroll)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
