import Vue from 'vue'
import Vuex from 'vuex'
import stHttp from '@/http/st-http'
import {message} from 'ant-design-vue'

Vue.use(Vuex)

const state = {
  userInfo: null,
  caseForm: null,
  editCaseForm: null,
  caseMarkdown: null,
  projectList: {
    running: null,
    closed: null
  },
  discuss: []
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
  },
  saveProjectList(state, param) {
    if (param.type === 'running') {
      // console.log(">>> running", param.data)
      state.projectList.running = param.data
    } else if (param.type === 'closed') {
      state.projectList.closed = param.data
    }
  },
  setDiscuss(state, param) {
    state.discuss = param
  }
}

const actions = {
  async getUserInfo({commit, state}, notRefresh = false) {
    if (state.userInfo != null) return
    try {
      const userInfo = await stHttp({
        url: '/user/info',
        notRefresh: notRefresh
      })
      commit('saveUserInfo', userInfo['data'])
    } catch (e) {
      console.log('获取用户信息失败，错误原因: ', e)
      // message.error('登录过期，请重新登录')
      window.location.href = "/login"
    }
  },
  async getCaseDetails({commit, state}, id) {
    if (state.caseDetails != null) return
    try {
      const data = await stHttp({
        url: `/case/details?caseId=${id}`
      })
      commit('saveEditCaseForm', data['data'])
    } catch (e) {
      message.error(e)
    }
  },
  async getProjectList({commit, state}, type) {
    if (type === 'running' && state.projectList.running != null) {
      return
    }
    if (type === 'closed' && state.projectList.closed != null) {
      return
    }

    try {
      const res = await stHttp({
        url: `/projects/${type}`
      })
      // console.log(res.data)
      commit('saveProjectList', {
        type: type,
        data: res.data
      })
      console.log("state.projectList", state.projectList, res.data)
    } catch (e) {
      // message.error(e.message)
    }
  },
  async getDiscuss({commit, state}) {
    if (state.discuss.length !== 0) return
    try {
      const res = await stHttp({
        url: '/project/discuss'
      })
      commit('setDiscuss', res['data'])
    } catch (e) {
      message.error(e.message)
    }
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
