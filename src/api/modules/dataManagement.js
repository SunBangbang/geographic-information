import axios from '../../utils/axios'

export default {

    // getEachJson(url){
    //     return axios.getJson(url)
    // },

    // 锚地基本信息
    getBaseAnchorage(pagesize) {
        return axios.post('BaseAnchorage/getforpage', pagesize)
      },
    // getStatisticalBerth(pagesize) {
    //     return axios.post('StatisticalBerth/getforpage', pagesize)
    //   },
     // 码头泊位基本信息
    getBaseBerth(pagesize) {
        return axios.post('BaseBerth/getforpage', pagesize)
      },
      // 桥梁基本信息
      getBaseBridge(pagesize) {
        return axios.post('BaseBridge/getforpage', pagesize)
      },
      // 洗舱站基本信息
      getBaseCabinwashing(pagesize) {
        return axios.post('BaseCabinwashing/getforpage', pagesize)
      },
      // 航道基本信息
      getBaseChannel(pagesize) {
        return axios.post('BaseChannel/page', pagesize)
      },
      // 基本设施-港口规划-作业区
      getBasePortplanning(pagesize) {
        return axios.post('BasePortplanning/getforpage', pagesize)
      },
      // 船闸基本信息
      getBaseShiplock(pagesize) {
        return axios.post('BaseShiplock/getforpage', pagesize)
      },
      // 基础设施-港口规划-岸线
      gettBaseShoreline(pagesize) {
        return axios.post('tBaseShoreline/getforpage', pagesize)
      },
      // 水上服务区基本信息
      getBaseWaterservice(pagesize) {
        return axios.post('BaseWaterservice/getforpage', pagesize)
      },
      // 作业区基本信息
      getBaseWorkarea(pagesize) {
        return axios.post('BaseWorkarea/getforpage', pagesize)
      },
      // 统计查询-港口泊位
      getStatisticalBerth(pagesize) {
        return axios.post('StatisticalBerth/page', pagesize)
      },
      // 统计查询-港口吞吐-货类吞吐
      getStatisticalCargothroughput(pagesize) {
        return axios.post('StatisticalCargothroughput/page', pagesize)
      },
      // 统计查询-内河航道 内河航道船闸基础状况表
      getStatisticalChannel(pagesize) {
        return axios.post('StatisticalChannel/getforpage', pagesize)
      },
      // 统计查询-航道货运-船闸/航道年度货运量与船舶通过量
      gettStatisticalChannelFreight(pagesize) {
        return axios.post('tStatisticalChannelFreight/getforpage', pagesize)
      },
      // 统计查询-航道货运-货物结构
      gettStatisticalChannelGoodstotal(pagesize) {
        return axios.post('tStatisticalChannelGoodstotal/getforpage', pagesize)
      },
      // 统计查询-港口吞吐-年度集装箱吞吐量
      gettStatisticalContainer(pagesize) {
        return axios.post('tStatisticalContainer/page', pagesize)
      },
      // 统计查询-港口吞吐
      getStatisticalThroughput(pagesize) {
        return axios.post('StatisticalThroughput/getforpage', pagesize)
      },

      // 新增
      // 锚地
      BaseAnChorageetAdd(headers) {
        return axios.toPost('BaseAnchorage/add', headers)
      },
      // 码头
      BaseBerthAdd(headers) {
        return axios.toPost('BaseBerth/add', headers)
      },
      // 桥梁
      BaseBridgeAdd(headers) {
        return axios.toPost('BaseBridge/add', headers)
      },
      // 洗舱站
      BaseCabinwashingAdd(headers) {
        return axios.toPost('BaseCabinwashing/add', headers)
      },
      // 航道
      BaseChannelAdd(headers) {
        return axios.toPost('BaseChannel/add', headers)
      },
      // 基本设施-港口规划-作业区
      BasePortplanningAdd(headers) {
        return axios.toPost('BasePortplanning/add', headers)
      },
      // 船闸
      BaseShiplockAdd(headers) {
        return axios.toPost('BaseShiplock/add', headers)
      },
      //  基本设施-港口规划-岸线
      tBaseShorelineAdd(headers) {
        return axios.toPost('tBaseShoreline/add', headers)
      },
      // 水上服务区
      BaseWaterserviceAdd(headers) {
        return axios.toPost('BaseWaterservice/add', headers)
      },
      // 作业区
      BaseWorkareaAdd(headers) {
        return axios.toPost('BaseWorkarea/add', headers)
      },
      


      // 删除
      // 锚地
      BaseAnChorageetDelete(headers) {
        return axios.post('BaseAnchorage/delete', headers)
      },
      // 码头
      BaseBerthDelete(headers) {
        return axios.post('BaseBerth/delete', headers)
      },
      // 桥梁
      BaseBridgeDelete(headers) {
        return axios.post('BaseBridge/delete', headers)
      },
      // 洗舱站
      BaseCabinwashingDelete(headers) {
        return axios.post('BaseCabinwashing/delete', headers)
      },
      // 航道
      BaseChannelDelete(headers) {
        return axios.post('BaseChannel/delete', headers)
      },
      // 基本设施-港口规划-作业区
      BasePortplanningDelete(headers) {
        return axios.post('BasePortplanning/delete', headers)
      },
      // 船闸
      BaseShiplockDelete(headers) {
        return axios.post('BaseShiplock/delete', headers)
      },
      // 基本设施-港口规划-岸线
      tBaseShorelineDelete(headers) {
        return axios.post('tBaseShoreline/delete', headers)
      },
      // 水上服务区
      BaseWaterserviceDelete(headers) {
        return axios.post('BaseWaterservice/delete', headers)
      },
      // 作业区
      BaseWorkareaDelete(headers) {
        return axios.post('BaseWorkarea/delete', headers)
      },



      // 编辑
      // 锚地
      BaseAnChorageetUpdate(headers) {
        return axios.toPost('BaseAnchorage/update', headers)
      },
      // 码头
      BaseBerthUpdate(headers) {
        return axios.toPost('BaseBerth/update', headers)
      },
      // 桥梁
      BaseBridgeUpdate(headers) {
        return axios.toPost('BaseBridge/update', headers)
      },
      // 洗舱站
      BaseCabinwashingUpdate(headers) {
        return axios.toPost('BaseCabinwashing/update', headers)
      },
      // 航道
      BaseChannelUpdate(headers) {
        return axios.toPost('BaseChannel/update', headers)
      },
      // 基本设施-港口规划-作业区
      BasePortplanningUpdate(headers) {
        return axios.toPost('BasePortplanning/update', headers)
      },
      // 船闸
      BaseShiplockUpdate(headers) {
        return axios.toPost('BaseShiplock/update', headers)
      },
      // 基本设施-港口规划-岸线
      tBaseShorelineUpdate(headers) {
        return axios.toPost('tBaseShoreline/update', headers)
      },
      // 水上服务区
      BaseWaterserviceUpdate(headers) {
        return axios.toPost('BaseWaterservice/update', headers)
      },
      // 作业区
      BaseWorkareaUpdate(headers) {
        return axios.toPost('BaseWorkarea/update', headers)
      },


}