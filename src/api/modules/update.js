import axios from '../../utils/axios'

export default {
  /**
   * 项目信息新增或编辑
   * 说明：该接口支持新增和编辑功能，如参数projectinfo对象中不存在proid字段，则认为是新增项目信息。
   */
  uploadProjectInfo(data) {
    return axios.file('project/projectInfo_edit', data)
  },
  /**
   * 单体信息新增或编辑
   * 说明：该接口支持新增和编辑功能，如参数buildinginfo对象中不存在buildingid字段，则认为是新增单体信息。
   */
  uploadBuildingInfo(data, onUploadProgress) {
    return axios.file(
      'project/buildingInfo_edit',
      data,
      null,
      null,
      onUploadProgress
    )
  },
  // 项目提交
  submitProject(data) {
    return axios.post('project/projectsubmit_edit', data)
  },
  // 项目删除（不经过申请流程）
  deleteProject(data) {
    return axios.post('project/project_delete', data)
  },
  // 项目删除（经过申请流程）
  deleteProjectApply(data) {
    return axios.post('project/proDelApply_edit', data)
  },
  // 单体提交
  submitMonomer(data) {
    return axios.post('project/buildingsubmit_edit', data)
  },
  // 单体信息删除（不经过申请流程）
  deleteMonomer(data) {
    return axios.post('project/building_delete', data)
  },
  // 单体信息删除（经过申请流程）
  deleteMonomerApply(data) {
    return axios.post('project/buildingDelApply_edit', data)
  },
  // 项目、单体审批通过
  examineApproved(data) {
    return axios.post('process/adoptApply_edit', data)
  },
  // 项目、单体审批驳回
  examineReject(data) {
    return axios.post('process/rejectApply_edit', data)
  },
  // 提交下载申请
  submitDownloadApply(data) {
    return axios.file('process/addDocDownApply_edit', data)
  },
  // 下载申请审批通过
  downloadExamineApproved(data) {
    return axios.post('process/adoptDocApply_edit', data)
  },
  // 下载申请审批驳回
  downloadExamineReject(data) {
    return axios.post('process/rejectDocDownApply_edit', data)
  },
  // 删除上传审核记录
  deleteExamineInfo(data) {
    return axios.post('process/apply_dele', data)
  },
  // 删除下载审核记录
  deleteDownloadExamineInfo(data) {
    return axios.post('process/docapply_dele', data)
  }
}
