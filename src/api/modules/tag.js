import axios from '../../utils/axios'

export default {
    // 获取所有标注信息
    getMarkList(data) {
        return axios.post('markPoint/markList_query', data)
    },
    // 新增标记点信息
    addMark(data) {
        return axios.post('markPoint/markInfo_add', data)
    },
    // 更新标记点信息
    editMark(data) {
        return axios.post('markPoint/markInfo_edit', data)
    },
    // 删除标记点信息
    deleteMark(data) {
        return axios.post('markPoint/markInfo_delete', data)
    }
}