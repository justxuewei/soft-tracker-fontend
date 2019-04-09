// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import Antd from 'ant-design-vue'
import streq from '@/http/index'

import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

Vue.use(Antd)
Vue.use(streq)

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Soft Tracker`
  }
  next()
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App />'
})
