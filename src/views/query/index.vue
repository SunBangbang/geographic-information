<template>
  <div class="box">
    <div class="information-retrieval">
      <div class="information-box">
        <div
          v-for="(item, index) in menuData"
          :key="item.name"
          @click="addClass(index)"
          :class="{ active: index == current }"
        >
          <img :src="item.img" alt="" srcset="" />
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div class="view">
      <div class="left" v-if="odFlag">
        <div class="search-box">
          <div class="date-block">
            <div>
              <el-date-picker
                v-model="starttime"
                type="year"
                placeholder="选择年"
                clear-icon=""
                value-format="yyyy"
                :picker-options="pickerOptionsStart"
                @change="startTimeChange"
              >
              </el-date-picker>
            </div>
            <span>-</span>
            <div>
              <el-date-picker
                v-model="endtime"
                type="year"
                placeholder="选择年"
                clear-icon=""
                value-format="yyyy"
                :picker-options="pickerOptionsEnd"
                @change="endTimeChange"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="select-box" v-if="current != 3">
            <div
              class="select-block"
              v-if="current === 0 || current === 2"
              :class="{ 'select-block-width': current === 2 }"
            >
              <el-select
                v-model="selectTypeValue"
                placeholder=""
                @change="typeChange"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="select-block" v-if="current === 0">
              <el-select
                v-model="selectDwValue"
                placeholder=""
                @change="dwChange"
              >
                <el-option
                  v-for="item in dwOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            
            <div
              class="select-block"
              v-if="current === 1"
              :class="{ 'select-block-width': current === 1 }"
            >
              <el-select
                v-model="selectGradeValue"
                placeholder=""
                @change="gradeChange"
              >
                <el-option
                  v-for="item in gradeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="select-box" v-else>
            <div class="select-block">
              <el-select
                v-model="selectRoadValue"
                placeholder=""
                @change="roadChange"
              >
                <el-option
                  v-for="item in selectRoadOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="select-block">
              <el-select
                v-model="selectGoodsValue"
                placeholder=""
                @change="goodsChange"
              >
                <el-option
                  v-for="item in selectGoodsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class = 'select-box1' v-if="current === 0">
            <div class="select-block" v-if="current === 0">
              <el-select
                v-model="selectPublic"
                placeholder=""
                @change="PublicChange"
              >
                <el-option
                  v-for="item in PublicOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="select-block" v-if="current === 0">
              <el-select
                v-model="selectCargo"
                placeholder=""
                @change="CargoChange"
              >
                <el-option
                  v-for="item in CargoOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="echarts-box">
          <div class="bar-box">
            <div class="select-bar">
              <el-date-picker
                v-model="selectBarYear"
                type="year"
                placeholder="选择年"
                clear-icon=""
                :picker-options="pickerOptionsBar"
                @change="selectBarChange"
              >
              </el-date-picker>
            </div>
            <div id="berth-one"></div>
          </div>
          <div class="port-box">
            <div id="berth-two"></div>
            <div id="berth-three"></div>
            <div class="threeselect" v-if="current === 2">
              <div>
                <el-select
                  v-model="inAndOutValue"
                  placeholder="请选择"
                  @change="getHuffAndPuffPort"
                >
                  <el-option
                    v-for="item in inAndOutOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div>
                <el-select
                  v-model="domesticAndForeignValue"
                  placeholder="请选择"
                  @change="getHuffAndPuffPort"
                >
                  <el-option
                    v-for="item in domesticAndForeignOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!-- <div v-show="current === 4" class="goosroad">
            <div id="goods-echarts"></div>
          </div> -->
        </div>
      </div>
      <div class="middle" :class="{ 'od-width': !odFlag }">
        <div class="gis-container" :style="{ height: gisHight }">
          <div id="container" v-show="current !== 4"></div>
          <div id="echartsMap" v-show="current === 4"></div>
          <div class="berthlegend" v-if="berthlegendshow">
            <div class="berthlegenddiv">
              <div class="leftberthlegend">
                <div>{{ maxnumber }}</div>
                <div>{{ minnumber }}</div>
              </div>
              <div class="rightberthlegend">
                <div>
                  <img src="../../assets/img/querytx1.png" alt="" srcset="" />
                </div>
              </div>
            </div>
          </div>
          <div id="popup" class="ol-popup" v-show="false">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content">
              <div class="popup-content-box">
                <div class="title">{{ popTitle }}</div>
                <div class="content"></div>
              </div>
            </div>
          </div>
          <div class="gis-top" v-if="current === 3">
            <el-select
              v-model="gisTopValue"
              placeholder="请选择"
              @change="SelectGisTop"
            >
              <el-option
                v-for="item in gisTopOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>

          <div class="gis-bottom" v-if="current === 4">
            <p
              :class="{ active: index + 1 === echartcurrent }"
              v-for="(item, index) in echartsArr"
              :key="index"
              @click="dialogEchart(item.id)"
            >
              {{ item.name }}
            </p>
          </div>
        </div>
        <div class="middle-bottom" v-show="odFlag">
          <div class="middle-search">
            <div>
              <el-date-picker
                v-model="middleYear"
                type="year"
                placeholder="选择年"
                :clearable="false"
                :picker-options="pickerOptionsMiddle"
                @change="middleYearChange"
              >
              </el-date-picker>
            </div>
            <div v-if="current === 3">
              <el-popover placement="top" max-width="301" trigger="click">
                <div class="checkboxoverflow">
                  <el-checkbox-group v-model="checkedCities" :min="1" :max="10">
                    <div v-for="city in cities" :key="city">
                      <el-checkbox :label="city">{{ city }}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                </div>

                <!-- <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="(item,index) in cities" :label="item" :key="index"></el-checkbox>
                  </el-checkbox-group> -->
                <div class="popoverbtn">
                  <el-button @click="checkedCitiesChanged">确定</el-button>
                </div>
                <el-button slot="reference">筛选</el-button>
              </el-popover>
            </div>
            <div v-if="current === 2" class="selectgoodstype">
              <el-select
                v-model="goodsTypeValue"
                placeholder="请选择"
                @change="getHuffAndPuffPortCity"
              >
                <el-option
                  v-for="item in goodsTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div id="many-graph"></div>
        </div>
      </div>
      <div class="right" v-if="odFlag">
        <div id="berth-right-one"></div>
        <div id="berth-right-two"></div>
      </div>
      <div class="right-od" v-else>
        <div class="od-serch">
          <div class="od-date">
            <span>选择日期</span>
            <el-date-picker
              v-model="odVlaues"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM"
              format="yyyy-MM"
            >
            </el-date-picker>
          </div>
          <div class="od-local">
            <div>
              <span>出发地</span>
              <el-select
                v-model="placeOfOriginVlaue"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in placeOfOriginOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div>
              <span>到达地</span>
              <el-select
                v-model="destinationVlaue"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in destinationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div>
              <span>货运种类</span>
              <el-select v-model="goodsOdTypeValue" placeholder="请选择">
                <el-option
                  v-for="item in goodsOdTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="getOdTable"
            ></el-button>
          </div>
          <div class="od-table">
            <template>
              <el-table
                :data="odtableData"
                size="min"
                style="width: 100%"
                height="155"
                :row-style="tableRowStyle"
                :cell-style="{ padding: '5px' }"
                :header-cell-style="tableHeaderStyle"
                border
                v-loading="loading"
              >
                <el-table-column prop="departure" label="出发地">
                </el-table-column>
                <el-table-column prop="destination" label="到达地">
                </el-table-column>
                <el-table-column prop="totalCount" label="货运量(吨)">
                </el-table-column>
                <el-table-column prop="startTime" label="统计时段" width="180">
                </el-table-column>
              </el-table>
            </template>
          </div>
          <div class="pagination-container">
            <el-pagination
              :pager-count="5"
              layout="prev, pager, next"
              :current-page.sync="pageno"
              :page-size="pagesize"
              :total="total"
              small
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </div>
        <div id="od-echarts"></div>
      </div>
    </div>
    <show-echarts-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :title.sync="dialogTitle"
      :type.sync="echartcurrent"
      :echartsData="odEchartsData"
      @mulberryCitySelected="mulberryCitySelected"
    />
  </div>
</template>
<script>
import moment from 'moment'
import 'ol/ol.css'
import Map from 'ol/Map'
import GeoJSON from 'ol/format/GeoJSON'
import Overlay from 'ol/Overlay'
import WMTS from 'ol/source/WMTS'
import TileWMS from 'ol/source/TileWMS'
// import { get as getProjection } from 'ol/proj'
import TileImage from 'ol/source/TileImage'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import View from 'ol/View'
import { getWidth, getTopLeft } from 'ol/extent'
import { get as getProjection, Projection } from 'ol/proj'
// import { register } from 'ol/proj/proj4'
import { Style, Fill, Icon, Stroke, Text, Circle } from 'ol/style'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import Polygon from 'ol/geom/Polygon'
import * as echarts from 'echarts'
import { common, query } from '@/api/index'
import ShowEchartsDialog from './components/ShowEcharts.vue'
import echartsMapInit from './odMap/echartsMap'
import AdministrativeBoundaries from '@/assets/json/AdministrativeBoundaries.json' //江苏省边界(港口泊位)JSON文件
import AdministrativeBoundaries1 from '@/assets/json/AdministrativeBoundaries1.json' //江苏省边界(港口吞吐)JSON文件
import AdministrativeBoundaries2 from '@/assets/json/AdministrativeBoundaries2.json' //江苏省边界(内河航道)JSON文件
import channel from '@/assets/json/channel.json' //航道JSON文件
import shiplock from '@/assets/json/shiplock.json' //船闸JSON文件

let map = null
let view = null
let vectorSource = null
let vectorLayer = null
let highVectorSource = null
let highVectorLayer = null
let JiangSuAB = null //江苏省(港口泊位)边界
let JiangSuAB1 = null //江苏省(港口吞吐)边界
let JiangSuAB2 = null //江苏省(内河航道)边界
let polygonchannel = null //航道图层
let pointshiplock = null //船闸图层
export default {
  name: 'query',
  data() {
    return {
      pointshiplock: null, //船闸图层
      polygonchannel: null, //航道图层
      JiangSuAB: null, //江苏省(港口泊位)边界
      JiangSuAB1: null, //江苏省(港口吞吐)边界
      JiangSuAB2: null, //江苏省(内河航道)边界
      total: 0, //分页
      pagesize: 18, //分页
      pageno: 1, //分页
      middleCharts: null,
      berthOne: null,
      berthTwo: null,
      berthThree: null,
      berthRightOne: null,
      berthRightTwo: null,
      odEcharts: null,
      odEchartMap: null,
      current: 0,
      mapclick: '南京市', //点击地图市
      starttime: new Date((new Date().getFullYear() - 5).toString()),
      endtime: new Date((new Date().getFullYear() - 1).toString()),
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.endtime != '') {
            return (
              time.getTime() > this.endtime ||
              time.getTime() >
                new Date((new Date().getFullYear() - 1).toString())
            )
          } else {
            return (
              time.getTime() >
              new Date((new Date().getFullYear() - 1).toString())
            )
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          return (
            time.getTime() < this.starttime ||
            time.getTime() > new Date((new Date().getFullYear() - 1).toString())
          )
        }
      },

      //中间选取年份
      selectBarYear: new Date((new Date().getFullYear() - 1).toString()),
      pickerOptionsBar: {
        disabledDate: (time) => {
          return (
            time.getTime() < this.starttime || time.getTime() > this.endtime
          )
        }
      },
      //中间选取年份
      middleYear: new Date((new Date().getFullYear() - 1).toString()),
      pickerOptionsMiddle: {
        disabledDate: (time) => {
          return (
            time.getTime() < this.starttime || time.getTime() > this.endtime
          )
        }
      },

      menuData: [
        {
          name: '港口泊位',
          img: require('../../assets/img/querys/berth.png')
        },
        {
          name: '内河航道',
          img: require('../../assets/img/framework/wharf.png')
        },
        {
          name: '港口吞吐',
          img: require('../../assets/img/querys/huffpuff.png')
        },
        {
          name: '航道货运',
          img: require('../../assets/img/querys/freight.png')
        },
        {
          name: '货运OD',
          img: require('../../assets/img/querys/OD.png')
        }
      ],
      typeOptions: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '沿海',
          label: '沿海'
        },
        {
          value: '沿江',
          label: '沿江'
        },
        {
          value: '内河',
          label: '内河'
        }
      ],
      dwOptions: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '万吨以上',
          label: '万吨以上'
        },
        {
          value: '万吨以下',
          label: '万吨以下'
        }
      ],
      // 公用
      PublicOptions: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '公用',
          label: '公用'
        },
        {
          value: '非公用',
          label: '非公用'
        }
      ],
      // 货物类型
      CargoOptions: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '散杂货',
          label: '散杂货'
        },
        {
          value: '集装箱',
          label: '集装箱'
        },
        {
          value: '滚装汽车',
          label: '滚装汽车'
        }
      ],
      cascaderValue: '全部',
      cascaderOption: [
        //航道跟船闸总数据
        {
          value: '全部',
          label: '全部'
        },
        {
          value: 'zhinan',
          label: '指南'
        },
        {
          value: 'daohang',
          label: '导航'
        }
      ],
      selectGradeValue: '全部',
      gradeOptions: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '一级',
          label: '一级'
        },
        {
          value: '二级',
          label: '二级'
        },
        {
          value: '三级',
          label: '三级'
        },
        {
          value: '四级',
          label: '四级'
        },
        {
          value: '五级',
          label: '五级'
        },
        {
          value: '六级',
          label: '六级'
        },
        {
          value: '七级',
          label: '七级'
        },
        {
          value: '等外级',
          label: '等外级'
        }
      ],
      selectTypeValue: '全部',
      selectDwValue: '全部',
      selectPublic:'全部',
      selectCargo:"全部",
      popTitle: '单体基本信息', // 弹框名称

      checkedCities: [],
      cities: [],
      lockfreight: '江苏省刘集船闸', //船闸货运量默认值
      // channelfreight:'连申线焦港河段',//航道货运量默认值
      selectGoodsValue: '全部', //货物类型选中的值
      selectGoodsOptions: [], //货物类型下拉框
      selectRoadValue: '全部', //航道选中的值
      selectRoadOptions: [], //航道下拉框
      inAndOutValue: '全部', //进出港选中的值
      inAndOutOptions: [
        //进出港下拉框
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '出港',
          label: '出港'
        },
        {
          value: '入港',
          label: '入港'
        }
      ],
      domesticAndForeignValue: '全部', //内外贸选中的值
      domesticAndForeignOptions: [
        //内外贸下拉框
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '内贸',
          label: '内贸'
        },
        {
          value: '外贸',
          label: '外贸'
        }
      ],
      goodsTypeValue: '全部', //货种选中的值
      goodsTypeOptions: [
        //货种下拉框
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '石油天然气及制品',
          label: '石油天然气及制品'
        },
        {
          value: '石油天然气及制品-原油',
          label: '石油天然气及制品-原油'
        },
        {
          value: '石油天然气及制品-成品油',
          label: '石油天然气及制品-成品油'
        },
        {
          value: '石油天然气及制品液化气-天然气',
          label: '石油天然气及制品液化气-天然气'
        },
        {
          value: '金属矿石-铁矿石',
          label: '金属矿石-铁矿石'
        },
        {
          value: '矿建材料',
          label: '矿建材料'
        },
        {
          value: '水泥',
          label: '水泥'
        },
        {
          value: '木材',
          label: '木材'
        },
        {
          value: '非金属矿石',
          label: '非金属矿石'
        },
        {
          value: '化肥及农药',
          label: '化肥及农药'
        },
        {
          value: '粮食',
          label: '粮食'
        },
        {
          value: '粮食-大豆',
          label: '粮食-大豆'
        },
        {
          value: '机械设备电器',
          label: '机械设备电器'
        },
        {
          value: '化工原料及制品',
          label: '化工原料及制品'
        },
        {
          value: '滚装汽车',
          label: '滚装汽车'
        }
      ],

      gisTopValue: '船闸货运量',
      gisTopOptions: [
        {
          label: '船闸货运量',
          value: '船闸货运量'
        },
        {
          label: '航道货运量',
          value: '航道货运量'
        }
      ],
      odFlag: true,
      gisHight: '65%',
      // odVlaue:[new Date((new Date().getFullYear() - 2).toString(),(new Date().getMonth()).toString(),(new Date().getDate()).toString()), new Date((new Date().getFullYear() - 1).toString(),(new Date().getMonth()).toString(),(new Date().getDate()).toString())],
      odVlaue: [
        (new Date().getFullYear() - 1).toString() +
          '-' +
          (new Date().getMonth() + 1).toString() +
          '-' +
          new Date().getDate().toString(),
        (new Date().getFullYear() - 1).toString() +
          '-' +
          (new Date().getMonth() + 1).toString() +
          '-' +
          new Date().getDate().toString()
      ],
      odVlaues: [
        (new Date().getFullYear() - 1).toString() +
          '-' +
          (new Date().getMonth() + 1).toString(),
        (new Date().getFullYear() - 1).toString() +
          '-' +
          (new Date().getMonth() + 1).toString()
      ],
      placeOfOriginVlaue: '',
      placeOfOriginOptions: [],
      destinationVlaue: '',
      destinationOptions: [],
      goodsOdTypeValue: '',
      goodsOdTypeOption: [],
      odtableData: [],
      loading: true,
      echartsArr: [
        { id: 1, name: '货物雷达图' },
        { id: 2, name: '货物流转桑基图' }
      ],
      echartcurrent: 0,
      dialogVisible: false,
      dialogTitle: '',
      odEchartsData: null,
      // startyearAndEndYear:[],
      tableDataAll: [],
      JSBoundaries: [],
      JSBoundaries1: [],
      JSBoundaries2: [],
      JSratio: [],
      JSratio1: [],
      JSratio2: [],
      isratiotable: true, //是利用率还是表格
      berthlegendshow: true,
      maxnumber: '2000',
      minnumber: '0',
      gktableData:[],//港口吞吐中下数据
      boweitable:[],//港口泊位中下数据
    }
  },

  watch: {
    current(val) {
      setTimeout(() => {
        // this.echartsResize()
        if (map) map.updateSize()
      }, 400)
    }
  },

  components: { ShowEchartsDialog },
  mounted() {
    // this.initMap()
    this.workJSON()
    // setTimeout(()=>{
    //   this.workJSON()
    // },5000)
    this.echartsInit()
    this.windowResize()
    // this.getCargoProportion()
    // this.getCargoStructure()
    this.getBerthTypeCount()
    this.getWaterBerthCount()
    this.getAdoptAbility()
    this.getCityAreaPort()
    this.getYearBerthCount()
    this.getBerthCountTrend()
  },
  methods: {
    // echarts字体自适应
    fontSize(res) {
      let clientWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      if (!clientWidth) return
      let fontSize = 100 * (clientWidth / 1920)
      return res * fontSize
    },
    // 根据返回数字长度转化单位
    formatByte(arg) {
      if (arg.toString().length >= 13) {
        // return arg/1000000000000+"万亿"
        var moneys = arg / 1000000000000
        var realVal = parseFloat(moneys).toFixed(0)
        return realVal + '万亿'
      } else if (arg.toString().length >= 9) {
        var moneys = arg / 100000000
        var realVal = parseFloat(moneys).toFixed(0)
        return realVal + '亿'
      } else if (arg.toString().length >= 4) {
        var moneys = arg / 10000
        var realVal = parseFloat(moneys).toFixed(2)
        return realVal + '万'
      } else {
        var realVal = parseFloat(arg)
        return realVal
      }
    },
    // JSON文件加color属性
    async workJSON() {
      if (this.isratiotable) {
        await this.getCityAreaPort()
        await this.getHuffAndPuffPortCity()
        await this.getChannelCityMileage()
        for (var i = 0; i < AdministrativeBoundaries.features.length; i++) {
          var test = AdministrativeBoundaries.features[i].properties
          var tableDataAll = Object.values(this.boweitable)
          tableDataAll.forEach((r) => {
            var a = Object.values(r)
            if (a[0].city == test.Name) {
              test.color = this.zyqFunctions(a[0].berths_count)
              AdministrativeBoundaries.features[i].properties = test
            }
          })
        }
        this.JSBoundaries = AdministrativeBoundaries

        for (var i = 0; i < AdministrativeBoundaries1.features.length; i++) {
          var test = AdministrativeBoundaries1.features[i].properties
          var tableDataAll = Object.values(this.gktableData)
          tableDataAll.forEach((r) => {
            var aa = Object.keys(r)
            var bb = Object.values(r)
            if (aa[0] == test.Name) {
              test.color = this.zyqFunctions1(bb[0])
              AdministrativeBoundaries1.features[i].properties = test
            }
          })
        }
        this.JSBoundaries1 = AdministrativeBoundaries1;
        for (
            var i = 0;
            i < AdministrativeBoundaries2.features.length;
            i++
          ) {
            var test = AdministrativeBoundaries2.features[i].properties
            this.tableDataAll.forEach((r) => {
              if (r.city == test.Name) {
                test.color = this.zyqFunctions2(r.mileage)
                AdministrativeBoundaries2.features[i].properties = test
              }
            })
          }
          this.JSBoundaries2 = AdministrativeBoundaries2
          this.initMap()
      } else {
        if (this.current == 0) {
          map.removeLayer(this.JSratio)
          map.removeLayer(JiangSuAB)
          this.getCityAreaPort().then(() => {
            // map.removeLayer(JiangSuAB)
            for (var i = 0; i < AdministrativeBoundaries.features.length; i++) {
              var test = AdministrativeBoundaries.features[i].properties
              var tableDataAll = Object.values(this.tableDataAll)
              if (tableDataAll.length == 0) {
                test.color = this.zyqFunctions(0)
                AdministrativeBoundaries.features[i].properties = test
              } else {
                tableDataAll.forEach((r) => {
                  var a = Object.values(r)
                  if (a[0].city == test.Name) {
                    test.color = this.zyqFunctions(a[0].berths_count)
                    AdministrativeBoundaries.features[i].properties = test
                  }
                })
              }
            }
            this.JSBoundaries = AdministrativeBoundaries
            let ZYQFunction = function (feature) {
              let dn = feature.get('color')
              return new Style({
                fill: new Fill({
                  color: dn
                }),
                stroke: new Stroke({
                  color: 'rgba(49,150,255,0.5)',
                  width: 1
                })
              })
            }
            this.JSratio = new VectorLayer({
              source: new VectorSource({
                features: new GeoJSON().readFeatures(this.JSBoundaries)
              }),
              style: ZYQFunction,
              visible: true
            })
            map.addLayer(this.JSratio)
          })
        } else if (this.current == 2) {
          map.removeLayer(this.JSratio1)
          map.removeLayer(JiangSuAB1)
          this.getHuffAndPuffPortCity().then(() => {
            for (
              var i = 0;
              i < AdministrativeBoundaries1.features.length;
              i++
            ) {
              var test = AdministrativeBoundaries1.features[i].properties
              var tableDataAll = Object.values(this.tableDataAll)
              tableDataAll.forEach((r) => {
                var aa = Object.keys(r)
                var bb = Object.values(r)
                if (aa[0] == test.Name) {
                  test.color = this.zyqFunctions1(bb[0])
                  AdministrativeBoundaries1.features[i].properties = test
                }
              })
            }
            this.JSBoundaries1 = AdministrativeBoundaries1
            let ZYQFunction = function (feature) {
              let dn = feature.get('color')
              return new Style({
                fill: new Fill({
                  color: dn
                }),
                stroke: new Stroke({
                  color: 'rgba(49,150,255,0.5)',
                  width: 1
                })
              })
            }
            this.JSratio1 = new VectorLayer({
              source: new VectorSource({
                features: new GeoJSON().readFeatures(this.JSBoundaries1)
              }),
              style: ZYQFunction,
              visible: true
            })
            map.addLayer(this.JSratio1)
          })
        } else if (this.current == 1) {
          map.removeLayer(this.JSratio2)
          map.removeLayer(JiangSuAB2)
          this.getChannelCityMileage().then(() => {
            for (
              var i = 0;
              i < AdministrativeBoundaries2.features.length;
              i++
            ) {
              var test = AdministrativeBoundaries2.features[i].properties
              this.tableDataAll.forEach((r) => {
                if (r.city == test.Name) {
                  test.color = this.zyqFunctions2(r.mileage)
                  AdministrativeBoundaries2.features[i].properties = test
                }
              })
            }
            this.JSBoundaries2 = AdministrativeBoundaries2
            let ZYQFunction = function (feature) {
              let dn = feature.get('color')
              return new Style({
                fill: new Fill({
                  color: dn
                }),
                stroke: new Stroke({
                  color: 'rgba(49,150,255,0.5)',
                  width: 1
                })
              })
            }
            this.JSratio2 = new VectorLayer({
              source: new VectorSource({
                features: new GeoJSON().readFeatures(this.JSBoundaries2)
              }),
              style: ZYQFunction,
              visible: true
            })
            map.addLayer(this.JSratio2)
          })
        }
      }
    },
    // 港口泊位中间折线图根据年份切换中间地图颜色的颜色判断
    zyqFunctions(feature) {
      if (feature >= 0 && feature <= 100) {
        var Color = 'rgba(220,69,52,0.5)'
        return Color
      } else if (feature > 100 && feature <= 200) {
        var Color = 'rgba(233,108,72,0.5)'
        return Color
      } else if (feature > 200 && feature <= 300) {
        var Color = 'rgba(244,177,105,0.5)'
        return Color
      } else if (feature > 300 && feature <= 400) {
        var Color = 'rgba(249,192,137,0.5)'
        return Color
      } else if (feature > 400 && feature <= 500) {
        var Color = 'rgba(253,238,175,0.5)'
        return Color
      } else if (feature > 500 && feature <= 600) {
        var Color = 'rgba(238,242,192,0.5)'
        return Color
      } else if (feature > 600 && feature <= 700) {
        var Color = 'rgba(203,213,192,0.5)'
        return Color
      } else if (feature > 700 && feature <= 800) {
        var Color = 'rgba(170,185,188,0.5)'
        return Color
      } else if (feature > 800 && feature <= 900) {
        var Color = 'rgba(129,154,188,0.5)'
        return Color
      } else if (feature > 900 && feature <= 1000) {
        var Color = 'rgba(80,124,182,0.5)'
        return Color
      }else if (feature > 1000) {
        var Color = 'rgba(69,117,182,0.5)'
        return Color
      }
    },
    // 港口吞吐中间折线图根据年份切换中间地图颜色的颜色判断
    zyqFunctions1(feature) {
      if (feature >= 0 && feature <= 5000) {
        var Color = 'rgba(220,69,52,0.5)'
        return Color
      } else if (feature > 5000 && feature <= 10000) {
        var Color = 'rgba(233,108,72,0.5)'
        return Color
      } else if (feature > 10000 && feature <= 15000) {
        var Color = 'rgba(244,177,105,0.5)'
        return Color
      } else if (feature > 15000 && feature <= 20000) {
        var Color = 'rgba(249,192,137,0.5)'
        return Color
      } else if (feature > 20000 && feature <= 25000) {
        var Color = 'rgba(253,238,175,0.5)'
        return Color
      } else if (feature > 25000 && feature <= 30000) {
        var Color = 'rgba(238,242,192,0.5)'
        return Color
      } else if (feature > 30000 && feature <= 35000) {
        var Color = 'rgba(203,213,192,0.5)'
        return Color
      } else if (feature > 35000 && feature <= 40000) {
        var Color = 'rgba(170,185,188,0.5)'
        return Color
      } else if (feature > 40000 && feature <= 45000) {
        var Color = 'rgba(129,154,188,0.5)'
        return Color
      }
      else if (feature > 45000 && feature <= 50000) {
        var Color = 'rgba(80,124,182,0.5)'
        return Color
      }
      else if (feature > 50000) {
        var Color = 'rgba(69,117,182,0.5)'
        return Color
      }
    },
    zyqFunctions2(feature) {
      if (feature >= 0 && feature <= 500) {
        var Color = 'rgba(220,69,52,0.5)'
        return Color
      } else if (feature > 500 && feature <= 1000) {
        var Color = 'rgba(233,108,72,0.5)'
        return Color
      } else if (feature > 1000 && feature <= 1500) {
        var Color = 'rgba(244,177,105,0.5)'
        return Color
      } else if (feature > 1500 && feature <= 2000) {
        var Color = 'rgba(249,192,137,0.5)'
        return Color
      } else if (feature > 2000 && feature <= 2500) {
        var Color = 'rgba(253,238,175,0.5)'
        return Color
      } else if (feature > 2500 && feature <= 3000) {
        var Color = 'rrgba(238,242,192,0.5)'
        return Color
      } else if (feature > 3000 && feature <= 3500) {
        var Color = 'rgba(203,213,192,0.5)'
        return Color
      } else if (feature > 3500 && feature <= 4000) {
        var Color = 'rgba(170,185,188,0.5)'
        return Color
      } else if (feature > 4000 && feature <= 4500) {
        var Color = 'rgba(129,154,188,0.5)'
        return Color
      }
      else if (feature > 4500 && feature <= 5000) {
        var Color = 'rgba(80,124,182,0.5)'
        return Color
      }
      else if (feature > 5000) {
        var Color = 'rgba(68,150,214,0.5)'
        return Color
      }
    },
    tableRowStyle({ row, rowIndex }) {
      return { 'background-color': '#fff', height: '20px' }
    },
    // 修改table header颜色
    tableHeaderStyle({ row, rowIndex }) {
      return {
        'background-color': '#bfcfdc',
        color: '#333333',
        padding: '10px'
      }
    },

    initMap() {
      let projection = getProjection('EPSG:4326')
      let projectionExtent = projection.getExtent()
      let size = getWidth(projectionExtent) / 256
      let resolutions = new Array(18)
      let matrixIds = new Array(18)
      for (var z = 1; z < 19; ++z) {
        resolutions[z] = size / Math.pow(2, z)
        matrixIds[z] = z
      }
      let accessKey = '237e34c50a090cc10e304c42326b13ca'
      let wmtsUrl_1 = 'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk=' //矢量底图
      // 在线天地图
      const tdLayer = this.loadTdLayer(
        wmtsUrl_1,
        accessKey,
        projection,
        projectionExtent,
        resolutions,
        matrixIds
      )
      // 本地离线地图
      const offineLayer = this.loadOffineLayer(
        '/layers/{z}/{x}/{y}.png',
        projection,
        projectionExtent,
        resolutions,
        matrixIds
      )
      // 市级名称标识
      const identification = this.loadGeoServerLayer('snhd', 's_name', true)
      view = new View({
        projection: projection,
        center: [119.489064142175, 32.9653877905019],
        zoom: 7.5
      })
      map = new Map({
        layers: [tdLayer, identification],
        target: 'container',
        view
      })
      // console.log('init finished')
      // 定义坐标且注册
      // this.proj4Register()
      // 高亮source
      highVectorSource = new VectorSource({})
      // 高亮layer
      highVectorLayer = new VectorLayer({
        title: 'high Layer',
        source: highVectorSource
      })
      map.addLayer(highVectorLayer)

      vectorSource = new VectorSource({})
      vectorLayer = new VectorLayer({
        title: 'vector Layer',
        source: vectorSource,
        style: this.styleFunction
      })
      map.addLayer(vectorLayer)

      const container = document.getElementById('popup')
      const content = document.getElementById('popup-content')
      const closer = document.getElementById('popup-closer')
      const overlay = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      })
      map.addOverlay(overlay)
      // 关闭气泡框
      closer.onclick = function () {
        overlay.setPosition(undefined)
        closer.blur()
        return false
      }
      // 地图点击事件
      let _that = this
      map.on('singleclick', (evt) => {
        const coordinate = evt.coordinate
        var pixel = map.getEventPixel(evt.originalEvent)
        var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
          // console.log(feature);
          return feature
        })
        if (feature) {
          _that.mapclick = feature.values_.Name
          // console.log(_that.mapclick);
          // console.log(_that.current);
          if (_that.current === 0) {
            this.getYearBerthCount()
            this.getBerthCountTrend()
            JiangSuAB.getSource().changed() //刷新图层 (openlayers图层改变样式之后需要刷新图层)
          } else if (_that.current === 1) {
            this.getChannelSingleCityMileage()
            this.getChannelSingleCityGradeChange()
            JiangSuAB2.getSource().changed()
          } else if (_that.current === 2) {
            this.getHuffAndPuffPortSingleCity()
            this.getHuffAndPuffSpecialTrendOfCity()
            JiangSuAB1.getSource().changed()
          } else if (_that.current === 3) {
            _that.lockfreight = feature.values_.name
            if (_that.lockfreight) {
              _that.lockfreight = feature.values_.name
            } else {
              _that.lockfreight = feature.values_.NAME
            }
            this.getCargoVolumeOfChannelLock(_that.lockfreight)
            this.getChannelLockThroughput(_that.lockfreight)
          }
          
        }
      })
      map.on('postcompose', this.animation)
      // 江苏省边界(港口泊位)图层
      let JSFunction = function (feature) {
        let stroke = feature.get('Name')
        let dn = feature.get('color')
          // return new Style({
          //   fill: new Fill({
          //     color: dn
          //   }),
          //   stroke: new Stroke({
          //     color: 'rgba(49,150,255,0.5)',
          //     width: 1
          //   })
          // })
        if(stroke == _that.mapclick){
          return new Style({
            fill: new Fill({
              color: dn
            }),
            stroke: new Stroke({
              color: 'red',
              width: 2
            })
          })
        }else {
          return new Style({
            fill: new Fill({
              color: dn
            }),
            stroke: new Stroke({
              color: 'rgba(49,150,255,0.5)',
              width: 1
            })
          })
        }
      }
      ;(JiangSuAB = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(this.JSBoundaries)
        }),
        style: JSFunction,
        visible: true
      })),
        map.addLayer(JiangSuAB)
      // 江苏省边界(港口吞吐)图层
      let JSFunction1 = function (feature) {
        let stroke = feature.get('Name')
        let dn = feature.get('color')
        if(stroke == _that.mapclick){
          return new Style({
            fill: new Fill({
              color: dn
            }),
            stroke: new Stroke({
              color: 'red',
              width: 2
            })
          })
        }else{
          return new Style({
            fill: new Fill({
              color: dn
            }),
            stroke: new Stroke({
              color: 'rgba(49,150,255,0.5)',
              width: 1
            })
          })
        }
      }
      ;(JiangSuAB1 = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(this.JSBoundaries1)
        }),
        style: JSFunction1,
        visible: false
      })),
        map.addLayer(JiangSuAB1)
      // 江苏省边界(内河航道)图层
      let JSFunction2 = function (feature) {
        let dn = feature.get('color')
        let stroke = feature.get('Name')
        if(stroke == _that.mapclick){
          return new Style({
            fill: new Fill({
              color: dn
            }),
            stroke: new Stroke({
              color: 'red',
              width: 2
            })
          })
        }else{
          return new Style({
            fill: new Fill({
              color: dn
            }),
            stroke: new Stroke({
              color: 'rgba(49,150,255,0.5)',
              width: 1
            })
          })
        }
        
      }
      ;(JiangSuAB2 = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(this.JSBoundaries2)
        }),
        style: JSFunction2,
        visible: false
      })),
        map.addLayer(JiangSuAB2)
      // 航道图层

      let styleFunction = function (feature) {
        let dn = feature.get('现状等')
        // // console.log(dn);
        if (dn == '二级') {
          return new Style({
            fill: new Fill({
              color: 'rgb(2,114,47)'
            }),
            stroke: new Stroke({
              color: 'rgb(2,114,47)',
              width: 5
            })
          })
        } else if (dn == '三级') {
          return new Style({
            fill: new Fill({
              color: 'rgb(254,0,0)'
            }),
            stroke: new Stroke({
              color: 'rgb(254,0,0)',
              width: 5
            })
          })
        } else if (dn == '四级') {
          return new Style({
            fill: new Fill({
              color: 'rgb(255,0,198)'
            }),
            stroke: new Stroke({
              color: 'rgb(255,0,198)',
              width: 3
            })
          })
        } else if (dn == '五级') {
          return new Style({
            fill: new Fill({
              color: 'rgb(0,91,231)'
            }),
            stroke: new Stroke({
              color: 'rgb(0,91,231)',
              width: 3
            })
          })
        } else if (dn == '六级') {
          return new Style({
            fill: new Fill({
              color: 'rgb(56,167,0)'
            }),
            stroke: new Stroke({
              color: 'rgb(56,167,0)',
              width: 1
            })
          })
        } else if (dn == '七级') {
          return new Style({
            fill: new Fill({
              color: 'rgb(255,170,1)'
            }),
            stroke: new Stroke({
              color: 'rgb(255,170,1)',
              width: 1
            })
          })
        }
      }
      ;(polygonchannel = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(channel)
        }),
        style: styleFunction,
        visible: false
      })),
        map.addLayer(polygonchannel)
      // 船闸图层
      ;(pointshiplock = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(shiplock)
        }),
        style: new Style({
          image: new Icon({
            scale: 1,
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxFJREFUeNqUVF1Ik2EUfr7PbZriunCzZv7RSmsLTNML034MioxMIxXMbvsDDerCKIIgIiJv9cbLIIK00tQCocJ+vNFUTOlHhc2/LbZQDP/m3Drn9fvmnEzqwLP37H3Peb5zznveI138chyh0pDVoaOlREEuIYHgIUwQ+ggvCS2Xek94yHadrxRKSAZnaXlE2IXNZYRwk/AieFMTRBRBywNCDf93LNrx0f0GQ7M9cC05hI0x0gSrPhuHDIUwRaXwB58rH79NWFlHqJIt+5bwbLKByNrh8/vWheRYHBN452rGEUMRyhIvQyNpapRjjhayEl0pk3n9XtSN3kWnq3UDWbDw2XtXC9neAfsoWZWKGvr9fr6AUULi0/F6Yfg/UmA8g4qkKlYnCTs5wjImm6Kadbpb4Rz+ja4n/RjusmPhzxImhn7B61kJS9jpbgP7kuwglMtKa+ATXQCn8rXjJ+ZmFmDrm8Knx70Y/myHRhexafrsq0gJE+awxrfJoovWrvaTLK06+Pxw2aaFvjTvwYp3Y20HZ7tVNZtveTtramt45pcDhH4i86340N/+HXpjjCDLrdi/gdCt+JKYZOUFkPjFr6XAjOitUfApkcgRohEw65rDItVUkjamHSFpAzpbC3oDNa2orCUeByszkZxhEmQcoSocYV/bN7jt03D8cAX243TxgVbllAcIafv0OXAujq+mS1Gk56ciNTMBYwNO2Hon19KzzwiI/NKNYt2rz1KPezjCZtby4k5CluR1qUTG6LA7N5nqloEUilgbtfaw1FKwT35cobrdHNLYddTYr8K2CNdw8O0IZSAhLS8FsYYYHDUW4XxStdrYZplHECk3eKcs8Qr2xGaGJYyKjUR2iRUHii2CzEKplideVY+vc2eJuIm0kZZaeuioNt+jh38aEqSwxHxWYCxGlfk+DwfeqiU0hk6bW4QtWjmyqjL5Go7FF+OD+zU1fDf1qFM4xum2iQs4bDjF40v1q1d8ww7Yc7Q8/McBy0RNwZtyqBWlz0PTSrigDFAbYVmBTdnjMyvZNoX6/xVgAM2qJcWwrvYlAAAAAElFTkSuQmCC'
          })
        }),
        visible: false
      })),
        map.addLayer(pointshiplock)
      //   this.loadGeoJson('/geoJson/江苏省边界.json', 4326)
    },
    animation() {
      // 增大半径，最大20
      if (this.radius >= 20) {
        this.radius = 0
      }
      var opacity = (20 - this.radius) * (1 / 10) //不透明度
      if (
        highVectorSource != null &&
        highVectorSource.getFeatures() &&
        highVectorSource.getFeatures().length > 0
      ) {
        let highStyle = (feature, resolution) => {
          let geometryType = feature.getGeometry().getType()
          if (geometryType === 'Point')
            return new Style({
              image: new Circle({
                radius: this.radius, //用这个方法降速更好
                // fill: new Fill({
                //   //不需要填充就注释掉fill
                //   color: 'rgba(255,0,0,0.3)'
                // }),
                stroke: new Stroke({
                  color: 'rgba(57,206,255,' + opacity + ')',
                  width: 4 - this.radius / 10
                })
              })
            })
          if (geometryType === 'LineString') {
            return new Style({
              stroke: new Stroke({
                color: 'rgba(57,206,255,' + opacity + ')',
                width: 8 - this.radius / 10
              })
            })
          }
        }
        highVectorLayer.setStyle(highStyle)
      }
      this.radius = this.radius + 0.3
    },
    // 重置地图
    reset() {
      view.setCenter([119.489064142175, 32.9653877905019])
      view.setZoom(7.5)
    },
    //加载天地图
    loadTdLayer(
      wmtsUrl_1,
      accessKey,
      projection,
      projectionExtent,
      resolutions,
      matrixIds
    ) {
      return new TileLayer({
        opacity: 0.7,
        source: new WMTS({
          url: wmtsUrl_1 + accessKey,
          layer: 'vec',
          matrixSet: 'c',
          format: 'tiles',
          style: 'default',
          projection: projection,
          tileGrid: new WMTSTileGrid({
            origin: getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
          }),
          wrapX: true
        })
      })
    },
    // 加载离线地图
    loadOffineLayer(url, projection, projectionExtent, resolutions, matrixIds) {
      return new TileLayer({
        opacity: 0.7,
        source: new TileImage({
          url: url,
          //   layer: 'vec',
          //   matrixSet: 'c',
          //   format: 'tiles',
          //   style: 'default',
          projection: projection,
          tileGrid: new WMTSTileGrid({
            origin: getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
          }),
          wrapX: true
        })
      })
    },
    // 加载geoserver发布图层
    loadGeoServerLayer(space, name, visible, minResolution, maxResolution) {
      return new TileLayer({
        // 名称：潜水CS（<10）水化学类型 类型：面
        visible: visible != undefined ? visible : true,
        source: new TileWMS({
          ratio: 1,
          url: 'http://101.132.68.240:9091/geoserver/' + space + '/wms',
          params: {
            FORMAT: 'image/png',
            VERSION: '1.1.0',
            STYLES: '',
            LAYERS: space + ':' + name
          }
        }),
        minResolution: minResolution, // 此层可见的最小分辨率（包括）
        maxResolution: maxResolution // 此层可见的最大分辨率（不包括）
      })
    },
    echartsInit() {
      this.middleCharts = echarts.init(document.getElementById('many-graph'))
      let xAxisData = []
      let seriesData = []
      let middleChartsOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            // restore : {show: true},
            saveAsImage: {
              show: true,
              pixelRatio: 10,
              title: '',
              type: 'png',
              lang: ['点击保存']
            }
          }
        },
        title: {
          text: '',
          textStyle: {
            color: '#000',
            fontSize: this.fontSize(0.16)
          },
          top: '3%'
        },
        color: ['#68bdff', '#2f9aee'],
        legend: {
          top: '3%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '25%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            nameTextStyle: {
              color: '#999'
            },

            axisLabel: {
              textStyle: {
                color: '#aaaaaa',
                fontSize: this.fontSize(0.12)
              },
              margin: 12
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#dee2e8'
              }
            },
            axisTick: {
              show: false //不显示刻度
            },
            boundaryGap: true,
            splitLine: {
              show: false,
              width: 0.08,
              lineStyle: {
                type: 'solid',
                color: '#03202E'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            data: [],
            barWidth: 15,
            itemStyle: {
              normal: {
                barBorderRadius: [20, 20, 20, 20]
              }
            }
          },
          {
            type: 'line',
            name: '',
            smooth: true,

            showSymbol: false,
            tooltip: {
              valueFormatter: function (value) {
                return value
              }
            },
            itemStyle: {
              //  width:0.8, //折线宽度
              normal: {
                lineStyle: {
                  color: '#2f9aee',
                  width: 1 //折线宽度
                }
              }
            },
            data: [],
            areaStyle: {
              opacity: 0.2,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(47, 154, 238,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(47, 154, 238,0)'
                }
              ])
            }
          }
        ]
      }
      this.middleCharts.setOption(middleChartsOptions)

      let berthOneOption = {
        title: {
          text: '',
          textStyle: {
            color: '#000',
            fontSize: this.fontSize(0.16)
          },
          top: '3%'
        },

        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            // restore : {show: true},
            saveAsImage: {
              show: true,
              pixelRatio: 10,
              title: '',
              type: 'png',
              lang: ['点击保存']
            }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        grid: {
          left: '2%',

          bottom: '0%',
          width: '78%',
          height: '68%',
          containLabel: true
        },
        // color: ['#479eff', '#ffc770'],
        color: [
          '#2a8fe5',
          '#46c3da',
          '#72d9eb',
          '#35b8d0',
          '#3573d0',
          '#648fce',
          '#72a3eb',
          '#0faee9',
          '#2ea6d3',
          '#57ccf7',
          '#57b1f7',
          '#6fafe1',
          '#4496d6'
        ],
        legend: {
          // show: false
          // type: 'scroll',
          orient: 'vertical',
          icon: 'circle',
          itemWidth: 10, // 设置宽度class
          itemHeight: 10, // 设置高度im
          itemGap: 20, // 设置间距
          top: '30%',
          // left: '55%',
          right: '5%',
          bottom: 135
        },
        series: [
          {
            type: 'pie',
            right: '40%',
            radius: ['50%', '70%'],
            center: ['50%', '55%'],
            avoidLabelOverlap: false,
            itemStyle: {
              // borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
            // labelLine: {
            //   show: false
            // },
            label: {
              show: false,
              position: 'center'
            },
            data: []
          }
        ]
      }

      let berthTwoOption = {
        title: {
          text: '',
          textStyle: {
            color: '#000',
            fontSize: this.fontSize(0.16)
          },
          top: '3%'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            // restore : {show: true},
            saveAsImage: {
              show: true,
              pixelRatio: 10,
              title: '',
              type: 'png',
              lang: ['点击保存']
            }
          }
        },
        dataZoom: [
          {
            id: 'dataZoomX',
            type: 'inside',
            show: false, //是否显示下方滚动条
            start: 0, //显示数据开始位置
            end: 90, //显示数据结束位置
            zoomLock: true
          }
        ],
        tooltip: {
          trigger: 'item'
        },
        grid: {
          left: '2%',
          bottom: '5%',
          width: '85%',
          height: '75%',
          containLabel: true
        },
        color: ['#68bdff'],
        legend: {
          type: 'scroll',
          orient: 'vertical',
          top: '2.5%',
          right: '10%',
          data: []
        },
        xAxis: [
          {
            name: '年份',
            type: 'category',
            data: [2019, 2020, 2021, 2022],
            axisPointer: {
              type: 'shadow'
            },
            nameTextStyle: {
              color: '#999'
            },
            axisTick: {
              show: false //不显示刻度
            },
            axisLabel: {
              textStyle: {
                color: '#aaaaaa',
                fontSize: this.fontSize(0.12)
              },
              margin: 12
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#dee2e8'
              }
            },
            boundaryGap: true,
            splitLine: {
              show: false,
              width: 0.08,
              lineStyle: {
                type: 'solid',
                color: '#03202E'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            // interval: 50,
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#888'
              }
            },
            nameTextStyle: {
              color: '#999'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#dee2e8',
                type: 'solid'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#dee2e8'
              }
            }
          }
        ],
        series: [
          {
            data: [],
            type: 'bar',
            barWidth: 15,
            itemStyle: {
              normal: {
                barBorderRadius: [20, 20, 20, 20]
              }
            }
          }
        ]
      }

      let berthThreeOption = {
        title: {
          text: '',
          textStyle: {
            color: '#000',
            fontSize: this.fontSize(0.16)
          },
          top: '3%'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            // restore : {show: true},
            saveAsImage: {
              show: true,
              pixelRatio: 10,
              title: '',
              type: 'png',
              lang: ['点击保存']
            }
          }
        },
        dataZoom: [
          {
            id: 'dataZoomX',
            type: 'inside',
            show: false, //是否显示下方滚动条
            start: 0, //显示数据开始位置
            end: 90, //显示数据结束位置
            zoomLock: true
            // position:right,
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '2%',
          bottom: '5%',
          width: '85%',
          height: '75%',
          containLabel: true
        },
        color: ['#5782fc', '#2f9aee', '#2bbfe9'],
        legend: {
          top: '2.5%',
          right: '10%',
          data: []
        },
        xAxis: [
          {
            name: '年份',
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            },
            nameTextStyle: {
              color: '#999'
            },
            axisTick: {
              show: false //不显示刻度
            },
            axisLabel: {
              textStyle: {
                color: '#aaaaaa',
                fontSize: this.fontSize(0.12)
              },
              margin: 12
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#dee2e8'
              }
            },
            boundaryGap: true,
            splitLine: {
              show: false,
              width: 0.08,
              lineStyle: {
                type: 'solid',
                color: '#03202E'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            // interval: 50,
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#888'
              }
            },
            nameTextStyle: {
              color: '#999'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#dee2e8',
                type: 'solid'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#dee2e8'
              }
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'line',
            smooth: true,
            showSymbol: false,
            tooltip: {
              valueFormatter: function (value) {
                return value
              }
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#5782fc',
                  width: 1 //折线宽度
                }
              }
            },
            data: [],
            areaStyle: {
              opacity: 0.2,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(87, 130, 252,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(87, 130, 252,0)'
                }
              ])
            }
          },
          {
            name: '',
            type: 'line',
            smooth: true,
            showSymbol: false,
            tooltip: {
              valueFormatter: function (value) {
                return value
              }
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#f29eff',
                  width: 1 //折线宽度
                }
              }
            },
            data: [],
            areaStyle: {
              opacity: 0.2,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(242, 158, 255,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(242, 158, 255,0)'
                }
              ])
            }
          },
          {
            name: '',
            type: 'line',
            smooth: true,
            showSymbol: false,
            tooltip: {
              valueFormatter: function (value) {
                return value
              }
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#48b0ff',
                  width: 1 //折线宽度
                }
              }
            },
            data: [],
            areaStyle: {
              opacity: 0.2,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(72, 176, 255,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(72, 176, 255,0)'
                }
              ])
            }
          }
        ]
      }

      let berthRightOneOption = {
        title: {
          text: '',
          textStyle: {
            color: '#000',
            fontSize: this.fontSize(0.16)
          },
          top: '2%'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            // restore : {show: true},
            saveAsImage: {
              show: true,
              pixelRatio: 10,
              title: '',
              type: 'png',
              lang: ['点击保存']
            }
          }
        },
        dataZoom: [
          {
            id: 'dataZoomY',
            type: 'inside',
            show: false,
            zoomLock: true,
            yAxisIndex: [0],

            start: 100, //数据窗口范围的起始百分比
            end: 0
          }
        ],

        tooltip: {
          trigger: 'item'
        },
        grid: {
          left: '2%',
          bottom: '0%',
          width: '90%',
          height: '85%',
          containLabel: true
        },
        color: ['#5782fc', '#2f9aee', '#2bbfe9'],
        legend: {
          top: '8%',
          textStyle: {
            // color: '#000',
            fontSize: this.fontSize(0.16)
          },
          //   right: 'center',
          data: []
        },
        xAxis: [
          {
            type: 'value',

            axisPointer: {
              type: 'shadow'
            },
            nameTextStyle: {
              color: '#999'
            },
            axisTick: {
              show: false //不显示刻度
            },
            axisLabel: {
              textStyle: {
                color: '#aaaaaa',
                fontSize: this.fontSize(0.12)
              },
              margin: 12
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#dee2e8'
              }
            },
            boundaryGap: [0, 0.01]
          }
        ],
        yAxis: [
          {
            type: 'category',

            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#888'
              }
            },
            splitLine: {
              show: false
            },
            nameTextStyle: {
              color: '#999'
            },

            // position: 'bottom',//X轴位置
            axisTick: {
              //刻度尺
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#dee2e8'
              }
            },
            data: []
          }
        ],
        series: [
          {
            type: 'bar',
            name: '沿海',
            stack: 'total',
            barWidth: 25,
            tooltip: {
              valueFormatter: function (value) {
                return value
              }
            },
            label: {
              show: true
            },
            data: []
          },
          {
            type: 'bar',
            name: '沿河',
            stack: 'total',
            barWidth: 25,
            tooltip: {
              valueFormatter: function (value) {
                return value
              }
            },
            label: {
              show: true
            },
            data: []
          },
          {
            type: 'bar',
            name: '内河',
            barWidth: 25,
            stack: 'total',
            tooltip: {
              valueFormatter: function (value) {
                return value
              }
            },
            label: {
              show: true
            },
            data: []
          }
        ]
      }

      let berthRightTwoOption = {
        title: {
          text: '',
          textStyle: {
            color: '#000',
            fontSize: this.fontSize(0.16)
          },
          top: '2%'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            // restore : {show: true},
            saveAsImage: {
              show: true,
              pixelRatio: 10,
              title: '',
              type: 'png',
              lang: ['点击保存']
            }
          }
        },
        dataZoom: [
          {
            id: 'dataZoomX',
            type: 'inside',
            show: false, //是否显示下方滚动条
            start: 0, //显示数据开始位置
            end: 90, //显示数据结束位置
            zoomLock: true
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '2%',
          bottom: '5%',
          width: '85%',
          height: '70%',
          containLabel: true
        },
        color: ['#5782fc', '#2f9aee', '#2bbfe9', '#4496D6'],
        // color: ['#5782fc', '#2f9aee', '#2bbfe9'],
        legend: {
          top: '12%',
          textStyle: {
            // color: '#000',
            fontSize: this.fontSize(0.16)
          },
          //   right: 'center',
          data: []
        },
        xAxis: [
          {
            type: 'category',

            name: '年份',
            axisPointer: {
              type: 'shadow'
            },
            nameTextStyle: {
              color: '#999'
            },
            axisTick: {
              show: false //不显示刻度
            },
            axisLabel: {
              textStyle: {
                color: '#aaaaaa',
                fontSize: this.fontSize(0.12)
              },
              margin: 12
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#dee2e8'
              }
            },
            // boundaryGap: [0, 0.01],
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#888'
              }
            },
            splitLine: {
              show: true
            },
            nameTextStyle: {
              color: '#999'
            },

            // position: 'bottom',//X轴位置
            axisTick: {
              //刻度尺
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#dee2e8'
              }
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'line',
            smooth: true,
            showSymbol: false,
            tooltip: {
              valueFormatter: function (value) {
                return value
              }
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#5782fc',
                  width: 1 //折线宽度
                }
              }
            },
            data: [],
            areaStyle: {
              opacity: 0.2,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(87, 130, 252,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(87, 130, 252,0)'
                }
              ])
            }
          },
          {
            name: '',
            type: 'line',
            smooth: true,
            showSymbol: false,
            tooltip: {
              valueFormatter: function (value) {
                return value
              }
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#f29eff',
                  width: 1 //折线宽度
                }
              }
            },
            data: [],
            areaStyle: {
              opacity: 0.2,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(242, 158, 255,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(242, 158, 255,0)'
                }
              ])
            }
          },
          {
            name: '',
            type: 'line',
            smooth: true,
            showSymbol: false,
            tooltip: {
              valueFormatter: function (value) {
                return value
              }
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#48b0ff',
                  width: 1 //折线宽度
                }
              }
            },
            data: [],
            areaStyle: {
              opacity: 0.2,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(72, 176, 255,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(72, 176, 255,0)'
                }
              ])
            }
          },
          {
            name: '',
            type: 'line',
            smooth: true,
            showSymbol: false,
            tooltip: {
              valueFormatter: function (value) {
                return value
              }
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#4496D6',
                  width: 1 //折线宽度
                }
              }
            },
            data: [],
            areaStyle: {
              opacity: 0.2,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(68, 150, 214,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(68, 150, 214,0)'
                }
              ])
            }
          }
        ]
      }

      let odEchartsOption = {
        title: {
          text: '货运OD',
          textStyle: {
            color: '#000',
            fontSize: this.fontSize(0.16)
          },
          top: '2%'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            // restore : {show: true},
            saveAsImage: {
              show: true,
              pixelRatio: 10,
              title: '',
              type: 'png',
              lang: ['点击保存']
            }
          }
        },
        dataZoom: [
          {
            id: 'dataZoomY',
            type: 'inside',
            show: false,
            zoomLock: true,
            yAxisIndex: [0],

            start: 0, //数据窗口范围的起始百分比
            end: 60
          }
        ],

        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          left: 'right',
          // right:'8%',
          // bottom:'5%',
          min: 0,
          max: 2000,
          // type: 'piecewise',
          text: ['High', 'Low'],
          dimension: 0,
          // seriesIndex: 0,
          // realtime: false,
          // calculable: true,
          inRange: {
            color: ['#50d1f6', '#23adfb', '#0091ff']
          }
        },
        grid: {
          left: '2%',
          bottom: '0%',
          // right:'200%',
          width: '78%',
          height: '90%',
          containLabel: true
        },
        // color: [],
        legend: {
          top: '8%',
          //   right: 'center',
          data: []
        },
        xAxis: {
          max: 'dataMax',
          axisLabel: {
            formatter: function (n) {
              return Math.round(n) + ''
            }
          }
        },

        yAxis: [
          {
            type: 'category',
            inverse: true,
            // splitNumber : 5,
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#888',
                fontSize: 12
              }
              // rotate: 40,
            },
            splitLine: {
              show: false
            },
            nameTextStyle: {
              color: '#999'
            },

            // position: 'bottom',//X轴位置
            axisTick: {
              //刻度尺
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#dee2e8'
              }
            },

            data: [2012, 2013, 2014, 2015]
          }
        ],
        series: [
          {
            data: [10001, 5000, 2000, 30000],
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: [20, 20, 20, 20]
              }
            },
            emphasis: {
              label: {
                show: true
              }
            }
          }
        ]
      }
      if (this.current != 4) {
        this.berthOne = echarts.init(document.getElementById('berth-one'))
        this.berthOne.setOption(berthOneOption)

        this.berthTwo = echarts.init(document.getElementById('berth-two'))
        this.berthTwo.setOption(berthTwoOption)

        this.berthThree = echarts.init(document.getElementById('berth-three'))
        this.berthThree.setOption(berthThreeOption)

        this.berthRightTwo = echarts.init(
          document.getElementById('berth-right-two')
        )
        this.berthRightTwo.setOption(berthRightTwoOption)

        this.berthRightOne = echarts.init(
          document.getElementById('berth-right-one')
        )
        this.berthRightOne.setOption(berthRightOneOption)
      } else {
        this.odEcharts = echarts.init(document.getElementById('od-echarts'))
        this.odEcharts.setOption(odEchartsOption)
      }

      // if (this.current === 4) {
      // this.berthRightTwo = echarts.init(
      //   document.getElementById('berth-right-two')
      // )
      // this.berthRightTwo.setOption(berthRightTwoOption)
      // this.berthRightOne = echarts.init(
      //   document.getElementById('berth-right-one')
      // )
      // this.berthRightOne.setOption(berthRightOneOption)
      // }
    },
    //点击左侧菜单
    addClass(index) {
      this.current = index
      this.odFlag = true
      this.checkedCities = []
      this.selectGradeValue = '全部'
      this.selectTypeValue = '全部'
      this.selectDwValue = '全部'
      this.selectGoodsValue = '全部'
      this.selectRoadValue = '全部'
      this.mapclick = '南京市'
      this.lockfreight = '江苏省刘集船闸'
      this.updateGisTop()
      this.echartsClear()
      this.reset()
      this.checkAll = true
      this.berthlegendshow = true
      this.isIndeterminate = false
      this.isratiotable = true
      this.maxnumber = 2000
      this.minnumber = 0
      polygonchannel.setVisible(false)
      pointshiplock.setVisible(false)
      // this.workJSON()
      if (index != 4) {
        this.gisHight = '65%'
      }
      this.$nextTick(() => {
        this.echartsInit()
      })
      if (index === 0) {
        ;(this.starttime = new Date((new Date().getFullYear() - 5).toString())),
          (this.berthlegendshow = true)
        this.getBerthTypeCount()
        this.getWaterBerthCount()
        this.getAdoptAbility()
        this.getCityAreaPort()
        this.getYearBerthCount()
        this.getBerthCountTrend()
        // JiangSuAB.setVisible(true)
        map.addLayer(JiangSuAB)
        map.removeLayer(JiangSuAB1)
        map.removeLayer(this.JSratio1)
        map.removeLayer(JiangSuAB2)
        map.removeLayer(this.JSratio2)
        JiangSuAB.setVisible(true)
        // if(this.JSratio1 !== undefined){
        //   this.JSratio1.setVisible(false)
        // }
        this.maxnumber = 2000
        this.minnumber = 0
      } else if (index === 1) {
        ;(this.starttime = new Date((new Date().getFullYear() - 3).toString())),
          this.getChannelStructural()
        this.getChannelMileage()
        this.getChannelGradeChange()
        this.getChannelCityMileage()
        this.getChannelSingleCityMileage()
        this.getChannelSingleCityGradeChange()
        // // console.log(map.addLayer(JiangSuAB));
        // if(map.addLayer(JiangSuAB)==undefined){
        //   map.addLayer(JiangSuAB)
        // }
        this.maxnumber = 5000
        this.minnumber = 0
        JiangSuAB2.setVisible(true)
        map.removeLayer(JiangSuAB)
        map.removeLayer(this.JSratio)
        map.removeLayer(JiangSuAB1)
        map.removeLayer(this.JSratio1)
        map.addLayer(JiangSuAB2)
        map.removeLayer(this.JSratio2)
      } else if (index === 2) {
        ;(this.starttime = new Date((new Date().getFullYear() - 5).toString())),
          this.getHuffAndPuffStructure()
        this.getHuffAndPuffPort()
        this.getHuffAndPuffSpecialTrend()
        this.getHuffAndPuffPortCity()
        this.getHuffAndPuffPortSingleCity()
        this.getHuffAndPuffSpecialTrendOfCity()
        JiangSuAB1.setVisible(true)
        JiangSuAB.setVisible(false)
        JiangSuAB2.setVisible(false)
        map.removeLayer(JiangSuAB)
        map.addLayer(JiangSuAB1)
        map.removeLayer(JiangSuAB2)
        map.removeLayer(this.JSratio2)
        // if(this.JSratio !== undefined){
        //   this.JSratio.setVisible(false)
        // }
        this.maxnumber = 80000
        this.minnumber = 0
      } else if (index === 3) {
        ;(this.starttime = new Date((new Date().getFullYear() - 4).toString())),
          // JiangSuAB.setVisible(false)
          pointshiplock.setVisible(true)
        this.berthlegendshow = false
        this.middleYear = this.endtime
        this.getRoadAll()
        this.getRoadAndGateAll(this.gisTopValue.substring(0, 2))
        this.getGoodsType()
        this.getCargoProportion()
        this.getCargoStructure()
        this.getFreightVolume()
        this.getTransport()
        this.getTransportAll()
        map.removeLayer(JiangSuAB)
        map.removeLayer(this.JSratio)
        map.removeLayer(JiangSuAB1)
        map.removeLayer(this.JSratio1)
        map.removeLayer(JiangSuAB2)
        map.removeLayer(this.JSratio2)
      } else if (index === 4) {
        this.berthlegendshow = false
        this.odFlag = false
        this.gisHight = '100%'
        this.getOdPlaceOfOrigin()
        this.getOdDestination()
        this.getOdgoodsType()
        this.getOdTable()
        this.getOdErchaerts()
      }
      this.windowResize()
    },

    //港口泊位
    //泊位数量
    async getBerthTypeCount() {
      let datas = {
        // startyear: this.starttime.getFullYear(),
        year: this.selectBarYear.getFullYear(),
        geographicType:
          this.selectTypeValue != '全部' ? this.selectTypeValue : '',
        tonsRank: this.selectDwValue != '全部' ? this.selectDwValue : ''
      }
      let { code, data } = await query.getBerthTypeCount(datas)
      if (code === 200) {
        var result = []
        var name = Object.keys(data)
        for (const key in data) {
          result.push({
            name: key,
            value: data[key]
          })
        }
        if (this.berthOne) {
          this.berthOne.setOption({
            title: {
              text: '泊位类型' + '(' + this.selectBarYear.getFullYear() + '年)'
            },

            series: [
              {
                data: result
              }
            ]
          })
        }
      } else {
        if (this.berthOne) {
          this.berthOne.setOption({
            title: {
              text: '泊位类型'
            },
            series: [
              {
                data: []
              }
            ]
          })
        }
      }
    },
    //年度泊位数量
    async getWaterBerthCount() {
      let datas = {
        startYear: this.starttime.getFullYear(),
        endYear: this.endtime.getFullYear(),
        geographicType:
          this.selectTypeValue != '全部' ? this.selectTypeValue : '',
        tonsRank: this.selectDwValue != '全部' ? this.selectDwValue : ''
      }
      let { code, data } = await query.getWaterBerthCount(datas)
      if (code === 200) {
        // console.log(data);
        let xData = Object.keys(data)
        let yDatas = Object.values(data)
        let yData = []
        let that = this
        yDatas.forEach((r) => {
          let aa = Object.values(r)
          yData.push(aa[0])
        })
        this.berthTwo.setOption({
          title: {
            text: '分年度泊位数量(个)'
          },
          xAxis: {
            data: xData
          },
          yAxis: {
            type: 'value'

          },
          series: [
            {
              data: yData
            }
          ]
        })
      } else {
        this.berthTwo.setOption({
          title: {
            text: ''
          },
          legend: {
            data: []
          },
          xAxis: {
            data: []
          },
          series: []
        })
      }
    },
    //通过能力
    async getAdoptAbility() {
      let datas = {
        startYear: this.starttime.getFullYear(),
        endYear: this.endtime.getFullYear(),
        geographicType:
          this.selectTypeValue != '全部' ? this.selectTypeValue : '',
        tonsRank: this.selectDwValue != '全部' ? this.selectDwValue : ''
      }
      let { code, data } = await query.getAdoptAbility(datas)
      if (code === 200) {
        let xData = Object.keys(data)
        let yDatas = Object.values(data)
        let yData = []
        let that = this
        yDatas.forEach((r) => {
          let aa = Object.values(r)
          yData.push(aa[0])
        })
        this.berthThree.setOption({
          title: {
            text: '分年度通过能力(吨)'
          },
          xAxis: {
            data: xData
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (data) {
                if (data.toString().length >= 13) {
                  var moneys = data / 1000000000000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '万亿'
                } else if (data.toString().length >= 9) {
                  var moneys = data / 100000000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '亿'
                } else if (data.toString().length >= 4) {
                  var moneys = data / 10000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '万'
                } else {
                  var realVal = parseFloat(data)
                  return realVal
                }
                // var datas = that.formatByte(data)
                // console.log(datas)
                // return datas
              }
            }
          },
          series: {
            data: yData
          }
        })
      } else {
        this.berthThree.setOption({
          title: {
            text: ''
          },
          legend: {
            data: []
          },
          xAxis: {
            data: []
          },
          series: {
            data: []
          }
        })
      }
    },
    //市域港口
    async getCityAreaPort() {
      let datas = {
        year: this.middleYear.getFullYear(),
        geographicType:
          this.selectTypeValue != '全部' ? this.selectTypeValue : '',
        tonsRank: this.selectDwValue != '全部' ? this.selectDwValue : ''
      }
      let { code, data } = await query.getCityAreaPort(datas)
      if (code === 200) {
        this.tableDataAll = data
        this.boweitable = data
        let datas = data
        let that = this
        let xData = Object.keys(datas)
        let Ydata = Object.values(datas)
        let xDatas = []
        let berths = []
        let integrated = []
        Ydata.forEach((r) => {
          var a = Object.values(r)
          xDatas.push(a[0].city)
          berths.push(a[0].berths_count)
          integrated.push(a[0].integrated_throughput_count)
        })
        let yData = [
          {
            type: 'value',
            name: '泊位数量(个)',
            barWidth: 25, //柱图宽度
            axisLabel: {
              formatter: '{value} '
              // formatter: function (data) {
              //   var datas = that.formatByte(data)
              //   return datas
              // }
            }
          },
          {
            type: 'value',
            name: '通过能力(吨)',
            barWidth: 25, //柱图宽度
            axisLabel: {
              // formatter: '{value}'
              formatter: function (data) {
                if (data.toString().length >= 13) {
                  var moneys = data / 1000000000000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '万亿'
                } else if (data.toString().length >= 9) {
                  var moneys = data / 100000000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '亿'
                } else if (data.toString().length >= 4) {
                  var moneys = data / 10000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '万'
                } else {
                  var realVal = parseFloat(data)
                  return realVal
                }
                // var datas = that.formatByte(data)
                // return datas
              }
            }
          }
        ]
        let legendData = ['泊位数量', '通过能力']
        let result = [
          {
            name: '泊位数量',
            type: 'bar',
            data: berths,
            barWidth: 15
          },
          {
            name: '通过能力',
            type: 'line',
            yAxisIndex: 1,
            data: integrated
          }
        ]
        this.middleCharts.setOption({
          title: {
            text: '分市泊位数量及通过能力'
          },
          legend: {
            data: legendData
          },
          xAxis: {
            data: xDatas,
            axisLabel: {
              rotate: 40
            }
          },

          yAxis: yData,
          series: result
        })
      } else {
        this.middleCharts.setOption({
          title: {
            text: '分市泊位数量'
          },
          legend: {
            data: []
          },
          xAxis: {
            data: []
          },
          yAxis: [],
          series: []
        })
      }
    },
    //年度泊位数量趋势
    async getYearBerthCount() {
      let datas = {
        startYear: this.starttime.getFullYear(),
        endYear: this.endtime.getFullYear(),
        city: this.mapclick,
        trendType: 'berths_count'
      }
      let { code, data } = await query.getYearBerthCount(datas)
      if (code === 200) {
        let xData = Object.keys(data)
        let legendDatavalues = Object.values(data)
        let legendData = Object.keys(legendDatavalues[0])
        let aaa = []
        let bbb = []
        let ccc = []
        let yData = Object.values(legendDatavalues)
        yData.forEach((r) => {
          let Rall = Object.values(r)
          aaa.push({
            value: Rall[0], 
            itemStyle: {
              barBorderRadius: [0, 20, 20, 0],
            }
          })
          bbb.push({
            value: Rall[1], 
            itemStyle: {
              barBorderRadius: [20, 0, 0, 20],
            }
          })
          ccc.push({
            value: Rall[2], 
            itemStyle: {
              barBorderRadius: [0, 0, 0, 0],
            }
          })
        })
        let series = [
          {
            name: '内河',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              formatter:function(params){
                if (params.value <= 0) {
                  return ''
                } 
              }
            },
            emphasis: {
              focus: 'series'
            },
            data: aaa,
            barWidth: 25,
            itemStyle: {
              normal: {
                barBorderRadius: [0, 20, 20, 0]
              }
            }
          },
          {
            name: '沿海',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              formatter:function(params){
                if (params.value <= 0) {
                  return ''
                } 
              }
            },
            emphasis: {
              focus: 'series'
            },
            data: bbb,
            barWidth: 25
          },
          {
            name: '沿江',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              formatter:function(params){
                if (params.value <= 0) {
                  return ''
                } 
              }
            },
            emphasis: {
              focus: 'series'
            },
            data: ccc,
            barWidth: 25,
            itemStyle: {
              normal: {
                barBorderRadius: [20, 0, 0, 20]
              },
            }
          }
        ]
        for (let i in aaa) {
          if((series[1].data[i].value == 0) && (series[2].data[i].value == 0)){
            series[0].data[i]['itemStyle'] = { barBorderRadius: [20, 20, 20, 20] };
          }else if((series[0].data[i].value == 0) && (series[2].data[i].value == 0)){
            series[1].data[i]['itemStyle'] = { barBorderRadius: [20, 0, 0, 20] };
          }else if((series[1].data[i].value == 0) && (series[0].data[i].value == 0)){
            series[2].data[i]['itemStyle'] = { barBorderRadius: [20, 0, 0, 20] };
          }else if(series[1].data[i].value == 0){
            series[2].data[i]['itemStyle'] = { barBorderRadius: [20, 0, 0, 20] };
          }else if(series[2].data[i].value == 0){
            series[1].data[i]['itemStyle'] = { barBorderRadius: [20, 0, 0, 20] };
          }
        }
        this.berthRightOne.setOption({
          title: {
            text: '分年度泊位数量(个)' + '（' + this.mapclick + '）'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: legendData
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            data: xData
          },
          series
        })
      } else {
        this.berthRightOne.setOption({
          title: {
            text: '分年度泊位数量(个)'
          },
          legend: {
            data: []
          },
          yAxis: {
            data: []
          },
          series: [
            {
              data: []
            }
          ]
        })
      }
    },
    // 年度通过能力
    async getBerthCountTrend() {
      let datas = {
        startYear: this.starttime.getFullYear(),
        endYear: this.endtime.getFullYear(),
        city: this.mapclick,
        trendType: 'integrated_throughput_count'
      }
      let { code, data } = await query.getBerthCountTrend(datas)
      if (code === 200) {
        let xData = Object.keys(data)
        let legendDatavalues = Object.values(data)
        let legendData = Object.keys(legendDatavalues[0])
        let aaa = []
        let bbb = []
        let ccc = []
        let that = this
        let yData = Object.values(legendDatavalues)
        yData.forEach((r) => {
          let Rall = Object.values(r)
          aaa.push({
            value: Rall[0], 
            itemStyle: {
              barBorderRadius: [0, 0, 20, 20],
            }
          })
          bbb.push({
            value: Rall[1], 
            itemStyle: {
              barBorderRadius: [0, 0, 0, 0],
            }
          })
          ccc.push({
            value: Rall[2], 
            itemStyle: {
              barBorderRadius: [20, 20, 0, 0]
            }
          })
        })
        let series = [
          {
            name: '内河',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              formatter:function(params){
                if (params.value <= 50) {
                  return ''
                } 
              }
            },
            emphasis: {
              focus: 'series'
            },
            data: aaa,
            barWidth: 25,
            itemStyle: {
              normal: {
                barBorderRadius: [0, 0, 20, 20]
              }
            }
          },
          {
            name: '沿海',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              formatter:function(params){
                if (params.value <= 50) {
                  return ''
                } 
              }
            },
            emphasis: {
              focus: 'series'
            },
            data: bbb,
            barWidth: 25,
            itemStyle: {
              normal: {
                barBorderRadius: [20, 20, 0, 0]
              }
            }
          },
          {
            name: '沿江',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              formatter:function(params){
                if (params.value <= 50) {
                  return ''
                } 
              }
            },
            emphasis: {
              focus: 'series'
            },
            data: ccc,
            barWidth: 25,
            itemStyle: {
              normal: {
                barBorderRadius: [20, 20, 0, 0]
              }
            }
          }
        ];
        for (let i in aaa) {
          if((series[1].data[i].value == 0) && (series[2].data[i].value == 0)){
            series[0].data[i]['itemStyle'] = { barBorderRadius: [20, 20, 20, 20] };
          }else if((series[0].data[i].value == 0) && (series[2].data[i].value == 0)){
            series[1].data[i]['itemStyle'] = { barBorderRadius: [20, 20, 20, 20] };
          }else if((series[1].data[i].value == 0) && (series[0].data[i].value == 0)){
            series[2].data[i]['itemStyle'] = { barBorderRadius: [20, 20, 0, 0] };
          }else if(series[2].data[i].value == 0){
            series[1].data[i]['itemStyle'] = { barBorderRadius: [20, 20, 0, 0] };
          }else if(series[0].data[i].value == 0){
            series[1].data[i]['itemStyle'] = { barBorderRadius: [0, 0, 20, 20] };
          }
        }
        this.berthRightTwo.setOption({
          title: {
            text: '分年度通过能力(吨)' + '（' + this.mapclick + '）'
          },
          legend: {
            data: legendData
          },
          xAxis: {
            data: xData
          },
          color: ['#2bbfe9', '#5782fc', '#2f9aee'],
          series,
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (data) {
                if (data.toString().length >= 13) {
                  var moneys = data / 1000000000000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '万亿'
                } else if (data.toString().length >= 9) {
                  var moneys = data / 100000000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '亿'
                } else if (data.toString().length >= 4) {
                  var moneys = data / 10000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '万'
                } else {
                  var realVal = parseFloat(data)
                  return realVal
                }
                // var datas = that.formatByte(data)
                // return datas
              }
            }
          }
        })
      } else {
        this.berthRightTwo.setOption({
          title: {
            text: '年度通过能力'
          },
          legend: {
            data: []
          },
          yAxis: {
            data: []
          },
          series: [
            {
              data: []
            }
          ]
        })
      }
    },

    dwChange() {
      this.getBerthTypeCount()
      this.getWaterBerthCount()
      this.getAdoptAbility()
      this.getCityAreaPort()
    },
    typeChange() {
      if (this.current == 0) {
        this.getBerthTypeCount()
        this.getWaterBerthCount()
        this.getAdoptAbility()
        this.getCityAreaPort()
      }
      if (this.current == 2) {
        this.getHuffAndPuffStructure()
        this.getHuffAndPuffPort()
        this.getHuffAndPuffSpecialTrend()
        this.getHuffAndPuffPortSingleCity()
      }
    },
    // 公用
    PublicChange(){

    },
    // 货物类型
    CargoChange(){

    },
    //内河航道
    //查询所有船闸跟航道
    //级别下拉框
    gradeChange() {
      this.getChannelStructural()
      this.getChannelMileage()
      this.getChannelGradeChange()
    },

    //航道结构
    async getChannelStructural() {
      let data = {
        // startyear: this.starttime.getFullYear(),
        year: this.selectBarYear.getFullYear(),
        type: this.selectGradeValue != '全部' ? this.selectGradeValue : ''
      }

      let { res, status } = await query.getChannelStructural(data)

      if (status === 200) {
        let data = res.data
        var result = []
        var name = Object.keys(data)

        for (const key in data) {
          result.push({
            name: key,
            value: data[key]
          })
        }
        if (this.berthOne) {
          this.berthOne.setOption({
            title: {
              text: '航道结构' + '(' + this.selectBarYear.getFullYear() + '年)'
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              icon: 'circle',
              itemWidth: 10, // 设置宽度class
              itemHeight: 10, // 设置高度im
              itemGap: 20, // 设置间距
              top: '30%',
              // x: '220',
              right: '5%',
              bottom: 135,
              formatter: function (name) {
                // 获取legend显示内容
                // // console.log(name);
                let data = name //你的数据
                let total = 0
                let tarValue = 0
                let value = 0
                for (let i = 0, l = data.length; i < l; i++) {
                  total += data[i].value
                  if (data[i].name == name) {
                    tarValue = data[i].value
                    value = data[i].value
                  }
                }
                return [
                  '{a|' +
                    echarts.format.truncateText(
                      name,
                      150,
                      '14px Microsoft Yahei',
                      '…'
                    ) +
                    '}'
                ].join(' ')
              },
              tooltip: {
                show: true
              },
              textStyle: {
                rich: {
                  a: {
                    color: 'rgb(51,51,51)',
                    width: 80,
                    align: 'left'
                  },
                  b: {
                    width: 50,
                    align: 'left',
                    color: 'rgb(51,51,51)'
                  },
                  x: {
                    width: 30,
                    align: 'left',
                    color: 'rgb(51,51,51)'
                  }
                }
              }
            },
            series: [
              {
                data: result
              }
            ]
          })
        }
      } else {
        if (this.berthOne) {
          this.berthOne.setOption({
            title: {
              text: '航道结构'
            },

            series: [
              {
                data: []
              }
            ]
          })
        }
      }
    },
    //航道里程
    async getChannelMileage() {
      let data = {
        // startyear: this.starttime.getFullYear(),
        startyear: this.starttime.getFullYear(),
        endyear: this.endtime.getFullYear(),
        type: this.selectGradeValue != '全部' ? this.selectGradeValue : ''
      }

      let { res, status } = await query.getChannelMileage(data)
      if (status === 200) {
        let data = res.data.data
        let datas = []
        data.forEach((r) => {
          datas.push(r.toFixed(2))
        })
        // // console.log(data);
        let xData = res.data.year
        let that = this
        // // console.log(data, xData)
        this.berthTwo.setOption({
          title: {
            text: '分年度航道里程(公里)'
          },
          // legend: {
          //   data: legendData
          // },
          xAxis: {
            data: xData
          },
          series: [
            {
              data: datas
            }
          ],
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (data) {
                if (data.toString().length >= 13) {
                  var moneys = data / 1000000000000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '万亿'
                } else if (data.toString().length >= 9) {
                  var moneys = data / 100000000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '亿'
                } else if (data.toString().length >= 4) {
                  var moneys = data / 10000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '万'
                } else {
                  var realVal = parseFloat(data)
                  return realVal
                }
                // var datas = that.formatByte(data)
                // return datas
              }
            }
          }
        })
      } else {
        this.berthTwo.setOption({
          title: {
            text: '分年度航道里程(公里)'
          },
          legend: {
            data: []
          },
          xAxis: {
            data: []
          },
          series: []
        })
      }
    },
    //航道等级变化趋势
    async getChannelGradeChange() {
      let data = {
        // startyear: this.starttime.getFullYear(),
        startyear: this.starttime.getFullYear(),
        endyear: this.endtime.getFullYear(),
        type: this.selectGradeValue != '全部' ? this.selectGradeValue : ''
      }
      let { res, status } = await query.getChannelGradeChange(data)
      // // console.log('getChannelGradeChange');
      // console.log(data);
      // console.log(res);
      if (status === 200) {
        let data = res.data
        let xData = res.data.year
        let all = []
        let legendData = []
        let a = Object.keys(data)
        a.forEach((r) => {
          if (r !== 'year') {
            legendData.push(r)
          }
        })
        all = Object.values(data)
        let aaa = []
        let bbb = []
        let ccc = []
        all[0].forEach((r) => {
          aaa.push(r.toFixed(2))
        })
        all[1].forEach((r) => {
          bbb.push(r.toFixed(2))
        })
        all[3].forEach((r) => {
          ccc.push(r.toFixed(2))
        })
        let result = [
          {
            name: '高等级航道',
            type: 'line',
            data: aaa
          },
          {
            name: '等级航道',
            type: 'line',
            data: bbb
          },
          {
            name: '等外级航道',
            type: 'line',
            data: ccc
          }
        ]
        let that = this
        // for (const key in data) {
        //   if (key != 'year') {
        //     legendData.push(key)
        //   }
        // }

        // legendData.forEach(r => {
        //   var obj = {}
        //   var arr = []
        //   for (const key in data) {
        //     if (key != 'year') {
        //       arr = data[key]
        //     }
        //   }

        //   obj[r] = arr
        //   result.push(obj)
        // })
        // result.forEach(r => {
        //   yData.push({
        //     type: 'line',
        //     name: Object.keys(r)[0],
        //     stack: 'Total',
        //     tooltip: {
        //       valueFormatter: function(value) {
        //         return value
        //       }
        //     },
        //     data: Object.values(r)[0]
        //   })
        // })

        this.berthThree.setOption({
          title: {
            text: '航道等级变化趋势(公里)'
          },
          // legend: {
          //   data: legendData
          // },
          xAxis: {
            data: xData
          },
          series: result,
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (data) {
                // var datas = that.formatByte(data)
                // return datas
                if (data.toString().length >= 13) {
                  var moneys = data / 1000000000000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '万亿'
                } else if (data.toString().length >= 9) {
                  var moneys = data / 100000000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '亿'
                } else if (data.toString().length >= 4) {
                  var moneys = data / 10000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '万'
                } else {
                  var realVal = parseFloat(data)
                  return realVal
                }
              }
            }
          }
        })
      } else {
        this.berthThree.setOption({
          title: {
            text: '航道等级变化趋势(公里)'
          },
          // legend: {
          //   data: legendData
          // },
          xAxis: {
            data: []
          },
          series: {
            data: []
          }
        })
      }
    },
    //市域航道里程
    async getChannelCityMileage() {
      let data = {
        year: this.middleYear.getFullYear()
      }
      let { res, status } = await query.getChannelCityMileage(data)
      if (status === 200) {
        let data = res.data
        this.tableDataAll = data
        let xData = Object.keys(data)
        let Ydata = Object.values(data)
        let xDatas = []
        let mileage = []
        let levelMileage = []
        let that = this
        Ydata.forEach((r) => {
          // var a = Object.values(r)
          xDatas.push(r.city)
          mileage.push(r.mileage.toFixed(2))
          levelMileage.push(r.levelMileage.toFixed(2))
        })
        let yData = [
          {
            type: 'value',
            name: '公里',
            barWidth: 25, //柱图宽度
            axisLabel: {
              formatter: '{value} '
              // formatter: function (data) {
              //   var datas = that.formatByte(data)
              //   return datas
              // }
            }
          },
          {
            type: 'value',
            name: '公里',
            barWidth: 25, //柱图宽度
            axisLabel: {
              formatter: '{value}'
              // formatter: function (data) {
              //   var datas = that.formatByte(data)
              //   return datas
              // }
            }
          }
        ]
        let legendData = ['航道里程', '等级航道里程']
        let result = [
          {
            name: '航道里程',
            type: 'bar',
            data: mileage,
            barWidth: 15
          },
          {
            name: '等级航道里程',
            type: 'line',
            yAxisIndex: 1,
            data: levelMileage
          }
        ]

        this.middleCharts.setOption({
          title: {
            text: '分地市航道里程'
          },
          legend: {
            data: legendData
          },
          xAxis: {
            data: xDatas,
            axisLabel: {
              rotate: 40
            }
          },
          yAxis: yData,
          series: result
        })
      } else {
        this.middleCharts.setOption({
          title: {
            text: '分航道货运量'
          },
          legend: {
            data: []
          },
          xAxis: {
            data: []
          },
          yAxis: [],
          series: []
        })
      }
    },
    //单个市航道里程
    async getChannelSingleCityMileage() {
      let data = {
        startyear: this.starttime.getFullYear(),
        endyear: this.endtime.getFullYear(),
        city: this.mapclick
      }
      let { res, status } = await query.getChannelSingleCityMileage(data)
      // console.log(res)
      if (status === 200) {
        let data = res.data.data
        let xData = res.data.year
        let yData = []
        let result = []
        let legendData = []
        for (const key in data[0]) {
          legendData.push(key)
        }
        legendData.forEach((r) => {
          var obj = {}
          var arr = []
          data.forEach((rr) => {
            arr.push(rr[r])
          })
          obj[r] = arr
          // console.log(obj)
          result.push(obj)
        })
        let indexdata = []
        let indexdatas = []
        result.forEach((r,index) => {
          console.log(Object.values(r)[0]);
          Object.values(r)[0].forEach((rr,index1)=>{
            if(rr != 0){
              indexdata.push(index)
            }
          })
          indexdatas = [...new Set(indexdata)]
          console.log(indexdatas);
          if(index == indexdatas[0]){
            console.log(index);
            console.log(indexdatas[0]);
            yData.push({
              type: 'bar',
              name: Object.keys(r)[0],
              stack: 'total',
              barWidth: 25, //柱图宽度
              label: {
                show: true,
                formatter:function(params){
                  if (params.value <= 500) {
                    return ''
                  } 
                }
              },
              itemStyle: {
                normal: {
                  barBorderRadius: [20, 0, 0, 20]
                }
              },
              emphasis: {
                focus: 'series'
              },
              data: Object.values(r)[0]
            })
          }else if(index == result.length-1){
            yData.push({
              type: 'bar',
              name: Object.keys(r)[0],
              stack: 'total',
              barWidth: 25, //柱图宽度
              label: {
                show: true,
                formatter:function(params){
                  if (params.value <= 50) {
                    return ''
                  } 
                }
              },
              itemStyle: {
                normal: {
                  barBorderRadius: [0, 20, 20, 0]
                }
              },
              emphasis: {
                focus: 'series'
              },
              data: Object.values(r)[0]
            })
          }else{
            yData.push({
              type: 'bar',
              name: Object.keys(r)[0],
              stack: 'total',
              barWidth: 25, //柱图宽度
              label: {
                show: true,
                formatter:function(params){
                  if (params.value <= 50) {
                    return ''
                  } 
                }
              },
              emphasis: {
                focus: 'series'
              },
              data: Object.values(r)[0]
            })
          }
          
        })
        this.berthRightOne.setOption({
          title: {
            text: '分年度航道里程(公里)' + '（' + this.mapclick + '）'
          },
          legend: {
            type: 'scroll',
            top: '8%',
            textStyle: {
              // color: '#000',
              fontSize: this.fontSize(0.16)
            },
            data: legendData
          },
          yAxis: {
            data: xData
          },
          series: yData

        })
      } else {
        this.berthRightOne.setOption({
          title: {
            text: '分年度航道里程(公里)' + '（' + this.mapclick + '）'
          },
          legend: {
            data: []
          },
          yAxis: {
            data: []
          },
          series: [
            {
              data: []
            }
          ]
        })
      }
    },

    async getChannelSingleCityGradeChange() {
      let data = {
        startyear: this.starttime.getFullYear(),
        endyear: this.endtime.getFullYear(),
        city: this.mapclick
      }
      let { res, status } = await query.getChannelSingleCityGradeChange(data)
      if (status === 200) {
        let data = res.data
        let xData = res.data.year
        let all = []
        let legendData = []
        let a = Object.keys(data)
        a.forEach((r) => {
          if (r !== 'year') {
            legendData.push(r)
          }
        })
        all = Object.values(data)
        let aaa = []
        let bbb = []
        let ccc = []
        all[0].forEach((r) => {
          aaa.push(r.toFixed(2))
        })
        all[1].forEach((r) => {
          bbb.push(r.toFixed(2))
        })
        all[3].forEach((r) => {
          ccc.push(r.toFixed(2))
        })
        let result = [
          {
            name: '高等级航道',
            type: 'line',
            data: aaa
          },
          {
            name: '等级航道',
            type: 'line',
            data: bbb
          },
          {
            name: '等外级航道',
            type: 'line',
            data: ccc
          }
        ]
        let that = this
        // for (const key in data) {
        //   if (key != 'year') {
        //     legendData.push(key)
        //   }
        // }
        // // console.log(legendData);
        // legendData.forEach(r => {
        //   var obj = {}
        //   var arr = []
        //   // console.log(r);
        //   for (const key in data) {
        //     // console.log(data[1]);
        //     if (key != 'year') {
        //       arr = data[key]
        //     }
        //   }
        //   obj[r] = arr
        //   result.push(obj)
        // })
        // result.forEach(r => {
        //   yData.push({
        //     type: 'line',
        //     name: Object.keys(r)[0],
        //     stack: 'Total',
        //     tooltip: {
        //       valueFormatter: function(value) {
        //         return value
        //       }
        //     },
        //     data: Object.values(r)[0]
        //   })
        // })
        this.berthRightTwo.setOption({
          title: {
            text: '航道等级变化趋势(公里)' + '（' + this.mapclick + '）'
          },
          legend: {
            data: legendData
          },
          xAxis: {
            data: xData
          },
          series: result,
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (data) {
                var datas = that.formatByte(data)
                return datas
              }
            }
          }
        })
      }
    },

    // 港口吞吐
    //货物结构
    async getHuffAndPuffStructure() {
      var datas = {
        year: this.selectBarYear.getFullYear(),
        geographicType:
          this.selectTypeValue != '全部' ? this.selectTypeValue : ''
      }
      let { code, data } = await query.getHuffAndPuffStructure(datas)
      if (code === 200) {
        // let data = res.data
        var result = []
        for (const key in data) {
          result.push({
            name: key,
            value: data[key]
          })
        }
        if (this.berthOne) {
          this.berthOne.setOption({
            title: {
              text: '货种结构' + '(' + this.selectBarYear.getFullYear() + '年)'
            },
            series: [
              {
                data: result
              }
            ]
          })
        }
      } else {
        if (this.berthOne) {
          this.berthOne.setOption({
            title: {
              text: '货种结构' + '(' + this.selectBarYear.getFullYear() + '年)'
            },
            series: [
              {
                data: []
              }
            ]
          })
        }
      }
    },
    //港口吞吐量
    async getHuffAndPuffPort() {
      let datas = {
        startYear: this.starttime.getFullYear(),
        endYear: this.endtime.getFullYear(),
        geographicType:
          this.selectTypeValue != '全部' ? this.selectTypeValue : '',
        cargoTransportType:
          this.inAndOutValue != '全部' ? this.inAndOutValue : '',
        cargoTradeType:
          this.domesticAndForeignValue != '全部'
            ? this.domesticAndForeignValue
            : ''
      }
      let { code, data } = await query.getHuffAndPuffPort(datas)
      if (code === 200) {
        // let xData = Object.keys(data)
        // let yData = Object.values(data)
        // let yDatas = []
        // yData.forEach(r=>{
        //   yDatas.push(r.toFixed(2))
        // })
        let xData = Object.keys(data)
        let legendDatavalues = Object.values(data)
        // console.log(xData);
        // console.log(legendDatavalues);
        // let legendData = Object.keys(legendDatavalues[0])
        // let aaa = []
        // let bbb = []
        // let ccc = []
        // let yData = Object.values(legendDatavalues)
        // yData.forEach(r=>{
        //   let Rall = Object.values(r)
        //   aaa.push(Rall[0].toFixed(2))
        //   bbb.push(Rall[1].toFixed(2))
        //   ccc.push(Rall[2].toFixed(2))
        // })
        // // console.log(aaa,bbb,ccc);
        let that = this
        this.berthTwo.setOption({
          title: {
            text: '分年度港口吞吐量(万吨)'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          // legend: {
          //   data: legendData,
          //   top: '15%',
          //   left:'30%'
          // },
          grid: {
            // top:'5%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            data: xData
          },
          series: [
            {
              // name: '内河',
              type: 'bar',
              stack: 'total',
              label: {
                show: false
              },
              emphasis: {
                focus: 'series'
              },
              data: legendDatavalues,
              barWidth: 15,
              itemStyle: {
                normal: {
                  barBorderRadius: [20, 20, 20, 20]
                }
              }
            }
          ],
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (data) {
                // console.log(data);
                if (data.toString().length >= 13) {
                  var moneys = data / 1000000000000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '万亿'
                } else if (data.toString().length >= 9) {
                  var moneys = data / 100000000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '亿'
                } else if (data.toString().length >= 4) {
                  var moneys = data / 10000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '万'
                } else {
                  var realVal = parseFloat(data)
                  return realVal
                }
                // var datas = that.formatByte(data)
                // return datas
              }
            }
          }
        })
      } else {
        this.berthTwo.setOption({
          title: {
            text: '分年度港口吞吐量(万吨)'
          },
          // legend: {
          //   data: legendData
          // },
          xAxis: {
            data: []
          },
          series: [
            {
              data: []
            }
          ]
        })
      }
    },
    //特殊货物趋势
    async getHuffAndPuffSpecialTrend() {
      let datas = {
        startYear: this.starttime.getFullYear(),
        endYear: this.endtime.getFullYear(),
        geographicType:
          this.selectTypeValue != '全部' ? this.selectTypeValue : ''
      }
      let { code, data } = await query.getHuffAndPuffSpecialTrend(datas)
      if (code === 200) {
        // let data = res.data
        let xData = Object.keys(data)
        let yData = Object.values(data)
        let yDatas = []
        yData.forEach((r) => {
          yDatas.push(r.toFixed(2))
        })
        let that = this
        this.berthThree.setOption({
          title: {
            text: '集装箱吞吐量变化趋势(万TEU)'
          },
          // legend: {
          //   data: legendData
          // },
          xAxis: {
            data: xData
          },
          series: {
            data: yDatas
          },
          yAxis: {
            type: 'value'
            // axisLabel: {
            //   formatter: function (data) {
            //     var datas = that.formatByte(data)
            //     return datas
            //   }
            // }
          }
        })
      } else {
        this.berthThree.setOption({
          title: {
            text: '集装箱吞吐量变化趋势(万TEU)'
          },
          // legend: {
          //   data: legendData
          // },
          xAxis: {
            data: []
          },
          series: {
            data: []
          }
        })
      }
    },
    async getHuffAndPuffPortCity() {
      let datas = {
        year: this.middleYear.getFullYear(),
        cargoType: this.goodsTypeValue != '全部' ? this.goodsTypeValue : ''
      }
      let { code, data } = await query.getHuffAndPuffPortCity(datas)
      if (code === 200) {
        // let dataAll = []
        // for(let i in data){
        //   dataAll.push({city:i,number:data[i]})
        // }
        let xData = []
        let ydatas = []
        let that = this
        // this.tableDataAll = dataAll
        this.tableDataAll = data
        this.gktableData = data
        // console.log(data);
        data.forEach((r) => {
          var aa = Object.keys(r)
          var bb = Object.values(r)
          xData.push(aa[0])
          ydatas.push(bb[0].toFixed(2))
        })
        let yData = [
          {
            type: 'value',
            name: '吨',
            barWidth: 25, //柱图宽度
            axisLabel: {
              // formatter: '{value} '
              formatter: function (data) {
                // var datas = that.formatByte(data)
                // return datas
                if (data.toString().length >= 13) {
                  var moneys = data / 1000000000000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '万亿'
                } else if (data.toString().length >= 9) {
                  var moneys = data / 100000000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '亿'
                } else if (data.toString().length >= 4) {
                  var moneys = data / 10000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '万'
                } else {
                  var realVal = parseFloat(data)
                  return realVal
                }
              }
            }
          }
        ]
        let legendData = []
        let result = [
          {
            name: '航道里程',
            type: 'bar',
            data: ydatas,
            barWidth: 15
          }
        ]

        this.middleCharts.setOption({
          title: {
            text: '分市港口吞吐量(万吨)'
          },
          legend: {
            data: legendData
          },
          xAxis: {
            data: xData,
            axisLabel: {
              rotate: 40
            }
          },
          yAxis: yData,
          series: result
        })
      } else {
      }
    },
    //单个城市港口吞吐量
    async getHuffAndPuffPortSingleCity() {
      let datas = {
        startYear: this.starttime.getFullYear(),
        endYear: this.endtime.getFullYear(),
        geographicType:
          this.selectTypeValue != '全部' ? this.selectTypeValue : '',
        city: this.mapclick
      }
      let { code, data } = await query.getHuffAndPuffPortSingleCity(datas)
      // console.log(111);
      if (code === 200) {
        let xData = Object.keys(data)
        let legendDatavalues = Object.values(data)
        let legendData = Object.keys(legendDatavalues[0])
        let aaa = []
        let bbb = []
        let ccc = []
        let yData = Object.values(legendDatavalues)
        yData.forEach((r) => {
          let Rall = Object.values(r)
          aaa.push(Rall[0].toFixed(2))
          bbb.push(Rall[1].toFixed(2))
          ccc.push(Rall[2].toFixed(2))
        })
        let that = this
        // result.push({
        //   type: 'bar',
        //   stack: 'total',
        //   barWidth: 25, //柱图宽度
        //   label: {
        //     show: true
        //   },
        //   emphasis: {
        //     focus: 'series'
        //   },
        //   itemStyle: {
        //     normal: {
        //       barBorderRadius: [20, 20, 20, 20]
        //     }
        //   },
        //   data: datas
        // })

        this.berthRightOne.setOption({
          title: {
            text: '分年度港口吞吐量(万吨)' + '（' + this.mapclick + '）'
          },
          legend: {
            data: legendData
          },
          color: ['#68bdff'],
          xAxis: [
            {
              axisLabel: {
                textStyle: {
                  color: '#aaaaaa',
                  fontSize: 12
                },
                rotate: 40,
                margin: 12,
                formatter: function (data) {
                  var datas = that.formatByte(data)
                  return datas
                }
              }
            }
          ],
          yAxis: {
            data: xData
          },
          series: [
            {
              name: '内河',
              type: 'bar',
              stack: 'total',
              label: {
                show: true,
                formatter:function(params){
                  if (params.value <= 50) {
                    return ''
                  } 
                }
              },
              emphasis: {
                focus: 'series'
              },
              data: aaa,
              barWidth: 25,
              itemStyle: {
                normal: {
                  barBorderRadius: [0, 20, 20, 0]
                }
              }
            },
            {
              name: '沿海',
              type: 'bar',
              stack: 'total',
              label: {
                show: true,
                formatter:function(params){
                  if (params.value <= 50) {
                    return ''
                  } 
                }
              },
              emphasis: {
                focus: 'series'
              },
              data: bbb,
              barWidth: 25
            },
            {
              name: '沿江',
              type: 'bar',
              stack: 'total',
              label: {
                show: true,
                formatter:function(params){
                  if (params.value <= 50) {
                    return ''
                  } 
                }
              },
              emphasis: {
                focus: 'series'
              },
              data: ccc,
              barWidth: 25,
              itemStyle: {
                normal: {
                  barBorderRadius: [20, 0, 0, 20]
                },
              }
            }
          ]
        })
      } else {
        this.berthRightOne.setOption({
          title: {
            text: '分年度港口吞吐量(万吨)' + '（' + this.mapclick + '）'
          },

          yAxis: {
            data: []
          },
          series: [
            {
              data: []
            }
          ]
        })
      }
    },
    async getHuffAndPuffSpecialTrendOfCity() {
      let datas = {
        startYear: this.starttime.getFullYear(),
        endYear: this.endtime.getFullYear(),
        geographicType:
          this.selectTypeValue != '全部' ? this.selectTypeValue : '',
        city: this.mapclick
      }
      let { code, data } = await query.getHuffAndPuffSpecialTrendOfCity(datas)
      if (code === 200) {
        let xData = Object.keys(data)
        let yDatas = Object.values(data)
        let legendData = []
        let Ydata = []
        let aaa = []
        let bbb = []
        let ccc = []
        let ddd = []
        let that = this
        yDatas.forEach((r) => {
          legendData = Object.keys(r)
          // console.log(legendData);
          let aa = Object.values(r)
          aaa.push(aa[0].toFixed(2))
          bbb.push(aa[1].toFixed(2))
          ccc.push(aa[2].toFixed(2))
          ddd.push(aa[3].toFixed(2))
        })
        let result = [
          {
            name: '内支',
            type: 'line',
            data: aaa
          },
          {
            name: '国内',
            type: 'line',
            data: bbb
          },
          {
            name: '国际',
            type: 'line',
            data: ccc
          },
          {
            name: '合计',
            type: 'line',
            data: ddd
          }
        ]
        this.berthRightTwo.setOption({
          title: {
            text: '集装箱吞吐量变化趋势(万TEU)' + '（' + this.mapclick + '）'
          },
          legend: {
            data: legendData
          },
          xAxis: {
            data: xData
          },
          series: result,
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (data) {
                var datas = that.formatByte(data)
                return datas
              }
            }
          }
        })
      }
    },

    //航道货运
    //查询所有船闸跟航道
    async getRoadAndGateAll(hd) {
      let { res, status } = await query.getRoadAndGateAll({ hd })
      if (status === 200) {
        let data = res.data
        this.cities = data.map((r) => {
          return r
        })
        this.getCargoVolumeOfChannelLock(this.lockfreight)
        this.getChannelLockThroughput(this.lockfreight)
      } else {
        this.cities = []
      }
      // console.log('cities');
      // console.log(this.cities);
    },
    //获取航道
    async getRoadAll() {
      let { res, status } = await query.getRoadAll()
      if (status === 200) {
        let data = res.data
        this.selectRoadOptions = data.map((r) => {
          return {
            name: r,
            value: r
          }
        })
        this.selectRoadOptions.unshift({ name: '全部', value: '全部' })
      } else {
        this.selectRoadOptions = []
      }
    },
    //获取货物类型
    async getGoodsType() {
      let { res, status } = await query.getGoodsType()
      if (status === 200) {
        let data = res.data
        this.selectGoodsOptions = data.map((r) => {
          return {
            name: r.goodsname,
            value: r.goodsname
          }
        })
        this.selectGoodsOptions.unshift({ name: '全部', value: '全部' })
      } else {
        this.selectGoodsOptions = []
      }
    },

    //货种结构
    async getCargoProportion() {
      let data = {
        year: this.selectBarYear.getFullYear(),
        hd: this.gisTopValue.substring(0, 2) == '船闸' ? '船闸' : '航道',
        hwlx: this.selectGoodsValue != '全部' ? this.selectGoodsValue : '',
        type: this.selectRoadValue != '全部' ? this.selectRoadValue : ''
      }
      let { res, status } = await query.getCargoProportion(data)
      if (status === 200) {
        let data = res.data
        var result = []
        var name = Object.keys(data)
        for (const key in data) {
          result.push({
            name: key,
            value: data[key]
          })
        }
        if (this.berthOne) {
          this.berthOne.setOption({
            title: {
              text: '货种结构' + '(' + this.selectBarYear.getFullYear() + '年)'
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              icon: 'circle',
              itemWidth: 10, // 设置宽度class
              itemHeight: 10, // 设置高度im
              itemGap: 20, // 设置间距
              top: '30%',
              // x: '220',
              right: '5%',
              bottom: 135,
              formatter: function (name) {
                // 获取legend显示内容
                // console.log(name);
                let data = name //你的数据
                let total = 0
                let tarValue = 0
                let value = 0
                for (let i = 0, l = data.length; i < l; i++) {
                  total += data[i].value
                  if (data[i].name == name) {
                    tarValue = data[i].value
                    value = data[i].value
                  }
                }
                return [
                  '{a|' +
                    echarts.format.truncateText(
                      name,
                      150,
                      '14px Microsoft Yahei',
                      '…'
                    ) +
                    '}'
                ].join(' ')
              },
              tooltip: {
                show: true
              },
              textStyle: {
                rich: {
                  a: {
                    color: 'rgb(51,51,51)',
                    width: 80,
                    align: 'left'
                  },
                  b: {
                    width: 50,
                    align: 'left',
                    color: 'rgb(51,51,51)'
                  },
                  x: {
                    width: 30,
                    align: 'left',
                    color: 'rgb(51,51,51)'
                  }
                }
              }
            },
            series: [
              {
                data: result
              }
            ]
          })
        }
      } else {
        this.berthOne.setOption({
          title: {
            text: '货物结构'
          },
          series: [
            {
              data: []
            }
          ]
        })
      }
    },
    //航道货运量
    async getCargoStructure() {
      let data = {
        startyear: this.starttime.getFullYear(),
        endyear: this.endtime.getFullYear(),
        hd: this.gisTopValue.substring(0, 2) == '船闸' ? '船闸' : '航道',
        hwlx: this.selectGoodsValue != '全部' ? this.selectGoodsValue : '',
        type: this.selectRoadValue != '全部' ? this.selectRoadValue : ''
      }
      let { res, status } = await query.getCargoStructure(data)
      if (status === 200) {
        let data = res.data.data
        let xData = res.data.year
        let that = this
        this.berthTwo.setOption({
          title: {
            text: '分年度航道货运量(吨)'
          },
          // legend: {
          //   data: legendData
          // },
          xAxis: {
            data: xData
          },
          series: [
            {
              data: data
            }
          ],
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (data) {
                // console.log(data);
                var datas = that.formatByte(data)
                return datas
              }
            }
          }
        })
      } else {
        this.berthTwo.setOption({
          title: {
            text: '分年度航道货运量(吨)'
          },
          // legend: {
          //   data: legendData
          // },
          xAxis: {
            data: []
          },
          series: [
            {
              data: []
            }
          ]
        })
      }
    },
    //船舶通过量
    async getFreightVolume() {
      let data = {
        startyear: this.starttime.getFullYear(),
        endyear: this.endtime.getFullYear(),
        hd: this.gisTopValue.substring(0, 2) == '船闸' ? '船闸' : '航道',
        hwlx: this.selectGoodsValue != '全部' ? this.selectGoodsValue : '',
        type: this.selectRoadValue != '全部' ? this.selectRoadValue : ''
      }
      // // console.log('getFreightVolume');
      // // console.log(data);
      let { res, status } = await query.getFreightVolume(data)
      if (status === 200) {
        let data = res.data
        let xData = data.year
        let yData = data.data
        let that = this
        this.berthThree.setOption({
          title: {
            text: '分年度船舶通过量(艘次)'
          },
          // legend: {
          //   data: legendData
          // },
          xAxis: {
            data: xData
          },
          series: {
            data: yData
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (data) {
                // console.log(data);
                // var datas = that.formatByte(data)
                // return datas
                if (data.toString().length >= 13) {
                  var moneys = data / 1000000000000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '万亿'
                } else if (data.toString().length >= 9) {
                  var moneys = data / 100000000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '亿'
                } else if (data.toString().length >= 4) {
                  var moneys = data / 10000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '万'
                } else {
                  var realVal = parseFloat(data)
                  return realVal
                }
              }
            }
          }
        })
      } else {
        this.berthThree.setOption({
          title: {
            text: '分年度船舶通过量(艘次)'
          },
          // legend: {
          //   data: legendData
          // },
          xAxis: {
            data: []
          },
          series: {
            data: []
          }
        })
      }
    },
    //货运中下的图表
    async getTransport() {
      let data = {
        year: this.middleYear.getFullYear(),
        hd: this.gisTopValue.substring(0, 2) == '船闸' ? '船闸' : '航道',
        sl: this.checkedCities ? this.checkedCities.join(',') : ''
      }
      let { res, status } = await query.getTransport(data)
      if (status === 200) {
        this.checkedCities = res.data.name
        let data = res.data
        let that = this
        // let data = res.data.data
        let xData = data.name
        let yData = [
          {
            type: 'value',
            name: '货运量(吨)',
            barWidth: 25, //柱图宽度
            axisLabel: {
              // formatter: '{value} '
              formatter: function (data) {
                // var datas = that.formatByte(data)
                // return datas
                if (data.toString().length >= 13) {
                  var moneys = data / 1000000000000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '万亿'
                } else if (data.toString().length >= 9) {
                  var moneys = data / 100000000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '亿'
                } else if (data.toString().length >= 4) {
                  var moneys = data / 10000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '万'
                } else {
                  var realVal = parseFloat(data)
                  return realVal
                }
              }
            }
          },
          {
            type: 'value',
            name: '通过量(个)',
            barWidth: 25, //柱图宽度
            axisLabel: {
              // formatter: '{value}'
              formatter: function (data) {
                // console.log(data);
                // var datas = that.formatByte(data)
                // return datas
                if (data.toString().length >= 13) {
                  var moneys = data / 1000000000000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '万亿'
                } else if (data.toString().length >= 9) {
                  var moneys = data / 100000000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '亿'
                } else if (data.toString().length >= 4) {
                  var moneys = data / 10000
                  var realVal = parseFloat(moneys).toFixed(0)
                  return realVal + '万'
                } else {
                  var realVal = parseFloat(data)
                  return realVal
                }
              }
            }
          }
        ]
        let legendData = [
          this.gisTopValue.substring(0, 2) + '货运量',
          '船舶通过量'
        ]
        let result = [
          {
            name: this.gisTopValue.substring(0, 2) + '货运量',
            type: 'bar',
            data: data.data,
            barWidth: 15
          },
          {
            name: '船舶通过量',
            type: 'line',
            yAxisIndex: 1,
            data: data.datazx
          }
        ]

        this.middleCharts.setOption({
          title: {
            text: '分航道货运量'
          },
          legend: {
            data: legendData
          },
          xAxis: {
            data: xData,
            axisLabel: {
              rotate: 40
            }
          },
          yAxis: yData,
          series: result
        })
      }
    },
    //货运中下的图表
    async getTransportAll() {
      let data = {
        year: this.middleYear.getFullYear(),
        hd: this.gisTopValue.substring(0, 2) == '船闸' ? '船闸' : '航道',
        sl: this.checkedCities ? this.checkedCities.join(',') : ''
      }
      let { res, status } = await query.getTransportAll(data)
      if(status == 200){

      }
    },
    //航道船闸货运量（右一图）
    async getCargoVolumeOfChannelLock(hwlx) {
      // console.log(hwlx);
      let data = {
        startyear: this.starttime.getFullYear(),
        endyear: this.endtime.getFullYear(),
        hwlx: this.lockfreight
      }
      let { res, status } = await query.getCargoVolumeOfChannelLock(data)
      if (status === 200) {
        let data = res.data.data
        let xData = res.data.year
        let textValue
        let result = []
        let that = this
        result.push({
          type: 'bar',
          stack: 'total',
          barWidth: 25, //柱图宽度
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            normal: {
              barBorderRadius: [20, 20, 20, 20]
            }
          },
          data: data
        })
        if(this.gisTopValue.substring(0, 2) == "船闸"){
          textValue = '分年度过闸货运量(吨)'
        }else {
          textValue = '分年度航道货运量(吨)'
        }
        this.berthRightOne.setOption({
          title: {
            text: textValue,
            subtext: hwlx
          },
          color: ['#68bdff'],
          xAxis: [
            {
              axisLabel: {
                textStyle: {
                  color: '#aaaaaa',
                  fontSize: 12
                },
                rotate: 40,
                margin: 12,
                formatter: function (data) {
                  // console.log(data);
                  // var datas = that.formatByte(data)
                  // return datas
                  if (data.toString().length >= 13) {
                    var moneys = data / 1000000000000
                    var realVal = parseFloat(moneys).toFixed(0)
                    return realVal + '万亿'
                  } else if (data.toString().length >= 9) {
                    var moneys = data / 100000000
                    var realVal = parseFloat(moneys).toFixed(0)
                    return realVal + '亿'
                  } else if (data.toString().length >= 4) {
                    var moneys = data / 10000
                    var realVal = parseFloat(moneys).toFixed(0)
                    return realVal + '万'
                  } else {
                    var realVal = parseFloat(data)
                    return realVal
                  }
                }
              }
            }
          ],
          yAxis: {
            data: xData
          },
          series: result
        })
      } else {
        this.berthRightOne.setOption({
          title: {
            text: this.gisTopValue,
            subtext: hwlx
          },

          yAxis: {
            data: []
          },
          series: [
            {
              data: []
            }
          ]
        })
      }
    },
    //航道年度船舶通过（右二图）
    async getChannelLockThroughput(hwlx) {
      let data = {
        startyear: this.starttime.getFullYear(),
        endyear: this.endtime.getFullYear(),
        hwlx: this.lockfreight
      }
      let { res, status } = await query.getChannelLockThroughput(data)
      if (status === 200) {
        let data = res.data.data
        let xData = res.data.year
        let yData = []
        let that = this
        let textValues
        yData.push({
          type: 'line',

          stack: 'Total',
          tooltip: {
            valueFormatter: function (value) {
              return value
            }
          },
          data: data
        })
        if(this.gisTopValue.substring(0, 2) == "船闸"){
          textValues = '分年度船闸船舶通过量(艘次)'
        }else {
          textValues = '分年度航道船舶通过量(艘次)'
        }
        this.berthRightTwo.setOption({
          title: {
            // text: this.gisTopValue.substring(0, 2) + '年度船舶通过量',
            text:textValues,
            subtext: hwlx
          },
          xAxis: {
            data: xData
          },
          series: yData,
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (data) {
                // var datas = that.formatByte(data)
                // return datas
                if (data.toString().length >= 13) {
                  var moneys = data / 1000000000000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '万亿'
                } else if (data.toString().length >= 9) {
                  var moneys = data / 100000000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '亿'
                } else if (data.toString().length >= 4) {
                  var moneys = data / 10000
                  var realVal = parseFloat(moneys).toFixed(1)
                  return realVal + '万'
                } else {
                  var realVal = parseFloat(data)
                  return realVal
                }
              }
            }
          }
        })
      } else {
        this.berthRightTwo.setOption({
          title: {
            text: this.gisTopValue.substring(0, 2) + '年度船舶通过量',
            subtext: hwlx
          },
          xAxis: {
            data: []
          },
          series: []
        })
      }
    },
    // 航道下拉方法
    roadChange() {
      this.getCargoProportion()
      this.getCargoStructure()
      this.getFreightVolume()
    },
    // 货物类型下拉方法
    goodsChange() {
      this.getCargoProportion()
      this.getCargoStructure()
      this.getFreightVolume()
    },

    //货运OD
    //货运OD始发地
    async getOdPlaceOfOrigin() {
      let { res, status } = await query.getOdPlaceOfOrigin()
      if (status === 200) {
        let data = res.data
        this.placeOfOriginOptions = data.map((r) => {
          return {
            value: r,
            label: r
          }
        })
        // this.placeOfOriginVlaue = datap[0].startandend
      } else {
        this.placeOfOriginOptions = []
      }
    },
    //货运OD出发地
    async getOdDestination() {
      let { res, status } = await query.getOdPlaceOfOrigin()
      if (status === 200) {
        let data = res.data
        this.destinationOptions = data.map((r) => {
          return {
            value: r,
            label: r
          }
        })
      } else {
        this.destinationOptions = []
      }
    },
    //货运OD货运种类
    async getOdgoodsType() {
      let { res, status } = await query.getOdgoodsType()
      if (status === 200) {
        let data = res.data
        this.goodsOdTypeOption = data.map((r) => {
          return {
            value: r.id,
            label: r.goodsname
          }
        })
        this.goodsOdTypeOption.unshift({ value: '全部', label: '全部' })
        this.goodsOdTypeValue = '全部'
      } else {
        this.goodsOdTypeOption = []
        this.goodsOdTypeValue = ''
      }
    },
    //货运OD表格
    // async getOdTable() {
    //   this.loading = true
    //   // console.log(this.odVlaues);
    //   let bb = this.odVlaues[1].split('-')[1] //月
    //   let cc = this.odVlaues[1].split('-')[0] //年
    //   let aa = '' //日
    //   if (
    //     bb == '01' ||
    //     bb == '03' ||
    //     bb == '05' ||
    //     bb == '07' ||
    //     bb == '08' ||
    //     bb == '10' ||
    //     bb == '12'
    //   ) {
    //     aa = 31
    //   } else if (bb == '02') {
    //     if (
    //       (cc % 4 == 0 && cc % 100 != 0) ||
    //       (cc % 100 == 0 && cc % 400 == 0)
    //     ) {
    //       aa = 29
    //     } else {
    //       aa = 28
    //     }
    //   } else {
    //     aa = 30
    //   }
    //   // console.log(aa);
    //   let datas = {
    //     pageIndex: this.pageno,
    //     pageSize: this.pagesize,
    //     departure: this.placeOfOriginVlaue ? this.placeOfOriginVlaue : '',
    //     destination: this.destinationVlaue ? this.destinationVlaue : '',
    //     startDate: this.odVlaues[0],
    //     endDate: this.odVlaues[1],
    //     category: this.goodsOdTypeValue == '全部' ? '' : this.goodsOdTypeValue
    //   }
    //   // console.log(data);
    //   let { code, data } = await query.getOdTable(datas)
    //   if (code === 200) {
    //     this.loading = false
    //     this.odtableData = data.data
    //     this.total = data.total
    //   } else {
    //     this.odtableData = []
    //     this.total = 0
    //   }
    // },
    async getOdTable() {
      this.loading = true
      let bb = this.odVlaues[1].split('-')[1] //月
      let cc = this.odVlaues[1].split('-')[0] //年
      let aa = '' //日
      if (
        bb == '01' ||
        bb == '03' ||
        bb == '05' ||
        bb == '07' ||
        bb == '08' ||
        bb == '10' ||
        bb == '12'
      ) {
        aa = 31
      } else if (bb == '02') {
        if (
          (cc % 4 == 0 && cc % 100 != 0) ||
          (cc % 100 == 0 && cc % 400 == 0)
        ) {
          aa = 29
        } else {
          aa = 28
        }
      } else {
        aa = 30
      }
      let datas = {
        pageIndex: this.pageno,
        pageSize: this.pagesize,
        departure: this.placeOfOriginVlaue ? this.placeOfOriginVlaue : '',
        destination: this.destinationVlaue ? this.destinationVlaue : '',
        startDate: this.odVlaues[0],
        endDate: this.odVlaues[1],
        category: this.goodsOdTypeValue == '全部' ? '' : this.goodsOdTypeValue
      }
      let { code, data , total } = await query.getOdTable(datas)
      if (code === 200) {
        this.loading = false
        this.odtableData = data
        this.total = total
      } else {
        this.odtableData = []
        this.total = 0
      }
    },
    // 货运OD图表
    async getOdErchaerts() {
      let bb = this.odVlaues[1].split('-')[1] //月
      let cc = this.odVlaues[1].split('-')[0] //年
      let aa = '' //日
      if (
        bb == '01' ||
        bb == '03' ||
        bb == '05' ||
        bb == '07' ||
        bb == '08' ||
        bb == '10' ||
        bb == '12'
      ) {
        aa = 31
      } else if (bb == '02') {
        if (
          (cc % 4 == 0 && cc % 100 != 0) ||
          (cc % 100 == 0 && cc % 400 == 0)
        ) {
          aa = 29
        } else {
          aa = 28
        }
      } else {
        aa = 30
      }
      let data = {
        pageno: 1,
        pagesize: 30,
        start: this.placeOfOriginVlaue ? this.placeOfOriginVlaue : '',
        end: this.destinationVlaue ? this.destinationVlaue : '',
        // starttime: this.odVlaue[0] + "-" + "01",
        // starttime : cc-3 + "-" + bb + "-" + aa,
        starttime: this.odVlaues[0] + '-' + '01',
        endtime: this.odVlaues[1] + '-' + aa,
        goodstype: (this.goodsOdTypeValue = '全部' ? '' : this.goodsOdTypeValue)
      }

      let { res, status } = await query.getOdErchaerts(data)
      if (status === 200) {
        // 初始化中间地图
        this.odEchartMap = echartsMapInit(
          document.querySelector('#echartsMap'),
          res.data
        )
        let data = res.data
        let yData = data.map((r, index) => {
          // if(r.endcs == '其它'){
          //   data.splice(index,1)
          // }else{

          return r.startcs + '-' + r.endcs
          // }
        })
        let xData = data.map((r) => {
          return r.realload
        })
        let max = xData[0]
        let min = xData[xData.length - 1]
        // console.log(xData)
        //  this.odEcharts.clear()
        this.odEcharts.setOption({
          visualMap: {
            min: min,
            max: max
          },
          yAxis: [
            {
              data: yData
            }
          ],

          series: [
            {
              label: {
                show: true,
                position: 'right'
              },
              data: xData
            }
          ]
        })
      } else {
      }
    },

    async getOdRadar() {
      let data = {
        starttime: this.odVlaue[0],
        endtime: this.odVlaue[1],
        goodstype: (this.goodsOdTypeValue = '全部' ? '' : this.goodsOdTypeValue)
      }
      let { res, status } = await query.getOdRadar(data)
      if (status === 200) {
        this.odEchartsData = res.data
      } else {
      }
    },
    async getOdMulberry(selectedCity) {
      let data = {
        starttime: this.odVlaue[0],
        endtime: this.odVlaue[1],
        goodstype: (this.goodsOdTypeValue = '全部'
          ? ''
          : this.goodsOdTypeValue),
        city: selectedCity
      }
      let { res, status } = await query.getOdMulberry(data)
      if (status === 200) {
        this.odEchartsData = res.data
      } else {
      }
    },
    mulberryCitySelected(selectedCity) {
      this.getOdMulberry(selectedCity)
    },

    dialogEchart(item) {
      this.echartcurrent = item

      if (item === 1) {
        this.getOdRadar()
        this.dialogTitle = '省内港口出发、到达货运量分布示意图'
      } else {
        // 选择城市后加载数据
        // this.getOdMulberry()
        this.dialogTitle = '省内河运与周边省市货物流转情况图'
      }
      this.dialogVisible = true
    },
    // 货运OD分页
    handleCurrentChange(count) {
      this.pageno = count
      this.getOdTable()
    },

    //货运吞吐和航道货运右上角下拉
    SelectGisTop(val) {
      if (this.current === 2) {
      } else {
        this.checkedCities = []
        this.getRoadAndGateAll(val.substring(0, 2))
        this.getTransport()
        this.getTransportAll()
        if (val.substring(0, 2) === '船闸') {
          polygonchannel.setVisible(false)
          pointshiplock.setVisible(true)
          this.lockfreight = '江苏省刘集船闸'
        } else {
          polygonchannel.setVisible(true)
          pointshiplock.setVisible(false)
          this.lockfreight = '连申线焦港河段'
        }
      }
    },
    // 更新依赖startTime的charts
    startTimeChange(val) {
      this.starttime = new Date(val)
      if (this.current === 0) {
        // this.getBerthTypeCount()
        this.getWaterBerthCount()
        this.getAdoptAbility()
        // this.getCityAreaPort()
        this.getYearBerthCount()
        this.getBerthCountTrend()
      } else if (this.current === 1) {
        // this.getChannelStructural()
        this.getChannelMileage()
        this.getChannelGradeChange()
        // this.getChannelCityMileage()
        this.getChannelSingleCityMileage()
        this.getChannelSingleCityGradeChange()
      } else if (this.current === 2) {
        this.getHuffAndPuffPort()
        this.getHuffAndPuffSpecialTrend()
        this.getHuffAndPuffPortSingleCity()
        this.getHuffAndPuffSpecialTrendOfCity()
      } else if (this.current === 3) {
        this.getCargoStructure()
        this.getFreightVolume()
        this.getCargoVolumeOfChannelLock()
        this.getChannelLockThroughput()
      }
    },
    // 更新依赖endTime的charts
    endTimeChange(val) {
      this.endtime = new Date(val)
      this.selectBarYear = new Date(val)
      // endTime带动middleYear更新时，不会引起change事件，需要手动触发middleYearChange
      this.middleYear = new Date(val)
      this.middleYearChange()
      if (this.current === 0) {
        // this.getBerthTypeCount()
        this.getWaterBerthCount()
        this.getAdoptAbility()
        // this.getCityAreaPort()
        this.getYearBerthCount()
        this.getBerthCountTrend()
      } else if (this.current === 1) {
        // this.getChannelStructural()
        this.getChannelMileage()
        this.getChannelGradeChange()
        // this.getChannelCityMileage()
        this.getChannelSingleCityMileage()
        this.getChannelSingleCityGradeChange()
      } else if (this.current === 2) {
        this.getHuffAndPuffPort()
        this.getHuffAndPuffSpecialTrend()
        this.getHuffAndPuffPortSingleCity()
        this.getHuffAndPuffSpecialTrendOfCity()
      } else if (this.current === 3) {
        this.getCargoStructure()
        this.getFreightVolume()
        this.getCargoVolumeOfChannelLock()
        this.getChannelLockThroughput()
      }
    },
    selectBarChange() {
      // console.log('selectBarChange');
      switch (this.current) {
        case 0:
          this.getBerthTypeCount()
          break
        case 1:
          this.getChannelStructural()
          break
        case 2:
          this.getHuffAndPuffStructure()
          break
        case 3:
          this.getCargoProportion()
          break
        default:
          break
      }
    },
    middleYearChange() {
      // console.log('middleYearChange');
      switch (this.current) {
        case 0:
          this.isratiotable = false
          this.getCityAreaPort()
          this.workJSON()
          break
        case 1:
          this.isratiotable = false
          this.getChannelCityMileage()
          break
        case 2:
          this.isratiotable = false
          this.getHuffAndPuffPortCity()
          this.workJSON()
          break
        case 3:
          this.getTransport()
          this.getTransportAll()
          break
        default:
          break
      }
    },
    checkedCitiesChanged() {
      this.getTransport()
    },

    echartsResize() {
      if (this.berthOne) this.berthOne.resize()
      if (this.berthTwo) this.berthTwo.resize()
      if (this.berthThree) this.berthThree.resize()
      if (this.middleCharts) this.middleCharts.resize()
      if (this.berthRightOne) this.berthRightOne.resize()
      if (this.berthRightTwo) this.berthRightTwo.resize()
      if (this.odEcharts) this.odEcharts.resize()
      if (this.odEchartMap) this.odEchartMap.resize()
      //   if (this.middleCharts) this.middleCharts.resize()
    },

    echartsClear() {
      if (this.berthOne) this.berthOne.dispose()
      if (this.berthTwo) this.berthTwo.dispose()
      if (this.berthThree) this.berthThree.dispose()
      if (this.middleCharts) this.middleCharts.dispose()
      if (this.berthRightOne) this.berthRightOne.dispose()
      if (this.berthRightTwo) this.berthRightTwo.dispose()
      if (this.odEcharts) this.odEcharts.dispose()
      if (this.odEchartMap) this.odEchartMap.dispose()
    },

    windowResize() {
      window.onresize = () => {
        this.echartsResize()
      }
    },

    updateGisTop() {
      if (this.current === 2) {
        ;(this.gisTopValue = '全部'),
          (this.gisTopOptions = [
            {
              label: '全部',
              value: '全部'
            },
            {
              label: '集装箱数量',
              value: '集装箱数量'
            },
            {
              label: '货物',
              value: '货物'
            },
            {
              label: '滚装汽车',
              value: '滚装汽车'
            }
          ])
      } else {
        ;(this.gisTopValue = '船闸货运量'),
          (this.gisTopOptions = [
            {
              label: '船闸货运量',
              value: '船闸货运量'
            },
            {
              label: '航道货运量',
              value: '航道货运量'
            }
          ])
      }
    }
  },
  computed: {}
}
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view {
  max-width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
}

.information-retrieval {
  width: 100px;
  height: 100%;
  // background-color: #fff;
  box-shadow: 0px 2px 16px 0px rgba(4, 23, 37, 0.3);

  background: rgb(29, 88, 133);

  .information-box {
    height: 93%;
    display: flex;
    flex-direction: column;
    align-items: center;
    > div {
      width: 74px;
      height: 68px;
      margin-top: 20px;
      background-color: rgba(29, 132, 210, 0.7);
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      cursor: pointer;
      > img {
        width: 30px;
        height: 30px;
      }
      > p {
        font-size: 14px;
        color: #ffffff;
      }
    }
    .active {
      background-color: rgba(41, 237, 252, 0.7);
    }

    // .information-menu::after{
    //    width: 30%;
    //     height: 26%;
    //     content: "";
    // }
    // .information-content{
    //   height: 65%;
    //   width: 100%;
    //   background: rgba(56, 113, 158,.3);
    //   overflow-y: auto;
    //   .el-tree{
    //     color: #fff;
    //     background: transparent ;
    //     /deep/ .el-tree-node__content:hover {
    //       background-color: transparent;
    //       color: #fff;
    //     }
    //     /deep/ .el-tree-node:focus > .el-tree-node__content {
    //       background-color: transparent;
    //       color: #fff;
    //     }

    //   }
    // }
  }
}

.left {
  width: 21%;
  height: 100%;
  background: #fff;
  .search-box
  {
    width: 100%;
    height: 130px;
    // min-height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    > div:first-child {
      width: 100%;
      height: 50%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > div {
        width: 45%;
        height: 100%;
        cursor: pointer;
        /deep/.el-date-editor.el-input,
        /deep/.el-date-editor.el-input__inner {
          width: 100%;
          height: 10px;
          /deep/ .el-input__prefix,
          /deep/.el-input__suffix {
            top: -3px;
            height: 100%;
          }
        }
        .el-icon-circle-close {
          display: none;
        }
      }
    }
    .select-box,.select-box1 {
      width: 100%;
      height: 50%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .select-block {
        width: 45%;
        height: 100%;
        .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          width: 100%;
          height: 100%;
          /deep/ .el-input__prefix,
          .el-input__suffix {
            top: -3px;
          }
        }
        .el-icon-circle-close {
          display: none;
        }
      }
      .select-block-width {
        width: 100%;
        .el-select {
          width: 100%;
        }
      }
    }
  }
  .echarts-box {
    height: calc(100% - 130px);
    width: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .bar-box {
      height: 29%;
      // min-height: 200px;
      position: relative;
      width: 100%;
      #berth-one {
        width: 100%;
        height: 100%;

        padding: 0 5px;

        //   border: 1px solid black;
      }
      .select-bar {
        width: 36.3%;
        position: absolute;
        height: 35px;
        right: 33px;
        z-index: 99;
        /deep/ .el-input,
        .el-input--suffix {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
        }
        /deep/ i {
          line-height: 35px;
        }
      }
    }

    .port-box {
      width: 100%;
      height: 71%;
      position: relative;
      #berth-two {
        width: 100%;
        height: 50%;
        // min-height: 200px;
        padding: 0 5px;
        //   border: 1px solid black;
      }
      #berth-three {
        width: 100%;
        height: 50%;
        // min-height: 200px;
        padding: 0 5px;
        //   border: 1px solid black;
      }
      .threeselect {
        position: absolute;
        top: 0;
        right: 8%;
        width: 45%;
        display: flex;
        > div {
          width: 50%;
          margin-right: 5px;
        }
      }
    }
    .goosroad {
      width: 100%;
      height: 71%;
      > div {
        width: 100%;
        height: 100%;
        padding: 0 5px;
      }
    }
  }
}

.middle {
  width: 57%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  .gis-container {
    width: 100%;
    height: 65%;
    background: #fff;
    padding: 5px;
    position: absolute;
    overflow:hidden;
    #echartsMap {
      height: 100%;
    }
    .gis-top {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .gis-bottom {
      position: absolute;
      bottom: 20px;
      left: 20px;
      display: flex;
      background: #fff;
      border: solid 1px #c5c8d0;
      > p {
        width: 140px;
        height: 38px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .active {
        background-color: #0090ff;
        color: #fff;
      }
    }
  }
  .middle-bottom {
    position: absolute;
    padding: 5px;
    background: #fff;
    width: 100%;
    height: 34%;
    bottom: 0;
    .middle-search {
      position: absolute;

      height: 35px;
      right: 5%;
      z-index: 99999;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // border: 1px solid black;
      > div {
        height: 100%;

        button {
          height: 100%;
          line-height: 0.7;
        }
        /deep/ .el-input,
        .el-input--suffix {
          // height: 80%;
          width: 100%;
          display: flex;
          align-items: center;
        }
        /deep/ i {
          line-height: 35px;
        }
      }
      > div:first-child,
      .selectgoodstype {
        width: 116px;
        margin-right: 5px;
      }
    }
    #many-graph {
      width: 100%;
      height: 100%;
    }
  }
}
.right {
  width: 21%;
  height: 100%;
  background: #fff;
  padding: 0 5px;
  #berth-right-one {
    height: 62%;
  }
  #berth-right-two {
    height: 38%;
  }
}
.right-od {
  width: 32.5%;
  height: 100%;
  background: #fff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  display: flex;
  .od-serch {
    width: 100%;
    height: 38%;
    min-height: 312px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    > div {
      margin-bottom: 10px;
    }
    .od-date {
      width: 100%;
      height: 9%;
      min-height: 35px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-date-editor {
        width: 86.5%;
      }
      span {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .od-local {
      display: flex;
      height: 9%;
      min-height: 35px;
      justify-content: space-between;
      > div {
        display: flex;
        width: 30%;
        .el-select {
          width: 94px;
        }
        span {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      button {
        max-height: 35px;
      }
    }
    .od-table {
      height: 63%;
      min-height: 155px;
    }
    .pagination-container {
      display: flex;
      height: 9%;
      min-height: 35px;
      justify-content: flex-end;
    }
  }

  #od-echarts {
    width: 100%;
    height: 62%;
    min-height: 410px;
    // overflow-y: auto;
    // border: 1px solid black;
  }
}

.checkboxoverflow {
  height: 90%;
  overflow-y: auto;
}
.popoverbtn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
}

.od-width {
  width: 67%;
}
.berthlegend {
  width: 100px;
  height: 145px;
  // border:2px solid #fff;
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 5px 15px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  .berthlegenddiv {
    width: 100%;
    height: 100%;
    display: flex;
    // align-items:center;
    justify-content: space-between;
    .leftberthlegend {
      display: flex;
      height: 100%;
      flex-direction: column;
      color: #fff;
      justify-content: space-between;
    }
    .rightberthlegend{
      height:100%;
      img{
        height: 100%;
      }
    }
  }
}
</style>
