import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Login from '@/pages/Login'
import Register from '@/pages/Register'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        title: "面板"
      }
    },
    {
      path: '/login',
      name: "Login",
      component: Login,
      meta: {
        title: "登录"
      }
    },
    {
      path: '/register',
      name: "Register",
      component: Register,
      meta: {
        title: "注册"
      }
    }
  ]
})
