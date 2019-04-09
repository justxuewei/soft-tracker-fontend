import axios from 'axios'
import config from './st-config'
import auth from './auth'
import {message} from 'ant-design-vue'
import httpUtils from '@/utils/http-utils'

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
        // 将请求header加入Authorization
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('st_access_token')}`
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
            // 执行刷新access token
            return auth.refreshAccessToken().then(() => {
              console.log('>>> 刷新access token后重新执行该请求')
              let __config = error.config
              __config.headers['Authorization'] = `Bearer ${localStorage.getItem('st_access_token')}`
              return axios(__config).then(
                (response) => {
                  return httpUtils.getResponseData(response)
                }
              )
            })
          }
        }
        return Promise.reject(httpUtils.getResponseData(error.response))
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
