import constants from "@/utils/constants-utils"

export default {
  method: 'get',
  baseURL: constants.softTrackerHostPrefix(),
  // 请求头信息
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  // 参数
  data: {},
  // 设置超时时间
  timeout: 10000,
  // 携带凭证
  withCredentials: false,
  // 返回数据类型
  responseType: 'json'
}
