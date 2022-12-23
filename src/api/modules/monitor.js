import axios from '../../utils/axios'

export default {
    // 港航发展总体形势左边第一个图标
    getWharfType() {
        return axios.post('basemt/zlsltj')
    },
    // 港航发展总体形势左边第二个图标
    getWharfCount() {
        return axios.post('basemt/lxsltj')
    },
    // 港航发展总体形势右边第一个图标
    getWharfType1() {
        return axios.post('basemt/zlsltj')
    },
    // 港航发展总体形势右边第二个图标
    getWharfCount1() {
        return axios.post('basemt/lxsltj')
    },
    //基础设施(港口)第一个图标
    portrightone(data) {
        return axios.post('situationPortinfrastructure/dgpssl', data)
    },
    //基础设施(港口)第二个图标
    portrighttwo(data) {
        return axios.post('situationPortinfrastructure/gkktl', data)
    },
    //基础设施(港口)第三个图标
    portrightthree(data) {
        return axios.post('situationPortinfrastructure/bwlyl', data)
    },
    //基础设施(港口)第四个图标
    portrightfour(data) {
        return axios.post('situationPortinfrastructure/bwlnb', data)
    },
    //基础设施(港口)第五个图标
    portrightfive(data) {
        return axios.post('situationPortinfrastructure/lyspybp', data)
    },


    // 基础设施(航道)第一个图标
    channelrightone(data) {

        return axios.post('situationWaterwayinfrastructure/cbtgl', data)
    },
    // 基础设施(航道)第二个图标
    channelrighttwo(data) {
        return axios.post('situationWaterwayinfrastructure/cbhyl', data)
    },
    // 基础设施(航道)第三个图标
    channelrightthree(data) {

        return axios.post('situationWaterwayinfrastructure/lyspybp', data)
    },



    // 基础设施(船闸)第一个图标
    lockrightone(data) {
        return axios.post('situationNavigationlock/cbtgl', data)
    },
    // 基础设施(船闸)第二个图标
    lockrighttwo(data) {
        return axios.post('situationNavigationlock/cbhyl', data)
    },
    // 基础设施(船闸)第三个图标
    lockrightthree(data) {
        return axios.post('situationNavigationlock/lyspybp', data)
    },


    // 基础设施(锚地)第一个图标
    anchoragerightone() {
        return axios.post('basemt/lxsltj')
    },
    // 基础设施(锚地)第二个图标
    anchoragerighttwo() {
        return axios.post('basemt/lxsltj')
    },
    // 基础设施(锚地)第三个图标
    anchoragerightthree() {
        return axios.post('basemt/lxsltj')
    },
    // 基础设施(锚地)第四个图标
    anchoragerightfour() {
        return axios.post('basemt/lxsltj')
    },
    // 基础设施(锚地)第五个图标
    anchoragerightfive() {
        return axios.post('basemt/lxsltj')
    },



    // 船舶运行分析第一个图标
    shiprightone() {
        return axios.post('basemt/zlsltj')
    },




    //港航运行态势分析(港口)第一个图标
    operationportone() {
        return axios.post('basemt/lxsltj')
    },
    //港航运行态势分析(港口)第二个图标
    operationporttwo() {
        return axios.post('basemt/lxsltj')
    },
    //港航运行态势分析(港口)第三个图标
    operationportthree(data) {
        return axios.post('situation/busy', data)
    },
    //港航运行态势分析(港口)第四个图标
    operationportfour(datas) {
        return axios.post('situation/port/performance', datas)
    },


    //港航运行态势分析(航道)第一个图标
    operationchannelone() {
        return axios.post('basemt/lxsltj')
    },
    //港航运行态势分析(航道)第二个图标
    operationchanneltwo() {
        return axios.post('basemt/lxsltj')
    },
    //港航运行态势分析(船闸)第一个图标
    operationlockone() {
        return axios.post('basemt/lxsltj')
    },
    //港航运行态势分析(船闸)第二个图标
    operationlocktwo() {
        return axios.post('basemt/lxsltj')
    },



    // 岸线点位
    gettBaseShoreline() {
        return axios.post('tBaseShoreline/getAll')
    },
    // 航道点位
    getBaseChannel() {
        return axios.post('BaseChannel/getAll')
    },
    // 船闸
    getBaseShiplock() {
        return axios.post('BaseShiplock/getAll')
    },

    // 港航发展总体形势OB
    getOdErchaerts(data) {
        return axios.post('tStatisticalLockage/getforpages', data)
    },


    // 热力图
    getBaseCabinwashing() {
        return axios.post('situation/soa/thermodynamic')
    },

    // 港航发展左侧货物运量指数
    freight(datas) {
        return axios.post('freight/count/one', datas)
    },

    // 港航发展左侧指数走势分析图
    categorys(datas) {
        return axios.post('freight/count/category', datas)
    },

    // 港航发展左侧指数走势分析图
    categorytable(datas) {
        return axios.post('freight/rate/category', datas)
    },



    // 港航发展右侧货物运量指数
    throughfreight(datas) {
        return axios.post('through/count/one', datas)
    },

    // 港航发展右侧指数走势分析图
    throughcategorys(datas) {
        return axios.post('through/count/category', datas)
    },

    // 港航发展右侧指数走势分析图
    throughcategorytable(datas) {
        return axios.post('through/rate/category', datas)
    },
    // 船舶运行分析第一个饼图
    ShipOperationAnalysisOne(){
        return axios.post('situation/operational-analysis/struct-map')
    },
    // 船舶运行分析第二个饼图
    ShipOperationAnalysisTwo(){
        return axios.post('situation/operational-analysis/gross-load-map')
    },
    // 船舶运行分析第三个饼图
    ShipOperationAnalysisThree(){
        return axios.post('situation/operational-analysis/organization')
    },



    //航道左侧表格
    getChannelTable() {
        return axios.post('BaseChannel/tree')
    },
    //航道左侧所有表格
    getAllChannelTable() {
        return axios.post('BaseChannel/getAll')
    },
    //船闸左侧表格
    getShipLockTree() {
        return axios.post('BaseShiplock/getTree')
    },
    // 船闸左侧所有数据
    getShipLockTreeAll() {
        return axios.post('BaseShiplock/getAll')
    },
    //锚地左侧表格
    getAllAnchorage(data) {
        return axios.post('basemd/tree', data)
    },
    //锚地左侧所有表格
    getAllAnchorageTable() {
        return axios.post('BaseAnchorage/getAll')
    },
    //作业区左侧表格
    getworkTable(data) {
        return axios.post('situation/work-area/tree', data)
    },
    //作业区左侧 all
    getworkAll() {
        return axios.post('situation/work-area/all')
    },


    //断面流量左侧表格
    getLineChannelFracture(datas) {
        return axios.post('situation/soa/section/list',datas)
    },

    //断面流量单条
    getLineChannel(datas) {
        return axios.post('situation/soa/section',datas)
    },
}