import axios from '../../utils/axios'

export default {
    getPublicKey() {
        return axios.post("comm/key")
    },
    login(data) {
        return axios.post("comm/login", data)
    },
    logout() {
        return axios.post("comm/loginOut")
    },
    getUserInfo() {
        return axios.post("comm/userinfo")
    },
    getRoutes() {
        return axios.post("comm/menu")
    },
    upload(data) {
        return axios.file("comm/upload", data)
    }
}
