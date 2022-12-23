import axios from '../../utils/axios'

export default {


    //港口泊位
    //泊位类型
    getBerthTypeCount(datas) {
        // return axios.post('StatisticalBerth/bwle',data)
        return axios.post('statistic-analysis/berth/type-count',datas)
    },
    //年度泊位数量
    getWaterBerthCount(datas) {
        // return axios.post('StatisticalBerth/tgnl',data)
        return axios.post('statistic-analysis/berth/berth-number',datas)
    },
    //通过能力
    getAdoptAbility(datas) {
        return axios.post('statistic-analysis/berth/ability',datas)
    },
    //市域港口
    getCityAreaPort(datas) {
        // return axios.post('StatisticalBerth/sygkbw',data)
        return axios.post('statistic-analysis/berth/cities-count',datas)
    },
    //年度泊位数量趋势
    getYearBerthCount(datas) {
        // return axios.post('StatisticalBerth/bwqs',data)
        return axios.post('statistic-analysis/berth/trends',datas)
    },
    //年度通过能力
    getBerthCountTrend(datas) {
        return axios.post('statistic-analysis/berth/trends',datas)
    },
 
     //内河航道
     //航道结构
    getChannelStructural(data){
        return axios.post('StatisticalChannel/hdlc',data)
    },
    //航道里程
    getChannelMileage(data){
        return axios.post('StatisticalChannel/bowslcx',data)
    },
    //航道等级变化趋势
    getChannelGradeChange(data){
        return axios.post('StatisticalChannel/xz',data)
    },
    //市域航道里程
    getChannelCityMileage(data){
        return axios.post('StatisticalChannel/syhdlc',data)
    },
    //单个市航道里程
    getChannelSingleCityMileage(data){
        return axios.post('StatisticalChannel/ndcshdzs',data)
    },
    //单个市航道等级变化趋势
    getChannelSingleCityGradeChange(data){
        return axios.post('StatisticalChannel/hdlcs',data)
    },


    //港口吞吐
    //货物结构
    getHuffAndPuffStructure(datas){
        // return axios.post('StatisticalThroughput/hltt',data)
        return axios.post('statistic-analysis/port/cargo-struct',datas)
    },
    //港口吞吐量
    getHuffAndPuffPort(datas){
        return axios.post('statistic-analysis/port/throughput',datas)
    },
    //特殊货物趋势
    getHuffAndPuffSpecialTrend(datas){
        return axios.post('statistic-analysis/port/special-cargo',datas)
    },
    //分市港口吞吐量
    getHuffAndPuffPortCity(datas){
        return axios.post('statistic-analysis/port/handling-capacity/cities',datas)
    },
    //港口吞吐量（XX市）
    getHuffAndPuffPortSingleCity(datas){
        return axios.post('statistic-analysis/port/throughput',datas)
    },
    //特殊货种吞吐量趋势（XX市）
    getHuffAndPuffSpecialTrendOfCity(datas){
        return axios.post('statistic-analysis/port/special-cargo',datas)
    },

    //航道货运
    //获取航道
    getRoadAll() {
        return axios.post('StatisticalCompany/getAlls')
    },
    //获取货物类型
    getGoodsType() {
        return axios.post('tStatisticalGoodstype/getAll')
    },
    //查询所有船闸跟航道
    getRoadAndGateAll(data) {
        return axios.post('StatisticalCompany/getAllhx',data)
    },
    
    //货种结构
    getCargoProportion(data) {
        return axios.post('tStatisticalChannelFreight/hwjgzb',data)
    },
     //航道货运量
    getCargoStructure(data) {
        return axios.post('tStatisticalChannelFreight/syhwjg',data)
    },
    //船舶通过量
    getFreightVolume(data) {
        return axios.post('tStatisticalChannelFreight/xzl',data)
    },
    //查询货运中下的图表
    getTransport(data) {
        return axios.post('tStatisticalChannelFreight/hwl',data)
    },
    //查询货运中下的所有图表
    getTransportAll() {
        return axios.post('tStatisticalChannelFreight/all')
    },

    //航道船闸货运量（右一图）
    getCargoVolumeOfChannelLock(data) {
        return axios.post('tStatisticalChannelFreight/hdndhy',data)
    },
    //航道年度船舶通过（右二图）
    getChannelLockThroughput(data) {
        return axios.post('tStatisticalChannelFreight/cbtgl',data)
    },
    


    //货运OD
    //始发地
    getOdPlaceOfOrigin() {
        return axios.post('StatisticalStartandend/getAll')
    },  
    //目的地
    getOdDestination() {
        return axios.post('StatisticalStartandend/getAll')
    },
    //OD货物种类
    getOdgoodsType() {
        return axios.post('tStatisticalGoodstype/getAll')
    },
    //查询OD表格
    // getOdTable(data){
    //     return axios.post('tStatisticalLockage/getforpage',data)
    // },
    getOdTable(data){
        return axios.post('statistical/freight-od/page',data)
    },
    
    //货运OD图表
    getOdErchaerts(datas){
        return axios.post('tStatisticalLockage/getforpages',datas)
    },
    // 雷达图
    getOdRadar(data){
        return axios.post('tStatisticalLockage/getld',data)
    },
    // 桑葚图
    getOdMulberry(data){
        return axios.post('tStatisticalLockage/getsjt',data)
    }

}