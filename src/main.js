// The Vue build version to init with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import Antd from 'ant-design-vue'
import StHttp from '@/http/index'
import UserUtils from '@/utils/user-utils'
import auth from '@/http/auth'

import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

Vue.use(Antd)
Vue.use(StHttp)

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Soft Tracker`
  }
  if (to.meta.roles) {
    if (store.state.userInfo == null) {
      const getUserInfo = async () => {
        try {
          await auth.checkAccessToken()
          console.log("access token校验通过")
        } catch (e) {
          // 需要刷新access token
          console.log("需要刷新access token")
          await auth.refreshAccessToken()
        }
        try {
          await store.dispatch('getUserInfo', true)
          const role = UserUtils.getRole()
          if (to.meta.roles.indexOf(role) !== -1) {
            next()
          } else {
            next({
              path: '/error',
              query: {
                title: '失败',
                subTitle: '您无权限查看该页面',
                buttonTitle: '返回首页'
              }
            })
          }
        } catch (e) {
          next({
            name: 'Error',
            params: {
              errorMsg: e
            }
          })
        }
      }

      getUserInfo()
    } else {
      const role = UserUtils.getRole()
      if (to.meta.roles.indexOf(role) !== -1) {
        next()
      } else {
        next({
          path: '/error',
          query: {
            title: '失败',
            subTitle: '您无权限查看该页面',
            buttonTitle: '返回首页'
          }
        })
      }
    }
  } else {
    next()
  }
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App />'
})
