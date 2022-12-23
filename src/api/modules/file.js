import axios from '../../utils/axios'

export default {

    getFileList(data) {
        return axios.post('emergency/filelists',data)
    },

    addFiles(data) {
        return axios.file('emergency/updateFiles', data)
    },
    getFileType() {
        return axios.post('emergency/filetype')
    },


    deleteFile(data) {
        return axios.post('emergency/deleteFile',data)
    },




    downloadFile(data,config) {
        return axios.post('emergency/down',data,config)
    },



    // 新增类型

    getUpdateType(data) {
        return axios.post('emergency/updateType',data)

    },
    // 文件详情
    getFileinfo(data) {
        return axios.post('emergency/fileinfo',data)
    }



    
}