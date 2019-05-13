import axios from 'axios'

const instance = axios.create({
    //默认地址
    baseURL: 'http://192.168.1.188:12',
    //响应时长
    timeout: 6000,
})
instance.defaults.headers.post['Content-Type'] = 'application/json'
//请求拦截器
instance.interceptors.request.use(
    /**
     * @param config    传入的url以及参数
     */
    (config) => {
        //配置登录接口之外的请求头
        console.log(config)
        if(sessionStorage.getItem("USER_TOKEN") && !config.url.includes('OAuth')){
            config.headers.common['Authorization'] = sessionStorage.getItem("USER_TOKEN")
        }
        console.log("发送请求")
        return config
    },
    (error) => {
        console.log("发送请求失败")
        return Promise.reject(error)
    }
)

//响应拦截器
instance.interceptors.response.use(
    (response) => {
        console.log("响应成功")
        return response
    },
    (error) => {
        console.log("响应失败",error)
        // return Promise.reject(error)
    }
)
/**
 * @param {请求方式} method 
 * @param {请求地址} path 
 * @param {请求参数} params
 */
export default function (method, url, params) {
    method = method.toLowerCase()
    switch (method) {
        case 'get':
            params = params || ''
            return instance.get(url + params)
        case 'post':
            params = params || null
            return instance.post(url,params)
        default:
        console.error('未知的method:'+method)
        return false
            
    }
}