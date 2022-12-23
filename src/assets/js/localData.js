// EPSG映射关系
const epsg = [
  {
    label: 'EPSG:4554 CGCS2000 / 3-degree Gauss-Kruger CM 135E',
    value: 4554
  },
  {
    label: 'EPSG:4553 CGCS2000 / 3-degree Gauss-Kruger CM 132E',
    value: 4553
  },
  {
    label: 'EPSG:4552 CGCS2000 / 3-degree Gauss-Kruger CM 129E',
    value: 4552
  },
  {
    label: 'EPSG:4551 CGCS2000 / 3-degree Gauss-Kruger CM 126E',
    value: 4551
  },
  {
    label: 'EPSG:4550 CGCS2000 / 3-degree Gauss-Kruger CM 123E',
    value: 4550
  },
  {
    label: 'EPSG:4549 CGCS2000 / 3-degree Gauss-Kruger CM 120E',
    value: 4549
  },
  {
    label: 'EPSG:4548 CGCS2000 / 3-degree Gauss-Kruger CM 117E',
    value: 4548
  },
  {
    label: 'EPSG:4547 CGCS2000 / 3-degree Gauss-Kruger CM 114E',
    value: 4547
  },
  {
    label: 'EPSG:4546 CGCS2000 / 3-degree Gauss-Kruger CM 111E',
    value: 4546
  },
  {
    label: 'EPSG:4545 CGCS2000 / 3-degree Gauss-Kruger CM 108E',
    value: 4545
  },
  {
    label: 'EPSG:4544 CGCS2000 / 3-degree Gauss-Kruger CM 105E',
    value: 4544
  },
  {
    label: 'EPSG:4543 CGCS2000 / 3-degree Gauss-Kruger CM 102E',
    value: 4543
  }
]

// 城市信息
const city = [
  {
    value: '南京市',
    label: '南京市'
  },
  {
    value: '常州市',
    label: '常州市'
  },
  {
    value: '徐州市',
    label: '徐州市'
  },
  {
    value: '淮安市',
    label: '淮安市'
  },
  {
    value: '南通市',
    label: '南通市'
  },
  {
    value: '宿迁市',
    label: '宿迁市'
  },
  {
    value: '无锡市',
    label: '无锡市'
  },
  {
    value: '扬州市',
    label: '扬州市'
  },
  {
    value: '盐城市',
    label: '盐城市'
  },
  {
    value: '苏州市',
    label: '苏州市'
  },
  {
    value: '泰州市',
    label: '泰州市'
  },
  {
    value: '镇江市',
    label: '镇江市'
  },
  {
    value: '连云港市',
    label: '连云港市'
  }
]

// 字段映射关系（项目、单体）
const field = {
  city: '所属地市', // 4
  construction: '建设单位', // 15
  company: '提交单位', // 15
  cycle: '建设周期', // 13
  design: '设计单位', // 12
  director: '主管单位', // 11
  investment: '工程投资', // 10
  projectmileage: '项目总里程', // 5
  waterwayone: '一级航道里程',
  waterwaytwo: '二级航道里程',
  waterwaythree: '三级航道里程',
  waterwayfour: '四级航道里程',
  procode: '项目编号', // 1
  proname: '项目名称',
  projectname: '项目名称', // 2
  projectstage: '项目阶段', // 6
  standard: '建设标准', // 9
  status: '项目状态', // 3
  uploadtime: '提交时间', // 14
  waterway: '航道里程', // 8
  waterwaylevel: '航道等级', // 7
  bimtype: '模型原格式',
  buildingname: '单体名称',
  buildingcode: '单体编码',
  buildingtype: '单体类型',
  buildingmileage: '护岸模型里程',
  latitude: '基点纬度',
  longitude: '基点经度',
  rotatez: '基北旋转角',
  stage: '项目阶段',
  tilesname: '3dtiles文件名称',
  tilessize: '3dtiles文件大小',
  username: '提交账号', // 16
  rolename: '提交者类别',
  applydate: '申请时间',
  applyreason: '申请原因',
  datapurpose: '数据用途',
  altitudesys: '高程系',
  coordinates: '坐标系',
  epsg: 'geoJson文件坐标系',
  buildingepsg: '模型基点坐标系'
}

// 字段映射关系（审核单体信息）
const examineMonField = {
  buildingname: '单体名称',
  buildingcode: '单体编码',
  proname: '所属项目',
  projectname: '所属项目', // 2
  buildingtype: '单体类型',
  city: '所属地市',
  stage: '项目阶段',
  bimtype: '模型原格式',
  tilesname: '3dtiles文件名称',
  tilessize: '3dtiles文件大小',
  longitude: '模型基点经度',
  latitude: '模型基点纬度',
  rotatez: '正北旋转角',
  status: '项目状态', // 3
  username: '提交账号', // 16
  company: '提交单位',
  uploadtime: '提交时间' // 14
}

// 字段映射关系（用户）
const userField = {
  addr: '单位地址',
  city: '所在城市',
  company: '用户单位',
  department: '所属部门',
  email: '邮箱地址',
  gender: '性别',
  icard: '身份证号',
  id: '用户id',
  imgurl: '用户头像',
  name: '注册账号',
  phone: '联系电话',
  realname: '负责人',
  roleid: '用户类别',
  rolename: '用户类别'
}

// 角色
const role = [
  {
    value: '1',
    label: '省级主管部门'
  },
  {
    value: '2',
    label: '市级主管部门'
  },
  {
    value: '3',
    label: '设计单位'
  },
  {
    value: '4',
    label: '施工单位'
  },
  {
    value: '5',
    label: '运维单位'
  },
  {
    value: '6',
    label: '咨询单位'
  }
]

// 性别
const gender = [
  {
    value: '男',
    label: '男'
  },
  {
    value: '女',
    label: '女'
  }
]

// 单体类型
const mononerType = [
  {
    value: '船闸',
    label: '船闸'
  },
  {
    value: '护岸',
    label: '护岸'
  },
  {
    value: '桥梁',
    label: '桥梁'
  },
  {
    value: '水闸',
    label: '水闸'
  },
  {
    value: '地涵',
    label: '地涵'
  },
  {
    value: '泵站',
    label: '泵站'
  },
  {
    value: '锚地',
    label: '锚地'
  },
  {
    value: '其他',
    label: '其他'
  }
]

// 单体类型排序
const mononerTypeOrder = [
  '船闸',
  '护岸',
  '桥梁',
  '水闸',
  '地涵',
  '泵站',
  '锚地',
  '其他'
]

// 文件类型排序
const fileTypeOrder = [
  '属性数据',
  '信息模型说明',
  '交付成果清单',
  '项目图纸',
  '技术报告',
  '政府批复文件',
  'BIM实施方案',
  '视频',
  '其他',
  '总装模型'
]

// 审核项目信息排序
const examineProInfoOrder = [
  '项目名称',
  '项目编号',
  '所属地市',
  '建设标准',
  '建设周期',
  '工程投资',
  '主管单位',
  '设计单位',
  '建设单位',
  '项目总里程',
  '一级航道里程',
  '二级航道里程',
  '三级航道里程',
  '四级航道里程',
  '高程系',
  '坐标系',
  'geoJson文件坐标系',
  '项目状态',
  '提交账号',
  '提交单位',
  '提交时间'
]

// 审核单体信息排序
const examineMonInfoOrder = [
  '单体名称',
  '单体编码',
  '所属项目',
  '单体类型',
  '所属地市',
  '项目阶段',
  '模型原格式',
  '3dtiles文件名称',
  '3dtiles文件大小',
  '模型基点经度',
  '模型基点纬度',
  '正北旋转角',
  '项目状态',
  '提交账号',
  '提交单位',
  '提交时间'
]

// 审核下载信息排序
const examineDownloadOrder = [
  '项目名称',
  '项目编号',
  '所属地市',
  '申请原因',
  '数据用途',
  '项目状态',
  '提交账号',
  '提交单位',
  '申请时间'
]

// 用户信息排序
const userInfoOrder = [
  '注册账号',
  '用户类别',
  '用户单位',
  '负责人',
  '性别',
  '所属部门',
  '联系电话',
  '邮箱地址',
  '单位地址',
  '所在城市',
]

// 基础设施

const infrastructure = [
  { label: '锚地基本信息', prop: 'BaseAnchorage' },
  { label: '码头泊位基本信息', prop: 'BaseBerth' },
  { label: '桥梁基本信息', prop: 'BaseBridge' },
  { label: '洗舱站基本信息', prop: 'BaseCabinwashing' },
  { label: '航道基本信息', prop: 'BaseChannel' },
  { label: '基本设施-港口规划-作业区', prop: 'BasePortplanning' },
  { label: '船闸基本信息', prop: 'BaseShiplock' },
  { label: '基础设施-港口规划-岸线', prop: 'tBaseShoreline' },
  { label: '水上服务区基本信息', prop: 'BaseWaterservice' },
  { label: '作业区基本信息', prop: 'BaseWorkarea' },

]

// 统计查询
const statisticalQuery = [
  { label: '统计查询-港口泊位', prop: 'StatisticalBerth' },
  { label: '统计查询-港口吞吐-货类吞吐', prop: 'StatisticalCargothroughput' },
  { label: '统计查询-内河航道 内河航道船闸基础状况表', prop: 'StatisticalChannel' },
  { label: '统计查询-航道货运-船闸/航道年度货运量与船舶通过量', prop: 'tStatisticalChannelFreight' },
  { label: '统计查询-航道货运-货物结构', prop: 'tStatisticalChannelGoodstotal' },
  { label: '统计查询-港口吞吐-年度集装箱吞吐量', prop: 'tStatisticalContainer' },
  { label: '统计查询-港口吞吐', prop: 'StatisticalThroughput' },
]
// 态势监测
const situationMonitoring = [
  { label: '态势监测', prop: 'anchorageuse' },
]


// 锚地基本信息
const BaseAnchorage = [
  { label: '唯一识别符', prop: 'objectid',message:'请输入唯一识别符' },
  { label: '城市', prop: 'city', message:'请输入城市' },
  { label: '锚地编号', prop: 'anchorageno' },
  { label: '锚地名称', prop: 'anchoragename' },
  { label: '锚地位置', prop: 'anchoragelocation' },
  { label: '锚地长度', prop: 'anchoragelength' },
  { label: '锚地用途', prop: 'anchorageuse' },
  { label: '单位电话', prop: 'worktelephone' },
  { label: '锚地类型', prop: 'anchoragetype' ,},
  { label: '锚位数量', prop: 'anchornum' },
  { label: '港口类型', prop: 'achanneltype' ,type:2},
  { label: '锚位现状', prop: 'presentsituation' },
  { label: '锚位规划', prop: 'achanneplan' },
  { label: '坐标数据', prop: 'coordinates' },
  // { label: '坐标类型', prop: 'type' },

]


// 码头泊位基本信息
const BaseBerth = [
  { label: '唯一识别符', prop: 'objectid' },
  { label: ' 城市', prop: 'city' },
  { label: '泊位名称', prop: 'berthname' },
  { label: '港口经营许可证', prop: 'portlicense' },
  { label: ' 港口岸线使', prop: 'portline' },
  { label: ' 港口管理单位', prop: 'portmanage' },
  { label: '  所属港口名称', prop: 'port' },
  { label: ' 港口唯一识别符', prop: 'portobjectid' },
  { label: ' 所属港区名称', prop: 'portarea' },
  { label: ' 所属港区唯一识别符', prop: 'portareaobjectid' },
  { label: ' 港口企业', prop: 'enterprise' },
  { label: '  泊位代码', prop: 'berthcode' },
  { label: ' 泊位属性', prop: 'berthtype' },
  { label: '泊位水系', prop: 'berthriver' },
  { label: ' 生产类型', prop: 'productiontype' },
  { label: ' 服务类型', prop: 'servicetype' },
  { label: ' 结构型式', prop: 'structuretype' },
  { label: '主要用途', prop: 'purpose' },
  { label: ' 投产年份', prop: 'putinto' },
  { label: '竣工日期', prop: 'completed' },
  { label: ' 前沿水深', prop: 'frontdepth' },
  { label: ' 泊位长度', prop: 'berthlength' },
  { label: ' 泊位个数', prop: 'berthnum' },
  { label: ' 设计能力', prop: 'designcapability' },
  { label: ' 设计年限', prop: 'designperiod' },
  { label: '备注', prop: 'note' },
  { label: ' 坐标数据', prop: 'coordinates' },
  // { label: ' 坐标类型', prop: 'type' },
]

// 桥梁基本信息
const BaseBridge = [
  { label: ' 唯一识别符', prop: 'objectid' },
  { label: '桥梁名称', prop: 'bridgename' },
  { label: '  桥梁编码', prop: 'bridgcode' },
  { label: '桥梁管理单位', prop: 'bridgmanagement' },
  { label: ' 所在行政区划', prop: 'administrativeregion' },
  { label: ' 所属城市', prop: 'city' },
  { label: '  所属航道名称', prop: 'channelname' },
  { label: ' 航段现状技术等级', prop: 'segmentlevel' },
  { label: ' 所属航段名称', prop: 'segmentname' },
  { label: ' 建成时间', prop: 'completiontime' },
  { label: ' 用途分类', prop: 'purpose' },
  { label: ' 结构形式', prop: 'structure' },
  { label: '  是否有桥涵标', prop: 'isbridgesculverts' },
  { label: ' 是否发光标', prop: 'isluminescence' },
  { label: '  是否设置桥墩防护设施', prop: 'ispier' },
  { label: ' 桥墩防护设施类别', prop: 'piertype' },
  { label: ' 是否满足航道规划等级别标准', prop: 'isplanningstandards' },
  { label: '  是否满足航道现状等级标准', prop: 'iscurrentlevel' },
  { label: '  是否水中落墩', prop: 'isdroppier' },
  { label: '  是否碍航', prop: 'isnavigationobstruction' },
  { label: '  通航孔跨径', prop: 'span' },
  { label: ' 通航孔设计净宽', prop: 'wide' },
  { label: '  通航孔设计净高', prop: 'heigit' },
  { label: '  坐标数据', prop: 'coordinates' },
  // { label: '  坐标类型', prop: 'type' },
]


// 洗舱站基本信息
const BaseCabinwashing = [
  { label: ' 唯一识别符', prop: 'objectid' },
  { label: '洗舱站名称', prop: 'cabinname' },
  { label: '坐标数据', prop: 'coordinates' },
  // { label: '坐标类型', prop: 'type' },
]
// 航道基本信息
const BaseChannel = [
  { label: ' 唯一识别符', prop: 'objectid' },
  { label: '航道名称', prop: 'channelname' },
  { label: '起讫点', prop: 'origindestination' },
  { label: '航道里程', prop: 'channelmileage' },
  { label: '航道水深', prop: 'channeldepth' },
  { label: '规划等级', prop: 'planninglevel' },
  { label: '现状等级', prop: 'presentlevel' },
  { label: '跨河桥梁', prop: 'crossingbridg' },
  { label: '碍航桥梁', prop: 'obstructingbridge' },
  { label: '坐标数据', prop: 'coordinates' },
  // { label: '坐标类型', prop: 'type' },

]

// 基本设施-港口规划-作业区
const BasePortplanning = [
  { label: '唯一识别符', prop: 'objectid' },
  { label: '名称', prop: 'name' },
  { label: '城市', prop: 'city' },
  { label: '港口名称', prop: 'portname' },
  { label: '港区名称', prop: 'portareaname' },
  { label: '面积', prop: 'area' },
  { label: '岸线长度（米）', prop: 'shorelinelength' },
  { label: '陆域纵深（米）', prop: 'landdepth' },
  { label: '建设性质', prop: 'nature' },
  { label: '建设时序', prop: 'sequential' },
  { label: '坐标数据', prop: 'coordinates' },
  // { label: '坐标类型', prop: 'type' },

]


// 船闸基本信息
const BaseShiplock = [
  { label: '唯一识别符 ', prop: 'objectid' },
  { label: '船闸名称 ', prop: 'shiplockname' },
  { label: '所属航道名称 ', prop: 'channelname' },
  { label: '所属通道 ', prop: 'passageway' },
  { label: ' 所属城市 ', prop: 'city' },
  { label: '  通航里程 ', prop: 'navigationmileage' },
  { label: ' 航道近期维护等级 ', prop: 'maintenancelevel' },
  { label: '  河口宽度 ', prop: 'estuarywidth' },
  { label: '  设计最低通航水位 ', prop: 'navigationwater' },
  { label: ' 水深 ', prop: 'waterdepth' },
  { label: ' 底宽 ', prop: 'bottomwidth' },
  { label: '  航宽 ', prop: 'navigationwidth' },
  { label: '   弯曲半径 ', prop: 'bendingradius' },
  { label: '   底标高 ', prop: 'bottomelevation' },
  { label: '  航道等级 ', prop: 'channellevel' },
  { label: '  所在航道近期维护等级 ', prop: 'channelmaintenancelevel' },
  { label: '  建设地点 ', prop: 'constructionsite' },
  { label: '  建设部门 ', prop: 'constructiondepart' },
  { label: '  建成时间 ', prop: 'completiontime' },
  { label: ' 上游最高水位 ', prop: 'maxupperwater' },
  { label: ' 上游最低水位 ', prop: 'minupperwater' },
  { label: '下游最高水位 ', prop: 'maxdownwater' },
  { label: '   下游最低水位 ', prop: 'mindownwater' },
  { label: '   长度LK ', prop: 'length' },
  { label: '  闸室宽度BK ', prop: 'chamberwidth' },
  { label: '     门槛水深HK ', prop: 'thresholddepth' },
  { label: '     闸首口门宽度 ', prop: 'headwidth' },
  { label: '   设计通过能力 ', prop: 'designcapacity' },
  { label: ' 现通过量 ', prop: 'presentcapacity' },
  { label: '  坐标数据 ', prop: 'coordinates' },
  // { label: '  坐标类型 ', prop: 'type' },

]


// 基础设施-港口规划-岸线

const tBaseShoreline = [
  { label: '唯一识别符', prop: 'objectid' },
  { label: '岸线名称', prop: 'shorelinename' },
  { label: '城市', prop: 'city' },
  { label: '港口', prop: 'portname' },
  { label: '港区', prop: 'portareaname' },
  { label: '长度', prop: 'shorelineleng' },
  { label: '坐标数据', prop: 'coordinates' },
  // { label: '坐标类型', prop: 'type ' },

]

// 水上服务区基本信息
const BaseWaterservice = [
  { label: '唯一识别符', prop: 'objectid' },
  { label: '水上服务区名称', prop: 'watername' },
  // { label: '坐标数据', prop: 'coordinates' },
  // { label: '坐标类型', prop: 'type' },

]
//作业区基本信息
const BaseWorkarea = [
  { label: '唯一识别符', prop: 'objectid' },
  { label: '作业区名称', prop: 'workareaname' },
  { label: '作业区边界', prop: 'workareaperimeter' },
  { label: '作业区范围', prop: 'workareas' },
  { label: '所属港区', prop: 'portareaid' },
  { label: '是否利用', prop: 'isutilize' },
  { label: '长度', prop: 'workarealength' },
  { label: '属性', prop: 'workareaattribute' },
  { label: '岸线起点', prop: 'workareastart' },
  { label: '岸线终点', prop: 'workareaend' },
  { label: '坐标数据', prop: 'coordinates' },
  // { label: '坐标类型', prop: 'type' },

]
//统计查询-港口泊位
const StatisticalBerth = [
  { label: '唯一识别符', prop: 'objectid' },
  { label: '市', prop: 'city' },
  { label: '年', prop: 'year' },
  { label: '泊位年通过能力（万吨）', prop: 'integratedThroughput' },
  { label: '沿江泊位数量', prop: 'berthCountAlongRiver' },
  { label: '沿海泊位数量', prop: 'berthCountCoastal' },
  { label: '内河泊位数量', prop: 'berthCountInlandRiver' },
  { label: '万吨级以上泊位数量', prop: 'aboveTenThousandsTonsBerthCount' },
  { label: '万吨级以上公用泊位数量', prop: 'publicAboveTenThousandTonsBerthCount' },
  { label: '万吨级以上沿海泊位数', prop: 'aboveTenThousandsTonsCoastalBerthCount' },
  { label: '万吨级以上沿江泊位数', prop: 'aboveTenThousandsTonsAlongRiverBerthCount' },
  { label: '万吨级以上内河泊位数', prop: 'aboveTenThousandsTonsInlandRiverBerthCount' },
  { label: '沿海综合通过能力', prop: 'integratedThroughputCoastal' },
  { label: '沿江综合通过能力', prop: 'integratedThroughputAlongRiver' },
  { label: '内河综合通过能力', prop: 'integratedThroughputInlandRiver' },
  { label: '万吨级以上沿海综合通过能力', prop: 'aboveIntegratedThroughputCoastal' },
  { label: '万吨级以上沿江综合通过能力', prop: 'aboveIntegratedThroughputAlongRiver' },
  // { label: '万吨级沿江泊位', prop: 'tonnagealongriver' },
  // { label: '万吨级沿海泊位', prop: 'tonnagecoastal' },
  // { label: '万吨级内河泊位', prop: 'tonnageinlandriver' },
  // { label: '沿江年通过能力', prop: 'alongriveradopt' },
  // { label: '沿海年通过能力', prop: 'coastaladopt' },
  // { label: '内河年通过能力', prop: 'inlandriveradopt' },
  // { label: '万吨级沿江年通过能力', prop: 'tonnagealongriveradopt' },
  // { label: '万吨级沿海年通过能力', prop: 'tonnagecoastaladopt' },


]


// 统计查询-港口吞吐-货类吞吐

const StatisticalCargothroughput = [
  { label: '年份', prop: 'year' },
  { label: '城市', prop: 'city' },
  { label: '煤炭及制品', prop: 'coalProducts' },
  { label: '石油天然气及制品', prop: 'oilGasProducts' },
  { label: '石油天然气及制品-原油', prop: 'crudeOil' },
  { label: '石油天然气及制品-成品油', prop: 'refinedOil' },
  { label: '石油天然气及制品液化气-天然气', prop: 'liquefiedNaturalGas' },
  { label: '金属矿石', prop: 'metallicMineral' },
  { label: '金属矿石-铁矿石', prop: 'ironMineral' },
  { label: '钢铁', prop: 'iron' },
  { label: '矿建材料', prop: 'mineralsMaterials' },
  { label: '水泥', prop: 'cement' },
  { label: '木材', prop: 'wood' },
  { label: '非金属矿石', prop: 'nonmetalMineral' },
  { label: '化肥及农药', prop: 'fertilizerPesticide' },
  { label: '盐', prop: 'salt' },
  { label: '粮食', prop: 'cereals' },
  { label: '粮食-大豆', prop: 'soybean' },
  { label: '机械设备电器', prop: 'mechanicalEquipmentElectric' },
  { label: '化工原料及制品', prop: 'chemicalMaterialsProducts' },
  { label: '有色金属', prop: 'nonFerrousMetals' },
  { label: '轻工、医药产品', prop: 'lightIndustryMedicineProducts' },
  { label: '农、林、牧、渔业产品', prop: 'farmForestHerdFishery' },
  { label: '滚装汽车', prop: 'rollVehicles' },
  { label: '商品汽车', prop: 'goodsVehicles' },
]

//统计查询-内河航道 内河航道船闸基础状况表

const StatisticalChannel = [
  { label: '唯一识别符', prop:'objectid'},
  { label: '年', prop:'year'},
  { label: '城市', prop:'city'},
  { label: '航道名称', prop:'channelname'},
  { label: '起屹点', prop:'startpoint'},
  { label: '里程（公里）', prop:'mileage'},
  { label: '航道规划等级', prop: 'planninglevel' },
  { label: '近期维护等级', prop: 'maintenancelevel' },
  { label: '1级', prop: 'one' },
  { label: '2级', prop: 'two' },
  { label: '3级', prop: 'three' },
  { label: '4级', prop: 'four' },
  { label: '5级', prop: 'five' },
  { label: '6级', prop: 'six' },
  { label: '7级', prop: 'seven' },
  { label: '等外级', prop: 'substandardgrade' },
  { label: '跨河桥梁总计', prop: 'crossingbridge' },
  { label: '碍河桥梁', prop:'riverblockingbridge' },

]

// 统计查询-航道货运-船闸/航道年度货运量与船舶通过量
const tStatisticalChannelFreight = [
  { label:'单位id', prop: 'companyid' },
  { label:'年', prop: 'year' },
  { label:'类型：船闸  航道', prop: 'channeltype' },
  { label:'船闸名称/航道名称', prop: 'shiplockname' },
  { label:'所属通道', prop: 'passageway' },
  { label:'年度货运量（吨）', prop: 'cargovolume' },
  { label:'船舶通过量（艘）', prop: 'shipadopt' },

]

// 统计查询-航道货运-货物结构
const tStatisticalChannelGoodstotal = [
  { label: '  年', prop: 'year' },
  { label: '   货物种类', prop: 'goodstype' },
  { label: '   类型： 船闸  航道', prop: 'channeltype' },
  { label: '   所属通道', prop: 'passageway' },
  { label: '   货物总量', prop: 'goodstotal' },

]

// 统计查询-港口吞吐-年度集装箱吞吐量
const tStatisticalContainer = [
  { label: '年', prop: 'year' },
  { label: '城市', prop: 'city' },
  // { label: '类型：沿江沿海内河', prop: 'category' },
  { label: '箱数合计', prop: 'containerCount' },
  { label: '箱数空箱', prop: 'emptyCount' },
  { label: '箱数重箱', prop: 'heavyCount' },
  { label: '重量合计', prop: 'weightCount' },
  { label: '重量货重', prop: 'weightCargo' },
  { label: '国际航线合计', prop: 'IARCount' },
  { label: '国际航线重箱', prop: 'IARHeavyCount' },
  { label: '国内支线合计', prop: 'inlandBARCount' },
  { label: '国内支线重箱', prop: 'inlandBARHeavyCount' },
  { label: '国内航线合计', prop: 'inlandARCount' },
  { label: '国内航线重箱', prop: 'inlandARHeavyCount' },

]
// 统计查询-港口吞吐
const StatisticalThroughput = [
  { label: ' 唯一识别符', prop: 'objectid' },
  { label: '  年', prop: 'year' },
  { label: '  城市', prop: 'city' },
  { label: '  港口类型', prop: 'porttype' },
  { label: ' 货物总量（万吨）', prop: 'totalcargo' },
  { label: ' 外贸货物（万吨）', prop: 'tradedgoods' },
  { label: '出港货物（万吨）', prop: 'outboundcargo' },
  { label: ' 出港外贸货物（万吨）', prop: 'outboundtradegoods' },
  { label: '集装箱数量（万TEU）', prop: 'container' },
  { label: ' 集装箱重量（万吨）', prop: 'containerweight' },
  { label: ' 集装箱货重（万吨）', prop: 'containercargoweight' },
  { label: ' 滚装汽车数量（万辆）', prop: 'car' },
  { label: ' 滚装汽车重量（万吨）', prop: 'carweight' },
  { label: ' 旅客数量（万人）', prop: 'passenger' },
  { label: ' 出港旅客数量（万人）', prop: 'outboundpassengers' },

]

// 文件管理日志
const emergency = [
  { label: ' 日志id', prop: 'id' },
  { label: '  操作人', prop: 'operator' },
  { label: '  操作时间', prop: 'operationtime' },
  { label: '  描述', prop: 'describe' },
]
// 基础设施
// 港口作业区
const portoperationarea =[
  { label: '唯一标识符', prop: 'objectid' },
  { label: '名称', prop: 'name' },
  { label: '城市', prop: 'city' },
  { label: '港口名称', prop: 'portname' },
  { label: '港区名称', prop: 'portareaname' },
  { label: '面积', prop: 'area' },
  { label: '岸线长度(米)', prop: 'shorelinelength' },
  { label: '陆域纵深(米)', prop: 'landdepth' },
  { label: '建设性质', prop: 'nature' },
  { label: '建设时序', prop: 'sequential' },
  { label: '经纬度', prop: 'coordinates' },
  { label: '类型', prop: 'type' },
]

// 态势检测
// 港口作业区
const detectionwork =[
  { label: '唯一标识符', prop: 'id' },
  { label: '名称', prop: 'name' },
  // { label: '上游船闸（单位代号）', prop: 'upstreamShipLock' },
  // { label: '下游船闸（单位代号）', prop: 'downstreamShipLock' },
  // { label: '其他船闸（单位代号）', prop: 'otherShipLock' },
  { label: '泊位数', prop: 'berthNum' },
  { label: '千吨级以上泊位数', prop: 'thousandTonsLevelBerthNum' },
  { label: '岸线长度（米）', prop: 'waterFront' },
  { label: '综合通过能力（吨）', prop: 'integratedThroughput' },
]
// 态势检测航道
const situationchannel =[
  { label: '唯一标识符', prop: 'objectid' },
  { label: '航道名称', prop: 'channelname' },
  { label: '起讫点', prop: 'origindestination' },
  { label: '航道里程', prop: 'channelmileage' },
  { label: '航道水深', prop: 'channeldepth' },
  { label: '规划等级', prop: 'planninglevel' },
  { label: '现状等级', prop: 'presentlevel' },
  { label: '跨河桥梁（座）', prop: 'crossingbridge' },
  { label: '碍航桥梁（座）', prop: 'obstructingbridge' },
]

// 态势检测船闸
const situationlock =[
  { label: '唯一标识符', prop: 'objectid' },
  { label: '船闸名称', prop: 'shiplockname' },
  { label: '所属航线', prop: 'channelname' },
  // { label: '所属通道', prop: 'channelname' },
  { label: '通航里程(km)', prop: 'navigationmileage' },
  { label: '航道近期维护等级', prop: 'maintenancelevel' },
  { label: '河口宽(M)', prop: 'estuarywidth' },
  { label: '设计最低通航水位(M)', prop: 'navigationwater' },
  { label: '水深', prop: 'waterdepth' },
  { label: '底宽', prop: 'bottomwidth' },
  { label: '航宽', prop: 'navigationwidth' },
  { label: '弯曲半径', prop: 'bendingradius' },
  { label: '底标高', prop: 'bottomelevation' },
  { label: '航道等级', prop: 'channellevel' },
  { label: '所在航道近期维护等级', prop: 'channelmaintenancelevel' },
  { label: '建设地点', prop: 'constructionsite' },
  { label: '建设部门', prop: 'constructiondepart' },
  { label: '建成时间', prop: 'completiontime' },
  { label: '上游最高水位', prop: 'maxupperwater' },
  { label: '上游最低水位', prop: 'minupperwater' },
  { label: '下游最高水位', prop: 'maxdownwater' },
  { label: '下游最低水位', prop: 'mindownwater' },
  { label: '长度LK', prop: 'length' },
  { label: '闸室宽度BK', prop: 'chamberwidth' },
  { label: '门槛水深HK', prop: 'thresholddepth' },
  { label: '闸首口门宽度', prop: 'headwidth' },
  { label: '设计通过能力', prop: 'designcapacity' },
  { label: '现通过量', prop: 'presentcapacity' },
]

// 态势检测锚地
const situationanchorage =[
  { label: '唯一标识符', prop: 'objectid' },
  { label: '锚地名称', prop: 'anchoragename' },
  { label: '锚地位置', prop: 'anchoragelocation' },
  { label: '城市', prop: 'city' },
  { label: '锚地规模', prop: 'anchoragelength' },
  { label: '锚地功能', prop: 'anchorageuse' },
  { label: '锚地类型', prop: 'anchoragetype' },
  { label: '管理单位', prop: 'worktelephone' },

]

// 船舶运行分析轨迹
const analysistrack =[
  { label: '唯一标识符', prop: 'Id' },
  { label: '船舶识别号', prop: '船舶识别号' },

]

// 船舶运行分析热力图
const analysisthermodynamic =[
  { label: '唯一标识符', prop: 'id' },
  { label: '热力图经度', prop: 'longitude' },
  { label: '热力图纬度', prop: 'latitude' },

]
// 船舶运行分析断面流量
const analysistraffic =[
  { label: '唯一标识符', prop: 'sectionId' },
  { label: '断面名称', prop: 'name' },
  { label: '断面流动值', prop: 'flowValue' },

]
// 基础设施桥梁JSON
const infrastructurebridge =[
  { label: '唯一标识符', prop: 'objectid' },
  { label: '桥梁名称', prop: 'bridgename' },
  { label: '桥梁编码', prop: 'bridgcode' },
  { label: '坐标数据', prop: 'coordinates' },
  { label: '桥梁管理单位', prop: 'bridgmanagement' },
  { label: '所在行政区划', prop: 'administrativeregion' },
  { label: '所在行政区划编码', prop: 'administrativeregioncode' },
  { label: '所属航道名称', prop: 'channelname' },
  { label: '所属航道编码', prop: 'channelcode' },
  { label: '航段现状技术等级', prop: 'segmentlevel' },
  { label: '所属航段名称', prop: 'segmentname' },
  { label: '所属航段编码', prop: 'segmentcode' },
  { label: '建成时间', prop: 'completiontime' },
  { label: '是否经航政审批', prop: 'approved' },
  { label: '审批文号', prop: 'approvalnumber' },
  { label: '审批时间', prop: 'approvaltime' },
  { label: '用途分类', prop: 'purpose' },
  { label: '结构型式', prop: 'structure' },
  { label: '是否设有桥涵标', prop: 'isbridgesculverts' },
  { label: '桥涵标名称', prop: 'bridgesculvertsname' },
  { label: '是否发光标', prop: 'isluminescence' },
  { label: '是否设置桥墩防护设施', prop: 'ispier' },
  { label: '桥墩防护设施类别', prop: 'piertype' },
  { label: '是否满足航道规划等级标准', prop: 'isplanningstandards' },
  { label: '是否满足航道现状等级标准', prop: 'iscurrentlevel' },
  { label: '是否水中落墩', prop: 'isdroppier' },
  { label: '是否有主通航孔承台', prop: 'ismainnavigableholecushion' },
  { label: '是否危桥', prop: 'isdanger' },
  { label: '是否碍航', prop: 'isnavigationobstruction' },
  { label: '状态', prop: 'state' },
  { label: '拆除时间', prop: 'dismantletime' },
  { label: '垂直基准面（高程）', prop: 'verticaldatum' },
  { label: '桥梁全长', prop: 'bridgelength' },
  { label: '桥梁全长核实情况', prop: 'actualbridgelength' },
  { label: '水中墩柱承台顶标高', prop: 'watertopelevation' },
  { label: '法线与航道中心线夹角', prop: 'normalchannelcenterangle' },
  { label: '桥宽', prop: 'bridgewidth' },
  { label: '通航孔数', prop: 'navigableholenum' },
  { label: '通航孔跨径', prop: 'span' },
  { label: '通航孔设计净宽', prop: 'wide' },
  { label: '通航孔设计净高', prop: 'heigit' },
  { label: '通航孔设计侧高', prop: 'navigableholeheightside' },
  { label: '通航孔梁底高程', prop: 'navigableholebeanelevation' },
  { label: '距航段起点里程', prop: 'distancestartpoint' },
  { label: '水平精度', prop: 'levelaccuracy' },
  { label: '垂直精度', prop: 'verticalaccuracy' },
  { label: '封闭竖向净空', prop: 'prverticalclearance' },
  { label: '开放竖向净空', prop: 'pubverticalclearance' },
  { label: '雷达可视', prop: 'radarvideo' },
  { label: '视觉可见', prop: 'visionvisual' },
  { label: '建筑结构性质', prop: 'structuralproperties' },
]


// 基础设施桥梁所在行政划分
const administrativeOption=[
  {
    value: '全省',
    label: '全省'
  },
  {
    value: '灌云县',
    label: '灌云县'
  },
  {
    value: '淮安区',
    label: '淮安区'
  },
  {
    value: '金坛区',
    label: '金坛区'
  },

  {
    value: '通州区',
    label: '通州区'
  },
  {
    value: '如东县',
    label: '如东县'
  },
  {
    value: '海安县',
    label: '海安县'
  },
  {
    value: '锡山区',
    label: '锡山区'
  },

  {
    value: '大丰区',
    label: '大丰区'
  },
  {
    value: '洪泽区',
    label: '洪泽区'
  },
  {
    value: '淮阴区',
    label: '淮阴区'
  },

  {
    value: '吴江区',
    label: '吴江区'
  },

  {
    value: '溧水区',
    label: '溧水区'
  },
  {
    value: '邗江区',
    label: '邗江区'
  },
  {
    value: '广陵区',
    label: '广陵区'
  },
  {
    value: '崇川区',
    label: '崇川区'
  },
  {
    value: '姑苏区',
    label: '姑苏区'
  },
  {
    value: '高淳区',
    label: '高淳区'
  },

  {
    value: '武进区',
    label: '武进区'
  },
  {
    value: '沛县',
    label: '沛县'
  },
  {
    value: '吴中区',
    label: '吴中区'
  },

  {
    value: '惠山区',
    label: '惠山区'
  },
  {
    value: '相城区',
    label: '相城区'
  },
  {
    value: '泗阳县',
    label: '泗阳县'
  },
  {
    value: '睢宁县',
    label: '睢宁县'
  },
  {
    value: '丰县',
    label: '丰县'
  },
  {
    value: '射阳县',
    label: '射阳县'
  },
  {
    value: '港闸区',
    label: '港闸区'
  },
  {
    value: '宿豫区',
    label: '宿豫区'
  },
]
// 基础设施桥梁所在航段
const ChannelNameOption=[
  {
    value: '全省',
    label: '全省'
  },
  {
    value: '宜张线',
    label: '宜张线'
  },

  {
    value: '青祝河',
    label: '青祝河'
  },
  {
    value: '连申线苏北段（海安）',
    label: '连申线苏北段（海安）'
  },
  {
    value: '陈塘桥河',
    label: '陈塘桥河'
  },

  {
    value: '通榆运河航道',
    label: '通榆运河航道'
  },
  {
    value: '宜丰线',
    label: '宜丰线'
  },
  {
    value: '通启运河',
    label: '通启运河'
  },
  {
    value: '锡十一圩线支线',
    label: '锡十一圩线支线'
  },

  {
    value: '金宝线',
    label: '金宝线'
  },
  {
    value: '烧香港',
    label: '烧香港'
  },
  {
    value: '通启运河,三余线',
    label: '通启运河,三余线'
  },
  {
    value: '望虞河',
    label: '望虞河'
  },

  {
    value: '长湖申线',
    label: '长湖申线'
  },
  {
    value: '罗村河',
    label: '罗村河'
  },
  {
    value: '张福河',
    label: '张福河'
  },
  {
    value: '海门河',
    label: '海门河'
  },

  {
    value: '锡华西线',
    label: '锡华西线'
  },
  {
    value: '宜张线岔道',
    label: '宜张线岔道'
  },
  {
    value: '通扬线（海安）,连申线苏北段（海安）',
    label: '通扬线（海安）,连申线苏北段（海安）'
  },
  {
    value: '陈市浜',
    label: '陈市浜'
  },
  {
    value: '杨丰线',
    label: '杨丰线'
  },

  {
    value: '苏张线',
    label: '苏张线'
  },
  {
    value: '锡溧漕河航道',
    label: '锡溧漕河航道'
  },
  {
    value: '老申张线（近期保留、远期调整）',
    label: '老申张线（近期保留、远期调整）'
  },
  {
    value: '申张线航道',
    label: '申张线航道'
  },

  {
    value: '青四河',
    label: '青四河'
  },
  {
    value: '三余线',
    label: '三余线'
  },
  {
    value: '苏浏线',
    label: '苏浏线'
  },
  {
    value: '宿连航道（黑龙河口-善南船闸灯塔）',
    label: '宿连航道（黑龙河口-善南船闸灯塔）'
  },

  {
    value: '黄家港线',
    label: '黄家港线'
  },
  {
    value: '杨林塘',
    label: '杨林塘'
  },
  {
    value: '锡溧漕河',
    label: '锡溧漕河'
  },

  {
    value: '浒通河',
    label: '浒通河'
  },
  {
    value: '通扬线',
    label: '通扬线'
  },
  {
    value: '二干河',
    label: '二干河'
  },

  {
    value: '京杭大运河',
    label: '京杭大运河'
  },
  {
    value: '新桥河',
    label: '新桥河'
  },
  {
    value: '冯泾河',
    label: '冯泾河'
  },
  {
    value: '秦淮河溧水支线',
    label: '秦淮河溧水支线'
  },
  {
    value: '秦淮河',
    label: '秦淮河'
  },
  {
    value: '锡澄运河',
    label: '锡澄运河'
  },
  {
    value: '老锡澄运河',
    label: '老锡澄运河'
  },

  {
    value: '通州湾港区疏港航道,通栟线',
    label: '通州湾港区疏港航道,通栟线'
  },
  {
    value: '苏州老运河',
    label: '苏州老运河'
  },
  {
    value: '漆桥河',
    label: '漆桥河'
  },
  {
    value: '丹金溧漕河航道（新潘庄-盖板桥）',
    label: '丹金溧漕河航道（新潘庄-盖板桥）'
  },
  {
    value: '丹金溧漕河航道',
    label: '丹金溧漕河航道'
  },
  {
    value: '七乡河',
    label: '七乡河'
  },
  {
    value: '锡虞线',
    label: '锡虞线'
  },
  {
    value: '泰东线',
    label: '泰东线'
  },
  {
    value: '乍嘉苏线',
    label: '乍嘉苏线'
  },
  {
    value: '苏州环城河',
    label: '苏州环城河'
  },
  {
    value: '淮沭新河航道',
    label: '淮沭新河航道'
  },

  {
    value: '泰东线,泰东线引江河段',
    label: '泰东线,泰东线引江河段'
  },

  {
    value: '北六塘河航道',
    label: '北六塘河航道'
  },
  {
    value: '老锡十一圩线（张家港）',
    label: '老锡十一圩线（张家港）'
  },
  {
    value: '通栟线,通州湾港区疏港航道',
    label: '通栟线,通州湾港区疏港航道'
  },

  {
    value: '界浦江',
    label: '界浦江'
  },
  {
    value: '浒光运河',
    label: '浒光运河'
  },
  {
    value: '福山塘',
    label: '福山塘'
  },
  {
    value: '大新河（南通）',
    label: '大新河（南通）'
  },

  {
    value: '青秋浦',
    label: '青秋浦'
  },
  {
    value: '德胜河',
    label: '德胜河'
  },
  {
    value: '常溧线',
    label: '常溧线'
  },
  {
    value: '通栟线 ,通州湾港区疏港航道',
    label: '通栟线 ,通州湾港区疏港航道'
  },
  {
    value: '中河',
    label: '中河'
  },
  {
    value: '北河',
    label: '北河'
  },

  {
    value: '京杭运河常州段',
    label: '京杭运河常州段'
  },
  {
    value: '新江海河',
    label: '新江海河'
  },
  {
    value: '江海河 ,江海河',
    label: '江海河 ,江海河'
  },
  {
    value: '如泰运河',
    label: '如泰运河'
  },

  {
    value: '徐沛线（大沙河）',
    label: '徐沛线（大沙河）'
  },
  {
    value: '徐沛线（徐沛运河）',
    label: '徐沛线（徐沛运河）'
  },
  {
    value: '汇吕线',
    label: '汇吕线'
  },

  {
    value: '徐丰线（丰沛运河新线）',
    label: '徐丰线（丰沛运河新线）'
  },
  {
    value: '通吕运河',
    label: '通吕运河'
  },
  {
    value: '沿河',
    label: '沿河'
  },

  {
    value: '通扬运河',
    label: '通扬运河'
  },
  {
    value: '徐沛线（杨屯河）（徐沛运河-京杭运河）',
    label: '徐沛线（杨屯河）（徐沛运河-京杭运河）'
  },
  {
    value: '连申线苏南段',
    label: '连申线苏南段'
  },

  {
    value: '大沙河',
    label: '大沙河'
  },
  {
    value: '溧梅线',
    label: '溧梅线'
  },

  {
    value: '杨林塘,申张线',
    label: '杨林塘,申张线'
  },

  {
    value: '大溪河（常州）',
    label: '大溪河（常州）'
  },
  {
    value: '杨屯河（灌婴寺-徐沛运河）',
    label: '杨屯河（灌婴寺-徐沛运河）'
  },

  {
    value: '上兴河',
    label: '上兴河'
  },
  {
    value: '申张线',
    label: '申张线'
  },
  {
    value: '苏浏线,申张线',
    label: '苏浏线,申张线'
  },

  {
    value: '上沛河',
    label: '上沛河'
  },

  {
    value: '车辐山航道',
    label: '车辐山航道'
  },
  {
    value: '徐洪河-金宝航线',
    label: '徐洪河-金宝航线'
  },
  {
    value: '新窑线（新戴运河）',
    label: '新窑线（新戴运河）'
  },
  {
    value: '新窑线（骆北航线新线）',
    label: '新窑线（骆北航线新线）'
  },
  {
    value: '苏申外港线',
    label: '苏申外港线'
  },
  {
    value: '苏申内港线支线（1）',
    label: '苏申内港线支线（1）'
  },

  {
    value: '燕子河',
    label: '燕子河'
  },
  {
    value: '邳城河',
    label: '邳城河'
  },
  {
    value: '中央河',
    label: '中央河'
  },

  {
    value: '通启河',
    label: '通启河'
  },
  {
    value: '荡茜河',
    label: '荡茜河'
  },
  {
    value: '如泰运河,通拼线',
    label: '如泰运河,通拼线'
  },
  {
    value: '通栟线岔道',
    label: '通栟线岔道'
  },

  {
    value: '栟茶运河',
    label: '栟茶运河'
  },

  {
    value: '八义集航道',
    label: '八义集航道'
  },
  {
    value: '吴塘河',
    label: '吴塘河'
  },
  {
    value: '江海河',
    label: '江海河'
  },

  {
    value: '纲河',
    label: '纲河'
  },
  {
    value: '头兴港河',
    label: '头兴港河'
  },
  {
    value: '头兴港河航道',
    label: '头兴港河航道'
  },
  {
    value: '姜十线',
    label: '姜十线'
  },

  {
    value: '通拼线',
    label: '通拼线'
  },
  {
    value: '民便河(徐州邳州）',
    label: '民便河(徐州邳州）'
  },
  {
    value: '徐洪河-金宝航线（房亭河）',
    label: '徐洪河-金宝航线（房亭河）'
  },
  {
    value: '三和港南段',
    label: '三和港南段'
  },

  {
    value: '梁垛河',
    label: '梁垛河'
  },
  {
    value: '徐沙河（郭楼闸-环城东路）',
    label: '徐沙河（郭楼闸-环城东路）'
  },

  {
    value: '徐沙河(环城东路-徐沙河沙集船闸）',
    label: '徐沙河(环城东路-徐沙河沙集船闸）'
  },
  {
    value: '徐沙河（徐洪河-徐沙河沙集船闸）',
    label: '徐沙河（徐洪河-徐沙河沙集船闸）'
  },
  {
    value: '蒿枝港河',
    label: '蒿枝港河'
  },
  {
    value: '何垛河',
    label: '何垛河'
  },
  {
    value: '大营子河',
    label: '大营子河'
  },
  {
    value: '西营子河',
    label: '西营子河'
  },
  {
    value: '义河',
    label: '义河'
  },

  {
    value: '徐丰线（复新河）',
    label: '徐丰线（复新河）'
  },
  {
    value: '南引河',
    label: '南引河'
  },
  {
    value: '西支河',
    label: '西支河'
  },

  {
    value: '射阳港区疏港航道（黄沙港）',
    label: '射阳港区疏港航道（黄沙港）'
  },
  {
    value: '太行堤河',
    label: '太行堤河'
  },
  {
    value: '通扬线,通扬运河',
    label: '通扬线,通扬运河'
  },

  {
    value: '协兴河',
    label: '协兴河'
  },
  {
    value: '通扬线,通吕运河',
    label: '通扬线,通吕运河'
  },
  {
    value: '苏虞线',
    label: '苏虞线'
  },
  {
    value: '京杭大运河大王庙到民便闸',
    label: '京杭大运河大王庙到民便闸'
  },

  {
    value: '新龙河（104国道-凌城闸）',
    label: '新龙河（104国道-凌城闸）'
  },
  {
    value: '民便河西段',
    label: '民便河西段'
  },
  {
    value: '罗河',
    label: '罗河'
  },
  {
    value: '京杭大运河皂河船闸至岔口',
    label: '京杭大运河皂河船闸至岔口'
  },
  {
    value: '通栟线',
    label: '通栟线'
  },
  {
    value: '苏申内港线',
    label: '苏申内港线'
  },
  {
    value: '京杭大运河岔口至宿迁船闸',
    label: '京杭大运河岔口至宿迁船闸'
  },
  {
    value: '京杭大运河宿迁船闸至船行',
    label: '京杭大运河宿迁船闸至船行'
  },
  {
    value: '京杭大运河船行至刘老涧船闸',
    label: '京杭大运河船行至刘老涧船闸'
  },
  {
    value: '不老河',
    label: '不老河'
  },
  {
    value: '汇吕北线',
    label: '汇吕北线'
  },

  {
    value: '西泇河',
    label: '西泇河'
  },
  {
    value: '南澄子河',
    label: '南澄子河'
  },
  {
    value: '临邱线',
    label: '临邱线'
  },
  {
    value: '芒稻河',
    label: '芒稻河'
  },

  {
    value: '盐邵线',
    label: '盐邵线'
  },
  {
    value: '古运河',
    label: '古运河'
  },
  {
    value: '三阳河',
    label: '三阳河'
  },
  {
    value: '仪扬河',
    label: '仪扬河'
  },
  {
    value: '建口线（下官河）',
    label: '建口线（下官河）'
  },
  {
    value: '庄台河',
    label: '庄台河'
  },
  {
    value: '高邮湖航线',
    label: '高邮湖航线'
  },

  {
    value: '扬寿河',
    label: '扬寿河'
  },
  {
    value: '兴姜线',
    label: '兴姜线'
  },
  {
    value: '秦菱河航道',
    label: '秦菱河航道'
  },
  {
    value: '老通扬运河',
    label: '老通扬运河'
  },

  {
    value: '太平河（扬州）',
    label: '太平河（扬州）'
  },
  {
    value: '金湾河',
    label: '金湾河'
  },
  {
    value: '宣堡港',
    label: '宣堡港'
  },
  {
    value: '凤凰河',
    label: '凤凰河'
  },
  {
    value: '高东线',
    label: '高东线'
  },
  {
    value: '横泾河',
    label: '横泾河'
  },

  {
    value: '小夹江',
    label: '小夹江'
  },
  {
    value: '廖家沟',
    label: '廖家沟'
  },{
    value: '东门河',
    label: '东门河'
  },
  {
    value: '澄潼河',
    label: '澄潼河'
  },
  {
    value: '界圩河',
    label: '界圩河'
  },
  {
    value: '车轴河',
    label: '车轴河'
  },
  {
    value: '大新河（连云港）',
    label: '大新河（连云港）'
  },

  {
    value: '牛墩河',
    label: '牛墩河'
  },{
    value: '枯沟河',
    label: '枯沟河'
  },
  {
    value: '太浦河',
    label: '太浦河'
  },
  {
    value: '盐邵河航道',
    label: '盐邵河航道'
  },
  {
    value: '青龙大沟',
    label: '青龙大沟'
  },
  {
    value: '临洪河',
    label: '临洪河'
  },
  {
    value: '妇联河',
    label: '妇联河'
  },{
    value: '夏仕港',
    label: '夏仕港'
  },{
    value: '阜宝线',
    label: '阜宝线'
  },
  {
    value: '洪泽湖北线北段航道',
    label: '洪泽湖北线北段航道'
  },
  {
    value: '盐河',
    label: '盐河'
  },
  {
    value: '玉带河',
    label: '玉带河'
  },
  {
    value: '范河',
    label: '范河'
  },
  {
    value: '烧香支河',
    label: '烧香支河'
  },
  {
    value: '五道纵沟',
    label: '五道纵沟'
  },
  {
    value: '八一河',
    label: '八一河'
  },

  {
    value: '新沭河航道',
    label: '新沭河航道'
  },
  {
    value: '老通扬运河陆家涵-红旗',
    label: '老通扬运河陆家涵-红旗'
  },
  {
    value: '淮沭新河',
    label: '淮沭新河'
  },
  {
    value: '蔷薇河',
    label: '蔷薇河'
  },
  {
    value: '沭北运河',
    label: '沭北运河'
  },

  {
    value: '鲁兰河',
    label: '鲁兰河'
  },
  {
    value: '吕四港区东灶港疏港航道',
    label: '吕四港区东灶港疏港航道'
  },
  {
    value: '盐宝线',
    label: '盐宝线'
  },
  {
    value: '盐宝线航道',
    label: '盐宝线航道'
  },

  {
    value: '欢口引河',
    label: '欢口引河'
  },
  {
    value: '老锡溧漕河',
    label: '老锡溧漕河'
  },
  {
    value: '锡溧漕河支线',
    label: '锡溧漕河支线'
  },
  {
    value: '直湖港',
    label: '直湖港'
  },

  {
    value: '京杭运河刘山至蔺家坝',
    label: '京杭运河刘山至蔺家坝'
  },
  {
    value: '京杭运河二级坝到大王庙',
    label: '京杭运河二级坝到大王庙'
  },
  {
    value: '京杭大运河刘山船闸至大王庙',
    label: '京杭大运河刘山船闸至大王庙'
  },

  {
    value: '高良涧1号闸接线航道',
    label: '高良涧1号闸接线航道'
  },
  {
    value: '建口线,通扬线（建口线）',
    label: '建口线,通扬线（建口线）'
  },

  {
    value: '引江河',
    label: '引江河'
  },
  {
    value: '建口线',
    label: '建口线'
  },

  {
    value: '金宝航道',
    label: '金宝航道'
  },
  {
    value: '金宝航道涂沟南线,金宝航道',
    label: '金宝航道涂沟南线,金宝航道'
  },
  {
    value: '金宝航道涂沟南线',
    label: '金宝航道涂沟南线'
  },
  {
    value: '通扬线（海安）',
    label: '通扬线（海安）'
  },
  {
    value: '1号闸接线',
    label: '1号闸接线'
  },
  {
    value: '湖西航道',
    label: '湖西航道'
  },
  {
    value: '顺堤河',
    label: '顺堤河'
  },
  {
    value: '郑集河',
    label: '郑集河'
  },
  {
    value: '申张线,杨林塘',
    label: '申张线,杨林塘'
  },
  {
    value: '利国河',
    label: '利国河'
  },
  {
    value: '驷马山干渠',
    label: '驷马山干渠'
  },
  {
    value: '水阳江',
    label: '水阳江'
  },
  {
    value: '丹金溧漕河（金塔大桥-新潘庄）',
    label: '丹金溧漕河（金塔大桥-新潘庄）'
  },
  {
    value: '城南河',
    label: '城南河'
  },
  {
    value: '滁河',
    label: '滁河'
  },
  {
    value: '向阳河（南京）',
    label: '向阳河（南京）'
  },
  {
    value: '八百河',
    label: '八百河'
  },
  {
    value: '划子河',
    label: '划子河'
  },
  {
    value: '句容河',
    label: '句容河'
  },
  {
    value: '马汊河',
    label: '马汊河'
  },
  {
    value: '徐圩港区疏港航道善后河',
    label: '徐圩港区疏港航道善后河'
  },

]
export {
  ChannelNameOption,
  administrativeOption,
  detectionwork,
  infrastructurebridge,
  analysistraffic,
  analysisthermodynamic,
  analysistrack,
  situationanchorage,
  situationlock,
  situationchannel,
  portoperationarea,
  city,
  epsg,
  field,
  examineMonField,
  role,
  gender,
  mononerType,
  userField,
  userInfoOrder,
  mononerTypeOrder,
  fileTypeOrder,
  examineProInfoOrder,
  examineMonInfoOrder,
  examineDownloadOrder,
  BaseAnchorage,
  BaseBerth,
  BaseBridge,
  BaseCabinwashing,
  BaseChannel,
  BasePortplanning,
  BaseShiplock,
  tBaseShoreline,
  BaseWaterservice,
  BaseWorkarea,
  StatisticalBerth,
  StatisticalCargothroughput,
  StatisticalChannel,
  tStatisticalChannelFreight,
  tStatisticalChannelGoodstotal,
  tStatisticalContainer,
  StatisticalThroughput,
  emergency,
  infrastructure,
  statisticalQuery,
  situationMonitoring
}
