import axios from '../../utils/axios'

export default {

  //港口
  // 港口作业区树形结构
  getPortTree() {
    return axios.post('BasePortplanning/getTree')
  },
  // 港口岸线树形结构
  getShorelineTree() {
    return axios.post('tBaseShoreline/getTree')
  },
  // 查询港区数量
  getIsuse() {
    return axios.post('BasePortplanning/getOperationAreaNumb')
  },
  // 查询作业区使用与不使用数量
  getGknum() {
    return axios.post('BasePortplanning/getOperationAreaNumz')
  },
  // 查询作业区数量
  getGqmun() {
    return axios.post('BasePortplanning/getAreaNum')
  },
  //港口，航道，船闸
  getGkAllCount() {
    return axios.post('BasePortplanning/getsjtj')
  },


  //码头
  // 码头树形结构
  getWharfTree(data) {
    return axios.post('basemt/gettree',data)
  },
  //码头统计数据
  getWharfAllCount() {
    return axios.post('basemt/getsjtj')
  },
  // 码头泊位总量
  getWharfCount() {
    return axios.post('basemt/lxsltj')
  },
  // 个个种类的泊位数量
  getWharfType() {
    return axios.post('basemt/zlsltj')
  },
  // 泊位数量等级
  getWharfGrade() {
    return axios.post('basemt/lxtj')
  },




  //锚地
  getAnchorageAllCount() {
    return axios.post('basemd/getsjtj')
  },
  //分页查询锚地信息
  getAllAnchorage(data) {
    return axios.post('basemd/tree', data)
  },

  //查询锚地种类数量
  getAnchorageType() {
    return axios.post('basemd/getcitymd')
  },
  //查询锚地类别数量
  getAnchorageCategory() {
    return axios.post('basemd/lxsltj')
  },
  //查询现状/规划数量
  getAnchoragePlan() {
    return axios.post('basemd/zlsltj')
  },


  //航道
  //航道左侧表格
  getChannelTable(data) {
    return axios.post('BaseChannel/tree', data)
  },
  getChannelAllCount() {
    return axios.post('BaseChannel/getsjtj')
  },
  //查询市域航道里程 折线图
  getChannelLine() {
    return axios.post('BaseChannel/getshdlc')
  },
  //查询等级航道里程饼图
  getChannelCircular() {
    return axios.post('BaseChannel/getlevelb')
  },
  //查询等级航道里程柱状图
  getChannelColumn() {
    return axios.post('BaseChannel/getlevelz')
  },






  //船闸
  getShipLockAllCount() {
    return axios.post('BaseShiplock/getsjtj')
  },
  //船闸折线
  getShipLockLine() {
    return axios.post('BaseShiplock/czsl')
  },
  //船闸饼图
  getShipLockCircular() {
    return axios.post('BaseShiplock/cztg')
  },
  //船闸柱状
  getShipLockColumn() {
    return axios.post('BaseShiplock/gethdczsl')
  },
  getShipLockTree(data) {
    return axios.post('BaseShiplock/getTree',data)
  },




  //其他(桥梁)
  getBridgeTree(data) {
    return axios.post('BaseBridge/getTree',data)
  },
  //服务区
  getWaterserviceTable(data) {
    return axios.post('BaseWaterservice/getforpage', data)
  },
  //洗舱站
  getCabinwashingTable(data) {
    return axios.post('BaseCabinwashing/getforpage', data)
  },
  // getAllBaseBerth(){
  //   return axios.post('basemt/getAll')
  // },

  // // 港口
  // getBasePort(){
  //   return axios.post('BasePort/getAll')
  // },

  // 桥梁
  getBaseBridge() {
    return axios.post('BaseBridge/getAll')
  },
  // 船闸
  getBaseShiplock() {
    return axios.post('BaseShiplock/getAll')
  },
  // 船闸
  getBaseShiplockid() {
    return axios.post('BaseShiplock/getById')
  },
  // 航道
  getBaseChannel() {
    return axios.post('BaseChannel/getAll')
  },
  // 锚地
  // getBaseAnchorage(){
  //   return axios.post('BaseChannel/getAll')
  // },
  getBaseAnchorage() {
    return axios.post('BaseAnchorage/getAll')
  },
  // 服务区
  getBaseWaterservice() {
    return axios.post('BaseWaterservice/getAll')
  },
  // 洗舱站
  getBaseCabinwashing() {
    return axios.post('BaseCabinwashing/getAll')
  },
  // 作业区
  getBasePortplanning() {
    return axios.post('BasePortplanning/getAll')
  },
  // 岸线
  gettBaseShoreline() {
    return axios.post('tBaseShoreline/getAll')
  },


  //码头单个点位
  getByid(data) {
    return axios.post('basemt/getbyid', data)
  },

  //航道左侧表格
  getworkTable(data) {
    return axios.post('BaseWorkarea/getforpage', data)
  },


  // 码头树形图全部信息
  getAllBaseBerth() {
    return axios.post('BaseBerth/getAll')
  },
  //航道左侧所有表格
  getAllChannelTable() {
    return axios.post('BaseChannel/getAll')
  },
  // 船闸左侧所有数据
  getShipLockTreeAll() {
    return axios.post('BaseShiplock/getAll')
  },
  //锚地左侧所有表格
  getAllAnchorageTable() {
    return axios.post('BaseAnchorage/getAll')
  },
   //服务区左侧所有表格
   getAllBaseWaterservice() {
    return axios.post('BaseWaterservice/getAll')
  },
  // 港口作业区树形结构
  getAllPortTree() {
    return axios.post('BasePortplanning/getAll')
  },
}
