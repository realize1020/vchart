/**
 * axios封装
 */
import axios from 'axios'
import config from './config'

// 创建axios实例对象
const service = axios.create({
    timeout: 8000,
})

// 请求拦截
service.interceptors.request.use(function (config) {
    return config
}, function (error) {
    return Promise.reject(error)
})

// 响应拦截
service.interceptors.response.use(function (response) {
    return response
}, function (error) {
    return Promise.reject(error)
})

// 请求核心函数
function request (options) {
    options.method = options.method ? options.method : 'get'
    if (options.method.toLowerCase() == 'get') { // axios中，get请求参数是params，post请求参数是data
        options.params = options.data
    }

    // mock
    if (config.env == 'production') { // 生产环境写死baseApi
        service.defaults.baseURL = config.baseApi // 注意baseURL在axios中要用service.defaults.baseURL修改
    } else { // 非生产环境，判断是否mock
        service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
    }
    return service(options)
}

export default request
