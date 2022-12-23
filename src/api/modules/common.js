import axios from '../../utils/axios'

export default {
  // 获取项目JSON文件信息
  getProjectJsonFiles(data) {
    return axios.post('project/projectDocInfo_query', data)
  },
  // 获取项目其他文件信息
  getProjectOtherFiles(data) {
    return axios.post('project/projectOthDocInfo_query', data)
  },
  // 获取单体文档信息
  getMonomerOtherFiles(data) {
    return axios.post('project/buildingDocInfo_query', data)
  },
  // 获取所有项目及项目下单体信息
  getProjectsInfo(data) {
    return axios.post('project/projectInfo_query', data)
  },
  // 获取项目下全部单体信息
  getMonomerInfo(data) {
    return axios.post('project/buildingInfo_query', data)
  },
  // 获取项目、单体申请信息
  getApplyInfo(data) {
    return axios.post('process/applyInfo_query', data)
  },
  // 获取申请单内详细信息，含项目、项目文档、单体、单体文档
  getApplyDetails(data) {
    return axios.post('process/applyDetails_query', data)
  },
  // 获取文档下载申请信息
  getDownloadApplyInfo(data) {
    return axios.post('process/docApplyInfo_query', data)
  },
  // 获取个人待处理任务
  getPendingApply(data) {
    return axios.post('process/work_query', data)
  },
  // 单个申请文件下载
  downloadSingleFiles(data, config) {
    return axios.get('emergency/down', data, config)
  },
  // 多个申请文件下载
  downloadComplexFiles(data, config) {
    return axios.get('process/listDoc_down', data, config)
  },
  // 文档预览
  previewFile(data, config) {
    return axios.get('emergency/privew', data, config)
  },
  // geoJson文件读取
  loadGeoJson(url) {
    return axios.get(url)
  },

}



