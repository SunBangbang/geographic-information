import axios from '../../utils/axios'

export default {
  // 获取项目总览页面的统计分析接口
  getStatisticalAnalysis(data) {
    return axios.post('overview/statistics_query', data)
  },
  // bim数据分析接口
  getBimAnalysis(data) {
    return axios.post('overview/bimData_query', data)
  }
}
