import Vue from 'vue'
import Vuex from 'vuex'
import stHttp from '@/http/st-http'
import {message} from 'ant-design-vue'

Vue.use(Vuex)

const state = {
  userInfo: null,
  caseForm: null,
  editCaseForm: null,
  caseMarkdown: null
}

const mutations = {
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  saveCaseForm(state, caseForm) {
    state.caseForm = caseForm
  },
  saveEditCaseForm(state, caseForm) {
    state.editCaseForm = caseForm
  }
}

const actions = {
  async getUserInfo(context, notRefresh = false) {
    try {
      const userInfo = await stHttp({
        url: '/user/info',
        notRefresh: notRefresh
      })
      context.commit('saveUserInfo', userInfo['data'])
    } catch (e) {
      // message.error('获取用户信息失败，错误原因: ' + e)
      console.log('获取用户信息失败，错误原因: ' + e)
    }
  },
  async getCaseDetails(context, id) {
    try {
      const data = await stHttp({
        url: `/case/details?caseId=${id}`
      })
      context.commit('saveEditCaseForm', data['data'])
    } catch (e) {
      this.$message.error(e)
    }
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
