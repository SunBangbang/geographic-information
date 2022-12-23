import axios from '../../utils/axios'

export default {
  // 获取用户列表
  getUserList(data) {
    return axios.post('user/userInfo_query', data)
  },
  // 用户信息新增/编辑
  addOrEditUser(data) {
    return axios.file('user/userinfo_edit', data)
  },
  // 用户信息删除
  deleteUser(data) {
    return axios.post('user/userinfo_dele', data)
  },
  // 用户信息删除
  getSave(datas) {
    return axios.get('statistical/browsing/histories', datas)
  }
}
