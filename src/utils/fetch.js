import axios from 'axios'
import { Message } from 'element-ui'

/* 创建axios实例 */
const service = axios.create({
  baseURL: '',
  timeout: 5000 // 请求超时时间
  // interceptors: true, // 是否开启response拦截器 默认true
  // noAssign: false // 请求体是否带defaultConfig 默认false
  // timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

/* respone拦截器 */
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.message === '取消重复请求') {
      return Promise.reject(error)
    }
    Message({
      message: '连接服务器失败',
      type: 'error',
      duration: 5000
    })
    return Promise.reject(error)
  }
)

export default service
