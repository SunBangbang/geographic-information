import axios from "axios"
import QS from "qs"
import store from "../store"
import {MessageBox, Message} from "element-ui"
import router from '../router'

export const service = axios.create({
    baseURL: process.env.VUE_APP_API,
    // timeout: 10000,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
   
})
axios.defaults.withCredentials = true;

service.interceptors.request.use(
    // 请求拦截
    config => {
        // 每次发送请求之前判断vuex中是否存在token
        // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        const token = store.state.user.token;
        token && (config.headers.token = token);
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

service.interceptors.response.use(
    response => {
        const res = response.data
        // 303：登录超时
        if (res.status === 300 || res.status === 301 || res.status === 302 || res.status === 303) {
            MessageBox.confirm(res.msg, '请重新登录', {
                confirmButtonText: '确认',
                showCancelButton: false,
                showClose: false,
                type: 'warning'
            }).then(() => {
                store.dispatch('user/logout')
                    .then(() => {
                        location.reload()
                    })
            })
            return false
        }
        // token临近过期时，响应中会包含token进行更新，以防token过期
        if (res.token) {
            store.dispatch('user/updateToken', res.token)
        }
        // 判断是否是二进制流
        if(response.data.type === 'application/octet-stream') return response
        else return res
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

const requestData = (method, url, data, headers, timeout, config) => {
    let options = Object.assign({}, {
        url: url,
        method: method,
        data: data
    })
    if (headers) options.headers = headers
    if (timeout) options.timeout = timeout
    if(config) options.onUploadProgress = config.onUploadProgress
    return new Promise((resolve, reject) => {
        service.request(options).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

const queryData = (url, query, config) => {
    let tempQuery = ""
    let options = {}
    // if (url.indexOf("?") === -1) {
    //     tempQuery = "?"
    // }
    for (let key in query) {
        if (
            query[key] !== null &&
            query[key] !== undefined &&
            query[key] !== "" &&
            query[key].length !== 0
        ) {
            // tempQuery += "&" + key + "=" + query[key]
            tempQuery += "?" + key + "=" + query[key]
        }
    }
    if(config) {
        options = Object.assign(options, config)
        return new Promise((resolve, reject) => {
            service
                .get(encodeURI(url + tempQuery), options)
                // .get(url)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    } else {
        return new Promise((resolve, reject) => {
            service
                .get(url)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}

const $getJson = function (url) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url,
        dataType: "json",
        crossDomain: true,
        cache: false
      }).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
}

export default {
    post(url, data,headers,timeout) {
        return requestData('post', url, QS.stringify(data), headers, timeout)
    },
    toPost(url, data, timeout) {
        return requestData('post', url, data, {
            "Content-Type": "application/json"
        }, timeout)
    },
    file(url, data, headers, timeout, onUploadProgress) {
        return requestData('post', url, data, headers, timeout, onUploadProgress)
    },
    get(url, query, config) {
        return queryData(url, query, config);
    },
    getJson(url){
        return $getJson(url);
    }
}
