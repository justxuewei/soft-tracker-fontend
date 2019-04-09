import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import CreateCase from '@/pages/CreateCase'
import CasePreview from '@/pages/CasePreview'

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
    },
    {
      path: '/create_case',
      name: 'CreateCase',
      component: CreateCase,
      meta: {
        title: '创建教师案例'
      }
    },
    {
      path: '/case_preview',
      name: 'CasePreview',
      component: CasePreview,
      meta: {
        title: '案例正文预览'
      }
    }
  ]
})
