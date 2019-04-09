import axios from 'axios'
import config from './gitlab-config'
import {message} from 'ant-design-vue'
import httpUtils from '@/utils/http-utils'
import auth from './auth'

export default function $axios(options) {

  return new Promise((resolve, reject) => {

    const instance = axios.create({
      baseURL: config.baseURL,
      headers: config.headers,
      transformResponse: [function(data) {
      }]
    })

    // request 拦截器
    instance.interceptors.request.use(
      config => {
        return config
      },
      error => {
        // 超时判断
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
          console.error('请求超时了')
          message.error("请求超时，请稍后重试")
        }
        return Promise.reject(error)
      }
    )

    // response 拦截器
    instance.interceptors.response.use(
      res => {
        return httpUtils.getResponseData(res)
      },
      error => {
        if (error && error.response) {
          if (error.response.status === 401) {
            console.error('>>> 401错误, 登录过期')
            // 更新Private-Token
            return auth.refreshGitlabPrivateToken().then(() => {
              console.log('>>> 刷新private token后重新执行该请求')
              let __config = error.config
              __config.headers['Private-Token'] = localStorage.getItem('gitlab-private-token')
              return axios(__config).then(
                (response) => {
                  return httpUtils.getResponseData(response)
                }
              )
            })
          } else {
            const requestData = JSON.parse(error.response.request.response)
            message.error(requestData['message'])
          }
        }
        return Promise.reject(error)
      }
    )

    //请求处理
    instance(options).then((res) => {
      resolve(res)
      return false
    }).catch((error) => {
      reject(error)
    })

  })

}
