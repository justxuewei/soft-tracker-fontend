import ObjectUtils from '@/utils/object-utils'
import axios from 'axios'
import constants from '@/utils/constants-utils'
import STHttp from './st-http'
import router from '@/router/index'

export default {
  /**
   * 根据用户名和密码登录SoftTracker
   * @param username
   * @param password
   */
  login(username, password) {
    return new Promise(function(resolve, reject) {
      let formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      formData.append('grant_type', 'password')
      axios({
        method: 'post',
        url: constants.softTrackerHostPrefix() + '/oauth/token',
        headers: {
          Authorization: constants.softTrackerOAuthAuthorization()
        },
        data: formData
      }).then(function(response) {
        // 将accessToken和refreshToken存入localStore中
        const accessToken = response.data['access_token']
        const refreshToken = response.data['refresh_token']
        localStorage.setItem('st_access_token', accessToken)
        localStorage.setItem('st_refresh_token', refreshToken)
        resolve()
      }).catch(function(error) {
        let errorMsg
        if (error.response.data['error_description'] === 'Bad credentials') {
          errorMsg = '用户名或密码错误'
        } else {
          errorMsg = error.response.data['error_description']
        }
        reject(errorMsg)
      })
    })
  },
  /**
   * 刷新accessToken
   * 如果刷新失败则直接进入/login
   */
  refreshAccessToken() {
    return new Promise(function(resolve, reject) {
      const refreshToken = localStorage.getItem('st_refresh_token')
      if (!ObjectUtils.isExisted(refreshToken)) {
        // 重定向到/login
        router.push({path: "/login"})
      }
      let formData = new FormData()
      formData.append('refresh_token', refreshToken)
      formData.append('grant_type', 'refresh_token')
      // 通过axios更新accessToken
      axios({
        method: 'POST',
        url: constants.softTrackerHostPrefix() + '/oauth/token',
        headers: {
          'Authorization': constants.softTrackerOAuthAuthorization()
        },
        data: formData
      }).then(function(response) {
        // 刷新accessToken
        localStorage.setItem('st_access_token', response.data['access_token'])
        resolve()
      }).catch(function(error) {
        router.push({path: "/login"})
        reject(error)
      })
    })
  },
  /**
   * 刷新Gitlab的Private Token
   */
  refreshGitlabPrivateToken() {
    return new Promise((resolve, reject) => {
      STHttp({
        url: '/user/access_key'
      }).then((response) => {
        localStorage.setItem('gitlab-private-token', response.data['token'])
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  }

}
