import Vue from 'vue'
import Vuex from 'vuex'
import stHttp from '@/http/st-http'
import {message} from 'ant-design-vue'

Vue.use(Vuex)

const state = {
  userInfo: null
}

const mutations = {
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo
  }
}

const actions = {
  async getUserInfo({commit}) {
    try {
      const userInfo = await stHttp({
        url: '/user/info'
      })
      console.log(">>> 获取的用户信息为")
      commit('saveUserInfo', userInfo['data'])
    } catch (e) {
      message.error("获取用户信息失败，错误原因: " + e)
    }
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
