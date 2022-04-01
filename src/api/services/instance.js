import axios from 'axios'
import qs from 'qs'
import config from '../config'
import router from '@/router'
import { message } from 'ant-design-vue'
const { api_base_url } = config

let instance = axios.create({
    time: 1000 * 60,
    baseURL: api_base_url
})

instance.defaults.responseType = 'json'
instance.defaults.withCredentials = true
instance.defaults.transformRequest = [
    data => {
        return qs.stringify(data)
    }
]
instance.defaults.validateStatus = function () {
    return true
}
// 请求拦截器
instance.interceptors.request.use(
    config => {
        return config
    },
    error => {
        message.error('请求超时!');
        return Promise.reject(error)
    }
)

// 响应拦截器即异常处理
instance.interceptors.response.use(response => {
    let data = response.data
    let status = response.status
    console.log(status)
    if (status === 200) {
        return Promise.resolve(data)
    } else if (status === 301) {
        message.info('请先登录')
        router.replace({
            path: 'login'
        })
        return Promise.reject(response)
    }else if (status == 405) {
        console.log('data.message',data.message)
        message.info('操作过于频繁，请稍后操作')
        return Promise.reject(response)
    } else {
        return Promise.reject(response)
    }
}, error => {
    console.log('响应拦截器异常', error)
})

let ajaxMethod = ['get', 'post']
let api = {}
ajaxMethod.forEach(method => {
    // 数组取值的两种方式
    api[method] = function (uri, data, config) {
        return new Promise(function (resolve, reject) {
            instance[method](uri, data, config)
                .then(response => {
                    resolve(response)
                })
            .catch(error => {
                reject(error)
            })
    })
    }
})

export default api
