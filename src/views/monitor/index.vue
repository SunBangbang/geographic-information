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
          <div class="sonmenu" v-if="index == 1 && sonmenuShow">
            <div
              v-for="(item2, someMenuindex) in sonmueArry"
              :key="someMenuindex"
              :class="{ sonactive: someMenuindex === sonmueIndex }"
              @click.stop="addSomeClass(someMenuindex)"
            >
              {{ item2.name }}
            </div>
          </div>
          <div class="sonmenu1" v-if="index == 3 && sonmenuShow1">
            <div
              v-for="(item3, someMenuindex1) in sonmueArry1"
              :key="someMenuindex1"
              :class="{ sonactive: someMenuindex1 === sonmueIndex2 }"
              @click.stop="addSomeClass1(someMenuindex1)"
            >
              {{ item3.name }}
            </div>
          </div>
          <div class="sonmenu1" v-if="index == 2 && sonmenuShow2">
            <div
              v-for="(item3, someMenuindex2) in sonmueArry2"
              :key="someMenuindex2"
              :class="{ sonactive: someMenuindex2 === sonmueIndex3 }"
              @click.stop="addSomeClass2(someMenuindex2)"
            >
              {{ item3.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="view">
      <div class="top-view" v-if="titleshow">
        <div class="view-img">
          <img src="../../assets/img/monitor/left.png" alt="" srcset="" />
        </div>
        <div class="top-view-title">
          <span>港航发展总体形势</span>
        </div>
        <div class="view-img">
          <img src="../../assets/img/monitor/right.png" alt="" srcset="" />
        </div>
      </div>
      <div class="text-view" :class="{ titleshow: current != 0 }">
        <div class="left" v-show="odFlag">
          <div id="berth-left-one">
            <div class="title">内河货物运量指数</div>
            <div class="firstimg">
              <div class="leftimgtext">
                <div class="toptext">IWFVI</div>
                <div class="buttontext">内河货运量综合指数</div>
              </div>
              <div class="topzxt">
                <div class="topzxtimg"></div>
              </div>
              <div class="rightimgtext">
                <p>{{ freightName }}</p>
                <div class="rightzs">{{ exponents }}</div>
                <div class="righttime">{{ datatime }}</div>
                <div class="rightimgtext_bottom">
                  <p>同比:{{ comparedToLastYear }}</p>
                  <p>环比:{{ comparedToLastMonth }}</p>
                </div>
              </div>
              <!-- <div class="firstimg-number" v-model="yanhei">{{yanhei}}</div>
              <div class="firstimg-text">内河货物运量指数</div> -->
            </div>
          </div>
          <div id="berth-left-two">
            <div class="leftinfrastructureSelect">
              <el-select
                v-model="leftinfrastructureselect"
                placeholder="请选择"
                @change="leftselect"
              >
                <el-option
                  v-for="item in leftinfrastructureoption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div id="berth-left-two1"></div>
          </div>
          <div id="berth-left-three">
            <el-table
              :data="lefttableData"
              border
              :header-cell-style="{
                backgroundColor: '#bfcfdc',
                fontSize: '10px'
              }"
              :row-style="{ height: '30px' }"
              :header-row-style="{ height: '30px' }"
              v-fit-columns
            >
              <el-table-column
                prop="category"
                label="类型"
                align="center"
                class-name="leave-alone"
              >
              </el-table-column>
              <el-table-column
                prop="indexInformation"
                label="本期"
                align="center"
                class-name="leave-alone"
              >
              </el-table-column>
              <el-table-column
                prop="lastIndexInformation"
                label="上期"
                align="center"
                class-name="leave-alone"
              >
              </el-table-column>
              <el-table-column
                prop="rate"
                label="涨跌幅"
                align="center"
                class-name="leave-alone"
              ></el-table-column>
            </el-table>
          </div>
          <!-- <div id="berth-left-four">
            0.97765
          </div> -->
        </div>
        <div class="leftinfrastructure" v-show="lefttree">
          <div class="tree-search" v-if="current == 1 || current == 3">
            <div
              class="search-input"
              :class="{ 'search-input-width': current != 1 }"
            >
              <el-input
                placeholder="输入关键字查询"
                v-model="filterText"
                suffix-icon="el-icon-search"
              >
              </el-input>
            </div>
          </div>
          <div class="tree-content">
            <el-tree
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              :default-expand-all="false"
              :filter-node-method="filterNode"
              node-key="id"
              ref="tree"
              highlight-current
              @node-click="handleNodeClick"
            >
              <span
                class="custom-tree-node show-ellipsis"
                slot-scope="{ node, data }"
              >
                <span :title="data.name">{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </div>
        <div class="table-container" v-show="leftTable">
          <div class="table-search">
            <div
              class="search-input"
              :class="[
                { 'search-input-width': current == 3 },
                { 'search-input-width': current == 4 }
              ]"
            >
              <el-input
                placeholder="输入关键字查询"
                v-model="tablequery"
                suffix-icon="el-icon-search"
                @input="queryTableData()"
              >
              </el-input>
            </div>
          </div>
          <div class="anchorage-content">
            <div class="table-content">
              <el-table
                :data="tableData"
                style="width: 100%"
                height="100%"
                border
                highlight-current-row
                @current-change="handleCurrentChange"
                :header-cell-style="headerStyle"
                :row-class-name="tableRowClassName"
                :cell-style="tableCellStyle"
              >
                <el-table-column
                  prop="anchoragename"
                  label="名称"
                  min-width="100"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    <span v-if="anchorageleft">{{ row.anchoragename }}</span>
                    <span v-if="channelleft">{{ row.channelname }}</span>
                    <span v-if="workleft">{{ row.name }}</span>
                    <!-- <span v-else-if="current == 4 && sonmueIndex == 1">{{
                      row.watername
                    }}</span>
                    <span v-else-if="current == 4 && sonmueIndex == 2">{{
                      row.cabinname
                    }}</span> -->
                  </template>
                </el-table-column>
                <el-table-column
                  prop="anchoragelocation"
                  label="所属城市"
                  min-width="100"
                  align="center"
                  v-if="tablecity"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.anchorageno }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="等级"
                  min-width="100"
                  align="center"
                  v-if="tablegrade"
                >
                  <template slot-scope="{ row }">
                    <!-- <span v-if="situationOrPlan === '现状'">{{
                      row.presentlevel
                    }}</span> -->
                    <!-- <span v-else>{{ row.presentlevel }}</span> -->
                    <span>{{ row.presentlevel }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="pagination-container">
              <el-pagination
                background
                small
                :page-count="2"
                layout="prev, pager, next"
                :current-page.sync="pageno"
                :page-size="pagesize"
                :total="total"
                @current-change="handlePageNoChange"
              >
              </el-pagination>
            </div>
          </div>
        </div>
        <div
          class="gis-container"
          :class="[
            { 'od-width': current !== 0 },
            { 'od-widths': current == 2 && sonmueIndex3 !== 2 },
            { 'od-width3': sonmueIndex3 == 2 }
          ]"
        >
          <div id="container" v-show="current !== 0"></div>
          <div id="echartsMap" v-show="current === 0"></div>
          <!-- 港航发展总体形势地图下拉框 -->
          <!-- <div class="gisSelect" v-if="current == 0">
            <el-select v-model="developselect" placeholder="" @change="rightdevelopselect">
              <el-option
                v-for="item in developoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div> -->
          <div class="centerselect" v-show="false">
            <!-- 基础设施能力利用与分析地图下拉框 -->
            <div class="infrastructureSelect" v-if="portinfrastructure">
              <el-select v-model="infrastructureselect" placeholder="请选择">
                <el-option
                  v-for="item in infrastructureoption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <!-- 基础设施能力利用与分析地图输入框 -->
            <div
              class="infrastructureinput"
              v-if="current == 1 || current == 3"
            >
              <el-input
                placeholder="检查港口,港区,作业区,泊位的名称"
                prefix-icon="el-icon-search"
                v-model="infrastructureInput"
              >
              </el-input>
            </div>
          </div>
          <!-- 地图弹窗信息 -->
          <div id="popup" class="ol-popup" v-show="detailsDialogVisible">
            <div id="popup-content">
              <div class="popup-content-box">
                <div class="title">
                  {{ popTitle }}
                  <i
                    class="iconfont icon-cha"
                    id="popup-closer"
                    @click="closePopup"
                  ></i>
                </div>
                <div class="content">
                  <ul class="info-list">
                    <li
                      v-show="clickObj"
                      v-for="item in detailLabel"
                      :key="item.prop"
                    >
                      <span class="label">{{ item.label }}</span>
                      <span class="value">{{ clickObj[item.prop] }}</span>
                    </li>
                    <li v-show="duanmianShow">
                      <div id="duanmian"></div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <!-- 船舶运行态势分析下拉框 -->
          <div class="shipSelect" v-if="current == 2">
            <el-select v-model="watercraftSelect" placeholder="">
              <el-option
                v-for="item in watercraftoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <!-- 利用率颜色 -->
          <!-- <div class="ratioColor" v-if="current == 1 || current == 3">
            <img src="../../assets/img/monitor/color.png" alt="" srcset="" />
          </div> -->
          <div class="berthlegend" v-if="current == 1 || current == 3">
            <div class="berthlegenddiv">
              <div class="leftberthlegend">
                <div>1</div>
                <div>0</div>
              </div>
              <div class="rightberthlegend">
                <div>
                  <img
                    src="../../assets/img/monitor/color.png"
                    alt=""
                    srcset=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <!-- 船舶运行分析右边周月季年 -->
          <div class="right-text" v-if="current == 1">
            <div
              v-for="(item, textindex) in textoption"
              :key="textindex"
              :class="{ rightText: textindex == textcurrent }"
              @click="addClassText(textindex)"
            >
              {{ item.name }}
            </div>
          </div>
          <!-- 船舶运行分析右边下拉框 -->
          <div class="shipRightSelect" v-if="current == 2">
            <el-select v-model="shipRightselect" placeholder="请选择">
              <el-option
                v-for="item in shipRightSelectOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <!-- 右边echarts图标 -->
          <div
            class="right-echarts"
            :class="{ shipright: current == 2, righttext: current == 1 }"
          >
            <!-- <div id="berth-right-five" v-show="fiveecharts"></div>
            <div id="berth-right-four" v-show="fourecharts"></div> -->
            <div id="berth-right-one" v-show="current != 0"></div>
            <div id="berth-right-one1" v-show="current == 0"></div>
            <div id="berth-right-two">
              <div class="rightinfrastructureSelect" v-if="current == 0">
                <el-select
                  v-model="rightinfrastructureselect"
                  placeholder="请选择"
                  @change="rightselsct"
                >
                  <el-option
                    v-for="item in rightinfrastructureoption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div id="berth-right-two1"></div>
            </div>
            <div id="berth-right-three" v-show="threeecharts"></div>
            <div id="berth-right-four" v-show="fourecharts"></div>
            <div id="berth-right-five" v-show="fiveecharts"></div>
            <!-- 港航发展总体形势右边table表格 -->
            <div class="rightTable" v-if="rightTable">
              <el-table
                :data="righttableData"
                border
                :header-cell-style="{ backgroundColor: '#bfcfdc' }"
                v-fit-columns
              >
                <el-table-column
                  prop="category"
                  label="类型"
                  align="center"
                  class-name="leave-alone"
                >
                </el-table-column>
                <el-table-column
                  prop="indexInformation"
                  label="本期"
                  align="center"
                  class-name="leave-alone"
                >
                </el-table-column>
                <el-table-column
                  prop="lastIndexInformation"
                  label="上期"
                  align="center"
                  class-name="leave-alone"
                >
                </el-table-column>
                <el-table-column
                  prop="rate"
                  label="涨跌幅"
                  align="center"
                  class-name="leave-alone"
                ></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
  </div>
</template>
<script>
// import './config/rem'
import {
  detectionwork,
  analysistraffic,
  analysisthermodynamic,
  portoperationarea,
  situationchannel,
  situationlock,
  situationanchorage,
  analysistrack
} from '@/assets/js/localData'
import 'ol/ol.css'
import Map from 'ol/Map'
import GeoJSON from 'ol/format/GeoJSON'
import Overlay from 'ol/Overlay'
import WMTS from 'ol/source/WMTS'
import TileWMS from 'ol/source/TileWMS'
import TileImage from 'ol/source/TileImage'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import View from 'ol/View'
import { getWidth, getTopLeft } from 'ol/extent'
import { get as getProjection, Projection } from 'ol/proj'
import { Style, Fill, Icon, Stroke, Text, Circle } from 'ol/style'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import Polygon from 'ol/geom/Polygon'
import * as echarts from 'echarts'
import { common, query, monitor } from '@/api/index'
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom'
import { Point, LineString } from 'ol/geom'
import Feature from 'ol/Feature'
import { register } from 'ol/proj/proj4'
import Collection from 'ol/Collection'
import { Vector as SourceVec } from 'ol/source'
import { asArray } from 'ol/color'
import { toSize } from 'ol/size'
import OSM from 'ol/source/OSM'
import { getTransform } from 'ol/proj'
import { toLonLat } from 'ol/proj'
import { toStringHDMS } from 'ol/coordinate'
import { XYZ } from 'ol/source'
import { defaults as defaultControls } from 'ol/control'
import Draw from 'ol/interaction/Draw'
import { Circle as CircleStyle } from 'ol/style'
import { getArea, getLength } from 'ol/sphere'
import { unByKey } from 'ol/Observable'
import KML from 'ol/format/KML'
import Stamen from 'ol/source/Stamen'
import { Heatmap as HeatmapLayer } from 'ol/layer'
import echartsMapInit from './odMap/echartsMap'
import channel from '@/assets/json/channel.json' //航道JSON文件
import branchchannel from '@/assets/json/branchchannel.json' //支线航道JSON文件
import anchorage from '@/assets/json/anchorage.json' //锚地JSON文件
import shiplock from '@/assets/json/shiplock.json' //船闸JSON文件
import WorkZone from '@/assets/json/SituationalDetection/WorkZone.json' //作业区JSON文件
import cahnnelfracture from '@/assets/json/SituationalDetection/channelfracture.json' //航道断面JSON文件
import track from '@/assets/json/SituationalDetection/track.json' //轨迹JSON文件
import { log } from '../../api'
import Vue from 'vue'
import Plugin from 'v-fit-columns'
Vue.use(Plugin)
let map = null
let view = null
let vectorSource = null
let vectorLayer = null
let highVectorSource = null
let highVectorLayer = null
let feature = null
let polygonchannel = null //航道现状图层
let linebranchchannel = null //支线航道现状图层
let polygonanchorage = null //锚地图层
let pointshiplock = null //船闸图层
let polygonworkzone = null //作业区图层
let linechannelfracture = null //航道断面图层
let linetrack = null //轨迹图层
export default {
  name: 'monitor',
  data() {
    return {
      massss: [],
      tablecity: false, //所属城市table
      tablegrade: false, //d等级table
      tablequery: '',
      detailsDialogVisible: false, // 项目基本信息弹框显隐
      linetrack: null, //轨迹图层
      linechannelfracture: null, //航道断面图层
      polygonworkzone: null, //作业区图层
      polygonchannel: null, //航道现状图层
      polygonanchorage: null, //锚地图层
      pointshiplock: null, //船闸图层
      rightTable: true,
      fiveecharts: false, //右边第五个图标现隐
      fourecharts: false, //右边第四个图标现隐
      threeecharts: false,
      odFlag: true, //走边图标现隐
      total: 0, //分页
      pagesize: 18, //分页
      pageno: 1, //分页
      current: 0,
      tableid: '',
      sonmenuShow: false, //基础设施能力分析子菜单
      sonmenuShow1: false, //港航运行态势分析子菜单
      sonmenuShow2: false, //船舶运行分析分析子菜单
      //   左侧列表
      menuData: [
        {
          name: '港航发展总体形势',
          img: require('../../assets/img/monitor/develop.png')
        },
        {
          name: '基础设施能力利用分析',
          img: require('../../assets/img/monitor/infrastructure.png')
        },
        {
          name: '船舶运行分析',
          img: require('../../assets/img/monitor/operation.png')
        },
        {
          name: '港航运行态势分析',
          img: require('../../assets/img/monitor/analysis.png')
        }
      ],
      sonmueIndex: 0, //基础设施能力利用分析子菜单下标
      sonmueIndex2: 0, //港航运行态势分析子菜单
      sonmueIndex3: 0, //船舶运行分析子菜单
      textcurrent: 0,
      channelleft: false,
      anchorageleft: false,
      workleft: false,
      //   基础设施能力利用分析子菜单
      sonmueArry: [
        {
          name: '港口',
          id: 'son1'
        },
        {
          name: '航道',
          id: 'son2'
        },
        {
          name: '船闸',
          id: 'son3'
        },
        {
          name: '锚地',
          id: 'son4'
        }
      ],
      //   基础设施能力利用分析子菜单
      sonmueArry1: [
        {
          name: '港口',
          id: 'gon1'
        },
        {
          name: '航道',
          id: 'gon2'
        },
        {
          name: '船闸',
          id: 'gon3'
        }
      ],
      //   船舶运行分析子菜单
      sonmueArry2: [
        {
          name: '轨迹',
          id: 'lock1'
        },
        {
          name: '密度',
          id: 'lock2'
        },
        {
          name: '断面流量',
          id: 'lock3'
        }
      ],
      totalMileageCharts: null, // 左边第一个图标DOM
      // totalModelCharts: null, // 左边第二个图标DOM
      rightOneEcharts: null, // 右边第一个图标DOM
      rightOneEcharts1: null, // 右边第一个图标DOM
      rightFiveEcharts: null, // 右边第五个图标DOM
      rightTwoEcharts: null, //右边第二个图标DOM
      rightThreeEcharts: null, //右边第三个图标DOM
      rightFourEcharts: null, //右边第四个图标DOM
      duanmianCharts: null, //断面流量折线图DOM
      // 港航发展总体形势左边table数据
      lefttableData: [],
      tableData: [],
      // 港航发展总体形势右边table数据
      righttableData: [],
      // 周月季年
      textoption: [
        {
          name: '周',
          label: '1'
        },
        {
          name: '月',
          label: '2'
        },
        {
          name: '季',
          label: '3'
        },
        {
          name: '年',
          label: '4'
        }
      ],
      // 港航发展总体形式地图下拉框v-model数据
      developselect: '江海河联运指数',
      // 港航发展总体形式地图下拉框option
      developoptions: [
        {
          label: '江海河联运指数',
          value: '1'
        },
        {
          label: '江河联运指数',
          value: '2'
        },
        {
          label: '江海联运指数',
          value: '3'
        }
      ],
      // 船舶运行分析地图下拉框v-model数据
      watercraftSelect: '所有船类',
      // 船舶运行分析右侧下拉框option
      watercraftoptions: [
        {
          value: '拖轮',
          label: '拖轮'
        },
        {
          value: '其它浮运物',
          label: '其它浮运物'
        },
        {
          value: '推轮',
          label: '推轮'
        },
        {
          value: '驳船',
          label: '驳船'
        },
        {
          value: '客轮',
          label: '客轮'
        },
        {
          value: '货轮',
          label: '货轮'
        },
        {
          value: '挂机船',
          label: '挂机船'
        },
        {
          value: '其它机动船',
          label: '其它机动船'
        },
        {
          value: '其它非机动船',
          label: '其它非机动船'
        },
        {
          value: '排筏',
          label: '排筏'
        }
      ],
      infrastructureInput: '', // 基础设施能力利用分析地图输入框v-model
      infrastructureselect: '港口', //基础设施(港口)下拉框v-model
      leftinfrastructureselect: '内河货运综合指数', //港航发展左侧指数走势分析图
      rightinfrastructureselect: '江海河联运指数', //港航发展右侧指数走势分析图
      // 基础设施(港口)下拉框option
      infrastructureoption: [
        {
          value: '港口',
          label: '港口'
        },
        {
          value: '港区',
          label: '港区'
        },
        {
          value: '作业区',
          label: '作业区'
        },
        {
          value: '泊位',
          label: '泊位'
        }
      ],
      // 港航发展形势走边下拉框
      leftinfrastructureoption: [
        {
          label: '内河货运综合指数',
          value: '0'
        },
        {
          label: '集装箱运量指数',
          value: '1'
        },
        {
          label: '煤炭运量指数',
          value: '3'
        },
        {
          label: '钢铁运量指数',
          value: '4'
        },
        {
          label: '金属矿石运量指数',
          value: '5'
        },
        {
          label: '矿建材料运量',
          value: '6'
        },
        {
          label: '危险品运量指数',
          value: '7'
        }
      ],
      // 港航发展形势右边下拉框
      rightinfrastructureoption: [
        {
          label: '江海河联运指数',
          value: '0'
        },
        {
          label: '江海联运指数',
          value: '1'
        },
        {
          label: '江河联运指数',
          value: '2'
        },
        {
          label: '海河联运指数',
          value: '3'
        }
      ],
      shipRightselect: '内河',
      shipRightSelectOption: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '内河',
          label: '内河'
        },
        {
          value: '沿江',
          label: '沿江'
        },
        {
          value: '沿海',
          label: '沿海'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // berthArryship: [],
      clickid: 6, //点击港口图层的id
      hdclickid: 1, //点击航道图层的id
      czclickid: 13, //点击船闸图层的id
      portinfrastructure: false, //基础设施(港口)下拉框现隐
      odEchartMap: null,
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
      treeData: [],
      filterText: '', //树状图的模糊查询字段
      detailLabel: [], //弹窗数组
      clickObj: {},
      popTitle: '基本信息', // 弹框名称
      berthArryship: [],
      positionSourcecab: null, // 洗舱站数据源
      positionLayercab: null, // 洗舱站图层
      lefttree: false, //左侧树形图
      leftTable: false, //左侧表格
      exponents: '', //货物运量指数
      comparedToLastYear: '', //环比
      comparedToLastMonth: '', //同比
      date: this.$moment().format('yyyy-MM-DD hh:mm:ss'), //时间
      datatime: this.$moment().format('yyyy年MM月DD日'),
      leftselectecharts: 0, //左侧指数走势分析图下拉框值
      rightselectecharts: 1, //右侧指数走势分析图下拉框值
      alldatas: '', //树形图数据
      tableDataAll: [], //所有table数据
      datapointX: '',
      datapointY: '',
      categorynum: 0,
      freightName: '',
      duanmianShow: false, // 断面折线图
      duanmianId: 'HDDM_1',
      useratio: '', //利用率
      workjson: [], //作业区图层
      shiplockjson: [], //船闸图层
      channeljson: [], //航道图层
      allratio: [], //利用率数据
      isratiotable: true, //是利用率还是表格
      map: {},
      workratio: '', //作业区利用率
      shiplockratio: '', //船闸利用率
      channelratio: '', //航道利用率
      titleshow: true,
      datasCategory: 0,
      timerInterval: null
    }
  },
  components: {},
  mounted() {
    this.workJSON()
    // this.shiplockJSOn();
    this.echartsInit()
    this.windowResize()
    this.getWharfCount()
    this.getWharfType1()
    this.getWharfCount1()
    this.getOdErchaerts()
    this.getBaseCabinwashing() //热力图
    this.freight()
    this.timerInterval = setInterval(() => {
      this.freight()
      this.getWharfType1()
    }, 5000) //港航发展货物运量指数
    // setInterval(() => {
    //   this.freight()
    //   this.getWharfType1()
    // }, 5000) //港航发展货物运量指数
    this.categorytable() //港航发展左侧table
    this.throughcategorytable() //港航发展右侧table
  },
  beforeDestroy() {
    clearInterval(this.timerInterval)
    this.timerInterval = null //清空内存
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 根据返回数字长度转化单位
    formatByte(arg) {
      if (arg.toString().length >= 13) {
        // return arg/1000000000000+"万亿"
        const moneys = arg / 1000000000000
        const realVal = parseFloat(moneys).toFixed(0)
        return realVal + '万亿'
      } else if (arg.toString().length >= 9) {
        const moneys = arg / 100000000
        const realVal = parseFloat(moneys).toFixed(0)
        return realVal + '亿'
      } else if (arg.toString().length >= 4) {
        const moneys = arg / 10000
        const realVal = parseFloat(moneys).toFixed(2)
        return realVal + '万'
      } else {
        const realVal = parseFloat(arg)
        return realVal
      }
      // else if(arg.toString().length>=3){
      //   const moneys = arg/1000
      // 	const realVal = parseFloat(moneys).toFixed(1);
      // 	return realVal + "千"
      // }
    },
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
    // JSON文件加color属性
    workJSON() {
      if (this.isratiotable) {
        // 作业区(港口)
        this.getworkAll().then(() => {
          for (var i = 0; i < WorkZone.features.length; i++) {
            var test = WorkZone.features[i].properties
            for (var j = 0; j < this.tableDataAll.length; j++) {
              if (this.tableDataAll[j].id == test.SBF) {
                var k = this.tableDataAll[j]
                test.color = this.zyqFunctions(k.useRatioIndex)
                WorkZone.features[i].properties = test
              }
            }
          }
          this.workjson = WorkZone
        })
        // 船闸
        this.getShipLockTreeAll().then(() => {
          for (var i = 0; i < shiplock.features.length; i++) {
            var test = shiplock.features[i].properties
            for (var j = 0; j < this.tableDataAll.length; j++) {
              if (this.tableDataAll[j].objectid == test.SBF) {
                var k = this.tableDataAll[j]
                // console.log(k);
                var color
                if (k.useRatioIndex != undefined) {
                  color = k.useRatioIndex
                } else {
                  color = 0
                }
                test.presentcapacity = k.presentcapacity
                test.color = this.zyqFunctions(color)
                test.size = this.czsize(color)
                shiplock.features[i].properties = test
              }
            }
          }
          this.shiplockjson = shiplock
        })
        // 航道
        this.getAllChannelTable()
          .then(() => {
            for (var i = 0; i < channel.features.length; i++) {
              var test = channel.features[i].properties
              for (var j = 0; j < this.tableDataAll.length; j++) {
                if (this.tableDataAll[j].objectid == test.SBF) {
                  var k = this.tableDataAll[j]
                  test.color = this.zyqFunctions(k.useRatioIndex)
                  channel.features[i].properties = test
                }
              }
            }
            this.channeljson = channel
          })
          .then(() => {
            this.initMap()
          })
      } else {
        if (this.sonmueIndex == 0 && this.current == 1) {
          this.portrightone().then(() => {
            this.map.removeLayer(this.workratio)
            for (var i = 0; i < WorkZone.features.length; i++) {
              var test = WorkZone.features[i].properties
              for (var j in this.allratio) {
                if (Object.values(this.allratio)[1] == test.SBF) {
                  var k = Object.values(this.allratio)[3]
                  test.color = this.zyqFunctions(k)
                  WorkZone.features[i].properties = test
                }
              }
            }
            this.workjson = WorkZone
            let ZYQFunction = function (feature) {
              let dn = feature.get('color')
              return new Style({
                fill: new Fill({
                  color: dn
                })
              })
            }
            this.workratio = new VectorLayer({
              source: new VectorSource({
                features: new GeoJSON().readFeatures(this.workjson)
              }),
              style: ZYQFunction,
              visible: true
            })
            this.map.addLayer(this.workratio)
          })
        } else if (this.sonmueIndex == 2 && this.current == 1) {
          // this.map.removeLayer(this.shiplockratio)
          this.lockrightthree().then(() => {
            this.map.removeLayer(this.shiplockratio)
            for (var i = 0; i < shiplock.features.length; i++) {
              var test = shiplock.features[i].properties
              for (var j in this.allratio) {
                if (Object.values(this.allratio)[1] == test.SBF) {
                  var k = Object.values(this.allratio)[3]
                  test.color = this.zyqFunctions(k)
                  shiplock.features[i].properties = test
                }
              }
            }
            this.shiplockjson = shiplock
            let ZYQFunction = function (feature) {
              let dn = feature.get('color')
              return new Style({
                image: new CircleStyle({
                  radius: 7,
                  fill: new Fill({
                    color: dn
                  })
                })
              })
            }
            this.shiplockratio = new VectorLayer({
              source: new VectorSource({
                features: new GeoJSON().readFeatures(this.shiplockjson)
              }),
              style: ZYQFunction,
              visible: true
            })
            this.map.addLayer(this.shiplockratio)
          })
        } else if (this.sonmueIndex == 1 && this.current == 1) {
          // this.map.removeLayer(this.channelratio)
          this.channelrightthree().then(() => {
            this.map.removeLayer(this.channelratio)
            for (var i = 0; i < channel.features.length; i++) {
              var test = channel.features[i].properties
              for (var j in this.allratio) {
                if (Object.values(this.allratio)[1] == test.SBF) {
                  var k = Object.values(this.allratio)[0]
                  test.color = this.zyqFunctions(k)
                  channel.features[i].properties = test
                }
              }
            }
            this.channeljson = channel
            let ZYQFunction = function (feature) {
              let dn = feature.get('color')
              return new Style({
                fill: new Fill({
                  color: dn
                }),
                stroke: new Stroke({
                  color: dn,
                  width: 2
                })
              })
            }
            this.channelratio = new VectorLayer({
              source: new VectorSource({
                features: new GeoJSON().readFeatures(this.channeljson)
              }),
              style: ZYQFunction,
              visible: true
            })
            this.map.addLayer(this.channelratio)
          })
        }
      }
    },
    // JSON文件利用率颜色判断
    zyqFunctions(feature) {
      if (feature >= 0 && feature <= 0.1) {
        var Color = 'rgb(116,173,69)'
        return Color
      } else if (feature > 0.1 && feature <= 0.2) {
        var Color = 'rgb(255,176,54)'
        return Color
      } else if (feature > 0.2 && feature <= 0.3) {
        var Color = 'rgb(184,183,34)'
        return Color
      } else if (feature > 0.3 && feature <= 0.4) {
        var Color = 'rgb(212,186,20)'
        return Color
      } else if (feature > 0.4 && feature <= 0.5) {
        var Color = 'rgb(237,190,9)'
        return Color
      } else if (feature > 0.5 && feature <= 0.6) {
        var Color = 'rgb(255,185,0)'
        return Color
      } else if (feature > 0.6 && feature <= 0.7) {
        var Color = 'rgb(255,148,0)'
        return Color
      } else if (feature > 0.7 && feature <= 0.8) {
        var Color = 'rgb(255,105,0)'
        return Color
      } else if (feature > 0.8 && feature <= 0.9) {
        var Color = 'rgb(255,56,0)'
        return Color
      } else if (feature > 0.9 && feature <= 1) {
        var Color = 'rgb(255,9,0)'
        return Color
      }
    },
    //船闸JSON利用率判断大小
    czsize(feature) {
      if (feature >= 0 && feature <= 0.1) {
        var size = 4
        return size
      } else if (feature > 0.1 && feature <= 0.2) {
        var size = 4
        return size
      } else if (feature > 0.2 && feature <= 0.3) {
        var size = 5
        return size
      } else if (feature > 0.3 && feature <= 0.4) {
        var size = 5
        return size
      } else if (feature > 0.4 && feature <= 0.5) {
        var size = 6
        return size
      } else if (feature > 0.5 && feature <= 0.6) {
        var size = 6
        return size
      } else if (feature > 0.6 && feature <= 0.7) {
        var size = 7
        return size
      } else if (feature > 0.7 && feature <= 0.8) {
        var size = 7
        return size
      } else if (feature > 0.8 && feature <= 0.9) {
        var size = 8
        return size
      } else if (feature > 0.9 && feature <= 1) {
        var size = 8
        return size
      }
    },

    // 表格时间转换
    dateFormat(row) {
      let date = row.time
      return this.$moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    // 关闭弹框
    closePopup() {
      console.log(111)
      this.detailsDialogVisible = false
    },
    // 2D地图
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
        zoom: 8
      })
      // 热力图
      this.positionSourcecab = new VectorSource()
      this.positionLayercab = new HeatmapLayer({
        source: this.positionSourcecab,
        visible: false,
        zIndex: 10,
        opacity: 1, //透明度，默认1
        gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'], //热图的颜色渐变
        radius: 2, //半径大小默认为8(像素为单位)
        extent: [100, 30, 104, 40] //渲染范围，可选值，默认渲染全部
      })
      this.map = new Map({
        layers: [
          tdLayer,
          identification,
          this.positionLayercab
          // this.lineLayershoreline,
          // this.polygonLayer,
          // this.positionLayershiplock,
        ],
        target: 'container',
        view
      })
      // 禁用地图双击放大
      const dblClickInteraction = this.map
        .getInteractions()
        .getArray()
        .find((interaction) => {
          return interaction instanceof DoubleClickZoom
        })
      this.map.removeInteraction(dblClickInteraction)
      // 地图点击事件
      const container = document.getElementById('popup')
      const content = document.getElementById('popup-content')
      const closer = document.getElementById('popup-closer')
      this.overlay = new Overlay({
        element: container,
        autoPan: {
          animation: {
            duration: 250
          }
        }
      })
      let that = this
      this.map.on('singleclick', (evt) => {
        this.detailsDialogVisible = true
        console.log(evt)
        const coordinate = evt.coordinate
        console.log(coordinate)
        var pixel = that.map.getEventPixel(evt.originalEvent)
        var feature = that.map.forEachFeatureAtPixel(pixel, function (feature) {
          console.log(feature)
          if (feature.values_.hasOwnProperty('SBF')) {
            that.clickid = feature.values_.SBF.split('_')[1]
            that.hdclickid = feature.values_.SBF.split('_')[1] //航道ID
            that.czclickid = feature.values_.SBF.split('_')[1] //船闸ID
            // console.log(that.current)
            if (feature.values_.SBF.split('_')[0] == 'TSZYQ') {
              if (that.current == 1) {
                // 港口
                // consoel.log(111)
                that.portrightone()
                that.portrighttwo()
                that.portrightthree()
                that.portrightfour()
                that.portrightfive()
              } else if (that.current == 3) {
                // cons.log(111)
                that.operationportone()
                that.operationporttwo()
                that.operationportthree()
                that.operationportfour()
              }
            } else if (feature.values_.SBF.split('_')[0] == 'GXHD') {
              // 航道
              that.channelrightone()
              that.channelrighttwo()
              that.channelrightthree()
            } else if (feature.values_.SBF.split('_')[0] == 'CZ') {
              // 船闸
              that.lockrightone()
              that.lockrighttwo()
              that.lockrightthree()
              console.log(feature)
            } else if (feature.values_.SBF.split('_')[0] == 'MD') {
              // // 锚地
              // that.lockrightone();
              // that.lockrighttwo();
              // that.lockrightthree();
              // console.log(feature)
            } else if (feature.values_.SBF.split('_')[0] == 'HDDM') {
              // 航道断面
              that.duanmianId = feature.values_.SBF
              that.duanmianEcharts()
            }
          }
          return feature
        })
        if (feature) {
          // 点击点位出弹窗
          // console.log(1111)
          this.tableDataAll.forEach((r) => {
            console.log(r)
            console.log(feature.values_.SBF, r.id)
            // console.log();
            if (
              feature.values_.SBF == r.objectid ||
              feature.values_.SBF == r.id ||
              feature.values_.SBF == r.sectionId
            ) {
              console.log(111)
              view.setZoom(12)
              this.detailsDialogVisible = true
              this.clickObj = r
              this.overlay.setPosition(coordinate)
              this.map.addOverlay(this.overlay)
              view.setCenter(coordinate)
            }
          })
        } else {
          this.detailsDialogVisible = false
        }
      })
      // 轨迹图层
      ;(linetrack = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(track)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgb(208,61,69)',
            width: 1
          })
        }),
        visible: false
      })),
        this.map.addLayer(linetrack)
      // 支线航道现状图层
      ;(linebranchchannel = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(branchchannel)
        }),
        // style: styleFunctionBranch,
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(2,114,47,0.2)',
            width: 5
          })
        }),
        visible: false,
        zIndex: 10
      })),
        this.map.addLayer(linebranchchannel)
      // 航道断面图层
      ;(linechannelfracture = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(cahnnelfracture)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'red',
            width: 3
          })
        }),
        visible: false
      })),
        this.map.addLayer(linechannelfracture)

      // 作业区图层
      let ZYQFunction = function (feature) {
        let dn = feature.get('color')
        return new Style({
          fill: new Fill({
            color: dn
          })
        })
      }
      polygonworkzone = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(this.workjson)
        }),
        style: ZYQFunction,
        visible: false
      })
      this.map.addLayer(polygonworkzone)
      let styleFunction = function (feature) {
        let dn = feature.get('color')
        return new Style({
          fill: new Fill({
            color: dn
          }),
          stroke: new Stroke({
            color: dn,
            width: 2
          })
        })
      }
      // 航道现状图层
      ;(polygonchannel = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(this.channeljson)
        }),
        style: styleFunction,
        visible: false
      })),
        this.map.addLayer(polygonchannel)
      // 船闸图层
      let shiplockFunction = function (feature) {
        let dn = feature.get('color')
        let size = feature.get('size')
        let presentcapacity = feature.get('presentcapacity')
        let name = feature.get('name')
        console.log(name, presentcapacity)
        return new Style({
          image: new CircleStyle({
            radius: size,
            fill: new Fill({
              color: dn
            })
          }),
          text: new Text({
            text: `名称:${name}
  货运量:${presentcapacity}`,
            font: 'bold 12px Times New Roman',
            offsetX: 0,
            offsetY: 23,
            textAlign: 'center'
            // fill: new Fill({
            //   color: 'white'
            // }),
          })
        })
      }
      ;(pointshiplock = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(this.shiplockjson)
        }),
        // style: new Style({
        //   image: new Icon({
        //     scale: 1,
        //     src:
        //       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxFJREFUeNqUVF1Ik2EUfr7PbZriunCzZv7RSmsLTNML034MioxMIxXMbvsDDerCKIIgIiJv9cbLIIK00tQCocJ+vNFUTOlHhc2/LbZQDP/m3Drn9fvmnEzqwLP37H3Peb5zznveI138chyh0pDVoaOlREEuIYHgIUwQ+ggvCS2Xek94yHadrxRKSAZnaXlE2IXNZYRwk/AieFMTRBRBywNCDf93LNrx0f0GQ7M9cC05hI0x0gSrPhuHDIUwRaXwB58rH79NWFlHqJIt+5bwbLKByNrh8/vWheRYHBN452rGEUMRyhIvQyNpapRjjhayEl0pk3n9XtSN3kWnq3UDWbDw2XtXC9neAfsoWZWKGvr9fr6AUULi0/F6Yfg/UmA8g4qkKlYnCTs5wjImm6Kadbpb4Rz+ja4n/RjusmPhzxImhn7B61kJS9jpbgP7kuwglMtKa+ATXQCn8rXjJ+ZmFmDrm8Knx70Y/myHRhexafrsq0gJE+awxrfJoovWrvaTLK06+Pxw2aaFvjTvwYp3Y20HZ7tVNZtveTtramt45pcDhH4i86340N/+HXpjjCDLrdi/gdCt+JKYZOUFkPjFr6XAjOitUfApkcgRohEw65rDItVUkjamHSFpAzpbC3oDNa2orCUeByszkZxhEmQcoSocYV/bN7jt03D8cAX243TxgVbllAcIafv0OXAujq+mS1Gk56ciNTMBYwNO2Hon19KzzwiI/NKNYt2rz1KPezjCZtby4k5CluR1qUTG6LA7N5nqloEUilgbtfaw1FKwT35cobrdHNLYddTYr8K2CNdw8O0IZSAhLS8FsYYYHDUW4XxStdrYZplHECk3eKcs8Qr2xGaGJYyKjUR2iRUHii2CzEKplideVY+vc2eJuIm0kZZaeuioNt+jh38aEqSwxHxWYCxGlfk+DwfeqiU0hk6bW4QtWjmyqjL5Go7FF+OD+zU1fDf1qFM4xum2iQs4bDjF40v1q1d8ww7Yc7Q8/McBy0RNwZtyqBWlz0PTSrigDFAbYVmBTdnjMyvZNoX6/xVgAM2qJcWwrvYlAAAAAElFTkSuQmCC",
        //   }),
        // }),
        style: shiplockFunction,
        visible: false
      })),
        this.map.addLayer(pointshiplock)
      // 锚地图层
      ;(polygonanchorage = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(anchorage)
        }),
        style: new Style({
          fill: new Fill({
            color: 'rgba(255,0,0,0.8)'
          })
        }),
        visible: false
      })),
        this.map.addLayer(polygonanchorage)
    },
    // 热力图点位
    async getBaseCabinwashing() {
      const result = await monitor.getBaseCabinwashing()
      console.log(result)
      if (result.code === 200) {
        let data = result.data
        data.forEach((r) => {
          // 点位函数
          // console.log(r)
          this.createBaseCabinwashing(r, 'cabinWashingStation')
        })
      }
    },
    // 创建openlayers(热力图)
    createBaseCabinwashing(params, type) {
      if (params.length === 0) {
        return
      }
      // console.log(params)
      let pointX = params.longitude
      let pointY = params.latitude
      // console.log(pointX,pointY)
      var feature = new Feature({
        info: params,
        id: type + '_' + params.objectid,
        type: 'PointStyle',
        geometry: new Point([Number(pointX), Number(pointY)])
      })
      this.positionLayercab.getSource().addFeature(feature)
      // this.berthArryship.push({
      //   type,
      //   feature
      // })
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
    //模糊查询
    queryTableData(val) {
      console.log(this.current, this.sonmueIndex3)
      // console.log(this.current,this.sonmueIndex,this.sonmueIndex2);
      if (
        (this.sonmueIndex === 1 && this.current == 1) ||
        (this.sonmueIndex2 == 1 && this.current == 3)
      ) {
        this.getChannelTable()
      } else if (
        (this.sonmueIndex === 0 && this.current == 1) ||
        (this.sonmueIndex == 0 && this.current == 3)
      ) {
        console.log(1111)
        // this.getwork();
        // this.getChannelTable()
      } else if (this.current == 2 && this.sonmueIndex3 == 2) {
        console.log(1111)
        this.getLineChannelFracture()
      } else {
        this.getAllAnchorage()
      }
      // else if(this.current == 3 && this.sonmueIndex2 === 1){
      //   this.getChannelTable()
      // }
    },
    // 航道翻页
    handlePageNoChange(count) {
      this.pageno = count
      if (
        (this.sonmueIndex === 1 && this.current == 1) ||
        (this.sonmueIndex2 == 1 && this.current == 3)
      ) {
        this.getChannelTable()
      } else if (this.sonmueIndex === 0) {
        // this.getwork();
      } else {
        this.getAllAnchorage()
      }
    },
    //表格样式
    headerStyle({ row, column, rowIndex, columnIndex }) {
      return 'background-color: #4189c2!important;color:white;font-weight:400;border-color: #2a5e87;'
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    },
    tableCellStyle() {
      return 'border-color: #2a5e87;'
    },
    // 点击左侧菜单
    addClass(index) {
      // console.log(this);
      this.portinfrastructure = false
      this.detailsDialogVisible = false
      this.odFlag = true
      this.current = index
      this.channelleft = false
      this.anchorageleft = false
      this.workleft = false
      this.tablecity = false
      this.tablegrade = false
      this.threeecharts = false
      this.fourecharts = false
      this.fiveecharts = false
      this.sonmenuShow = false //基础设施能力利用分析子菜单
      this.sonmenuShow1 = false //港航运行态势分析子菜单
      this.sonmenuShow2 = false //船舶运行分析分析子菜单
      this.rightTable = true
      this.total = 0 //分页
      this.pagesize = 18 //分页
      this.pageno = 1 //分页
      this.sonmueIndex = 0
      this.sonmueIndex2 = 0
      this.sonmueIndex3 = 0
      this.filterText = ''
      this.tablequery = ''
      this.treeData = []
      this.tableData = []
      this.tableid = ''
      this.datapointX = ''
      this.datapointY = ''
      this.titleshow = false
      setTimeout(() => {
        this.echartsResize()
      }, 500)
      this.$nextTick(() => {
        this.echartsClear()
        this.echartsInit()
      })
      setTimeout(() => {
        this.map.updateSize()
      }, 1000)
      this.clickid = 6
      this.hdclickid = 1
      this.czclickid = 13
      linetrack.setVisible(false) //轨迹图层
      linechannelfracture.setVisible(false) //h航道断面图层
      this.positionLayercab.setVisible(false) //热力图
      polygonworkzone.setVisible(false) //作业区图层
      polygonchannel.setVisible(false) //航道现状图层
      polygonanchorage.setVisible(false) //锚地图层
      pointshiplock.setVisible(false) //船闸图层
      linebranchchannel.setVisible(false) //航道支线图层
      this.reset()
      this.lefttree = false //左侧树形图
      this.leftTable = false //左侧表格
      this.duanmianShow = false //断面折线图
      this.isratiotable = true
      if (index === 0) {
        this.titleshow = true
        this.lefttree = false
        this.threeecharts = false
        this.fourecharts = false
        this.fiveecharts = false
        this.odFlag = true
        this.$nextTick(() => {
          // this.getWharfType();
          this.getWharfCount()
          this.getWharfType1()
          this.getWharfCount1()
          this.echartsResize()
        })
        this.getOdErchaerts()
        this.categorytable() //港航发展左侧table
        this.throughcategorytable() //港航发展右侧table
      } else if (index === 1) {
        this.workleft = true
        this.anchorageleft = true
        this.anchoragename = true
        this.getwork()
        this.getworkAll()
        this.tablecity = false
        this.tablegrade = false
        this.lefttree = true
        ;(this.detailLabel = detectionwork),
          // this.treeData = [],
          this.echartsClear()
        this.portinfrastructure = true
        this.odFlag = false
        this.rightTable = false
        this.sonmenuShow = true
        this.threeecharts = true
        this.fourecharts = true
        this.fiveecharts = true
        this.$nextTick(() => {
          this.echartsInit(true)
          this.portrightone()
          this.portrighttwo()
          this.portrightthree()
          this.portrightfour()
          this.portrightfive()
          this.echartsResize()
        })
        polygonworkzone.setVisible(true) //作业区图层
        polygonchannel.setVisible(false)
        // this.shiplockratio.setVisible(false)
        // this.channelratio.setVisible(false)
        this.map.addLayer(polygonworkzone)
        this.map.removeLayer(this.workratio)
        this.map.removeLayer(pointshiplock)
        this.map.removeLayer(this.shiplockratio)
        this.map.removeLayer(polygonchannel)
        this.map.removeLayer(this.channelratio)
        clearInterval(this.timerInterval)
        this.timerInterval = null //清空内存
      } else if (index === 2) {
        this.anchorageleft = false
        this.channelleft = false
        this.workleft = true
        ;(this.detailLabel = analysistrack),
          // this.anchorageleft = true;
          // this.anchoragename = true;
          (this.leftTable = false)
        this.lefttree = false
        this.sonmenuShow2 = true
        this.rightTable = false
        this.fourecharts = false
        this.fiveecharts = false
        this.threeecharts = true
        this.odFlag = false
        this.$nextTick(() => {
          this.echartsInit(true)
          this.echartsResize()
          this.shiprightone()
          this.shiprighttwo()
          this.shiprightthree()
        })
        linetrack.setVisible(true) //轨迹图层
        linechannelfracture.setVisible(false) //h航道断面图层
        this.positionLayercab.setVisible(false) //热力图
        this.map.removeLayer(polygonworkzone)
        this.map.removeLayer(this.workratio)
        this.map.removeLayer(pointshiplock)
        this.map.removeLayer(this.shiplockratio)
        this.map.removeLayer(polygonchannel)
        this.map.removeLayer(this.channelratio)
      } else if (index === 3) {
        this.getwork()
        this.getworkAll()
        this.workleft = true
        this.anchorageleft = true
        this.lefttree = true
        this.leftTable = false
        ;(this.detailLabel = detectionwork),
          // this.treeData = [],
          (this.rightTable = false)
        this.odFlag = false
        this.sonmenuShow1 = true
        this.fourecharts = true
        this.fiveecharts = false
        this.threeecharts = true
        this.$nextTick(() => {
          this.echartsInit(true)
          this.echartsResize()
          this.operationportone()
          this.operationporttwo()
          this.operationportthree()
          this.operationportfour()
        })
        polygonworkzone.setVisible(true) //作业区图层
        this.map.addLayer(polygonworkzone)
        this.map.removeLayer(this.workratio)
        this.map.removeLayer(pointshiplock)
        this.map.removeLayer(this.shiplockratio)
        this.map.removeLayer(polygonchannel)
        this.map.removeLayer(this.channelratio)
      }
    },
    // 点击tree
    handleNodeClick(val) {
      console.log(val)
      console.log(this.sonmueIndex2)
      console.log(this.sonmueIndex)
      console.log(this.current)
      this.textcurrent = 0
      this.tableid = val.id
      if (this.current == 1 && this.sonmueIndex === 1) {
        this.tableid = val.objectid
      } else if (this.current == 3 && this.sonmueIndex2 === 1) {
        this.tableid = val.objectid
      }
      if (this.tableid) {
        if (
          (this.sonmueIndex === 2 && this.current == 1) ||
          (this.current == 3 && this.sonmueIndex2 == 2)
        ) {
          console.log(111)
          pointshiplock
            .getSource()
            .getFeatures()
            .forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
              }
            })
        } else if (this.sonmueIndex === 3 && this.current == 1) {
          console.log(111)
          polygonanchorage
            .getSource()
            .getFeatures()
            .forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
              }
            })
        } else if (
          this.sonmueIndex === 0 &&
          this.current == 3 &&
          this.sonmueIndex2 == 0
        ) {
          console.log(111)
          polygonworkzone
            .getSource()
            .getFeatures()
            .forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
              }
            })
          // polygonchannel
          //   .getSource()
          //   .getFeatures()
          //   .forEach((item) => {
          //     if (this.tableid == item.values_.SBF) {
          //       this.datapointX = item.values_.geometry.flatCoordinates[0];
          //       this.datapointY = item.values_.geometry.flatCoordinates[1];
          //     }
          //   });
        } else if (this.sonmueIndex === 0 && this.current == 1) {
          polygonworkzone
            .getSource()
            .getFeatures()
            .forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
              }
            })
        } else if (this.sonmueIndex === 1 && this.current == 1) {
          polygonchannel
            .getSource()
            .getFeatures()
            .forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
              }
            })
        } else if (
          this.current == 3 &&
          this.sonmueIndex2 == 1 &&
          this.sonmueIndex == 0
        ) {
          console.log(111)
          polygonchannel
            .getSource()
            .getFeatures()
            .forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
              }
            })
        }
        this.tableDataAll.forEach((r) => {
          if (r.objectid == this.tableid || r.id == this.tableid) {
            view.setZoom(12)
            this.detailsDialogVisible = true
            this.clickObj = r
            this.overlay.setPosition([this.datapointX, this.datapointY])
            this.map.addOverlay(this.overlay)
            view.setCenter([this.datapointX, this.datapointY])
          }
        })
        if (this.current == 1 && this.sonmueIndex == 2) {
          this.czclickid = this.tableid.split('_')[1]
          this.lockrightone()
          this.lockrighttwo()
          this.lockrightthree()
        } else if (this.current == 3 && this.sonmueIndex2 == 2) {
          this.czclickid = this.tableid.split('_')[1]
          this.operationlockone()
          this.operationlocktwo()
        } else if (this.current == 1 && this.sonmueIndex == 0) {
          this.clickid = this.tableid.split('_')[1]
          this.portrightone()
          this.portrighttwo()
          this.portrightthree()
          this.portrightfour()
          this.portrightfive()
        } else if (this.current == 1 && this.sonmueIndex == 1) {
          this.hdclickid = this.tableid.split('_')[1]
          this.channelrightone()
          this.channelrighttwo()
          this.channelrightthree()
        } else if (this.current == 3 && this.sonmueIndex2 == 1) {
          this.hdclickid = this.tableid.split('_')[1]
          this.operationchannelone()
          this.operationchanneltwo()
        } else if (this.current == 1 && this.sonmueIndex == 1) {
          this.hdclickid = this.tableid.split('_')[1]
          this.channelrightone()
          this.channelrighttwo()
          this.channelrightthree()
        } else if (this.current == 3 && this.sonmueIndex2 == 0) {
          this.clickid = this.tableid.split('_')[1]
          this.operationportone()
          this.operationporttwo()
        }
      }
    },
    // 飞到table列表具体点位
    handleCurrentChange(val) {
      console.log(val)
      console.log(this.sonmueIndex3, this.current)
      this.textcurrent = 0
      if (
        (this.sonmueIndex == 0 && this.current == 1) ||
        (this.sonmueIndex2 == 0 && this.current == 3)
      ) {
        this.tableid = val.id
        // this.clickid = val.id
      } else if (this.sonmueIndex3 == 2 && this.current == 2) {
        if (this.duanmianCharts) this.duanmianCharts.clear()
        this.tableid = val.sectionId
        this.duanmianId = val.sectionId

        // if (this.duanmianCharts) this.duanmianCharts.resize();
        setTimeout(() => {
          this.$nextTick(() => {
            this.duanmianEcharts()
          })
          if (this.duanmianCharts) this.duanmianCharts.resize()
        }, 1000)
      } else {
        this.tableid = val.objectid
        // this.clickid = val.objectid
      }
      console.log(this.tableDataAll, this.tableid)
      if (
        (this.sonmueIndex === 1 && this.current == 1) ||
        (this.sonmueIndex2 === 1 && this.current == 3)
      ) {
        polygonchannel
          .getSource()
          .getFeatures()
          .forEach((item) => {
            if (this.tableid == item.values_.SBF) {
              this.datapointX = item.values_.geometry.flatCoordinates[0]
              this.datapointY = item.values_.geometry.flatCoordinates[1]
              console.log(this.datapointX, this.datapointY)
            }
          })
      } else if (
        (this.sonmueIndex === 0 && this.current == 1) ||
        (this.sonmueIndex === 0 && this.current == 3)
      ) {
        polygonworkzone
          .getSource()
          .getFeatures()
          .forEach((item) => {
            console.log(item)
            if (this.tableid == item.values_.SBF) {
              console.log(item)
              this.datapointX = item.values_.geometry.flatCoordinates[0]
              this.datapointY = item.values_.geometry.flatCoordinates[1]
              console.log(this.datapointX, this.datapointY)
            }
          })
      } else if (this.sonmueIndex3 === 2 && this.current == 2) {
        linechannelfracture
          .getSource()
          .getFeatures()
          .forEach((item) => {
            // console.log(item);
            if (this.tableid == item.values_.SBF) {
              console.log(item)
              this.datapointX = item.values_.geometry.flatCoordinates[0]
              this.datapointY = item.values_.geometry.flatCoordinates[1]
              console.log(this.datapointX, this.datapointY)
            }
          })
      }
      console.log(this.tableDataAll)
      this.tableDataAll.forEach((r) => {
        // console.log(r.objectid,this.tableid);
        if (
          r.objectid == this.tableid ||
          r.id == this.tableid ||
          r.sectionId == this.tableid
        ) {
          console.log(this.clickid)
          view.setZoom(12)
          this.detailsDialogVisible = true
          this.clickObj = r
          this.overlay.setPosition([this.datapointX, this.datapointY])
          this.map.addOverlay(this.overlay)
          view.setCenter([this.datapointX, this.datapointY])
        }
      })

      if (this.current == 1 && this.sonmueIndex == 0) {
        this.clickid = this.tableid.split('_')[1]
        this.portrightone()
        this.portrighttwo()
        this.portrightthree()
        this.portrightfour()
        this.portrightfive()
      } else if (this.current == 1 && this.sonmueIndex == 1) {
        this.hdclickid = this.tableid.split('_')[1]
        this.channelrightone()
        this.channelrighttwo()
        this.channelrightthree()
      } else if (this.current == 3 && this.sonmueIndex2 == 0) {
        this.clickid = this.tableid.split('_')[1]
        this.operationportone()
        this.operationporttwo()
      } else if (this.current == 3 && this.sonmueIndex2 == 1) {
        this.hdclickid = this.tableid.split('_')[1]
        this.operationchannelone()
        this.operationchanneltwo()
      }
    },
    // 基础设施能力利用分析子菜单
    addSomeClass(index) {
      this.isratiotable = true
      this.treeData = []
      this.tableData = []
      this.channelleft = false
      this.anchorageleft = true
      this.workleft = false
      console.log(this.sonmueIndex, index)
      this.detailsDialogVisible = false
      this.clickid = 6
      this.hdclickid = 1
      this.czclickid = 13
      this.odFlag = false
      this.sonmenuShow = false
      this.threeecharts = true
      this.fourecharts = true
      this.fiveecharts = true
      this.sonmueIndex = index
      this.tablecity = false
      this.tablegrade = false
      console.log(this.sonmueIndex, index)
      this.$nextTick(() => {
        this.echartsClear()
        this.echartsInit(true)
      })
      setTimeout(() => {
        this.map.updateSize()
      }, 1000)
      this.tablequery = ''
      this.total = 0 //分页
      this.pagesize = 18 //分页
      this.pageno = 1 //分页
      this.textcurrent = 0
      this.portinfrastructure = false
      setTimeout(() => {
        this.echartsResize()
      }, 500)
      this.reset()
      this.leftTable = false
      this.lefttree = true
      this.duanmianShow = false //断面折线图
      polygonworkzone.setVisible(false) //作业区图层
      polygonchannel.setVisible(false) //航道图层
      polygonanchorage.setVisible(false) //锚地图层
      pointshiplock.setVisible(false) //船闸图层
      linebranchchannel.setVisible(false) //航道支线图层
      // this.workratio.setVisible(false)
      // this.shiplockjson.setVisible(false)
      // this.channelratio.setVisible(false)
      if (index == 0) {
        this.anchoragename = true
        // this.workleft = true;
        this.getwork()
        this.getworkAll()
        ;(this.detailLabel = detectionwork), (this.portinfrastructure = true)
        this.odFlag = false
        this.sonmenuShow = false
        this.fourecharts = true
        this.fiveecharts = true
        this.$nextTick(() => {
          this.portrightone()
          this.portrighttwo()
          this.portrightthree()
          this.portrightfour()
          this.portrightfive()
          setTimeout(() => {
            this.echartsResize()
          }, 500)
        })
        polygonworkzone.setVisible(true)
        this.map.addLayer(polygonworkzone)
        this.map.removeLayer(this.workratio)
        this.map.removeLayer(pointshiplock)
        this.map.removeLayer(this.shiplockratio)
        this.map.removeLayer(polygonchannel)
        this.map.removeLayer(this.channelratio)
      } else if (index === 1) {
        this.channelleft = true
        this.getChannelTable()
        this.getAllChannelTable()
        this.tablegrade = true
        ;(this.detailLabel = situationchannel), (this.fourecharts = false)
        this.fiveecharts = false
        // this.lefttree = false; //左侧树形图
        // this.leftTable=true//左侧表格
        this.$nextTick(() => {
          this.channelrightone()
          this.channelrighttwo()
          this.channelrightthree()
          setTimeout(() => {
            this.echartsResize()
          }, 500)
        })
        polygonchannel.setVisible(true) //航道图层
        linebranchchannel.setVisible(true)
        this.map.addLayer(polygonchannel)
        this.map.removeLayer(this.channelratio)
        this.map.removeLayer(polygonworkzone)
        this.map.removeLayer(this.workratio)
        this.map.removeLayer(pointshiplock)
        this.map.removeLayer(this.shiplockratio)
      } else if (index == 2) {
        this.getShipLockTree()
        this.getShipLockTreeAll()
        ;(this.detailLabel = situationlock), (this.fourecharts = false)
        this.fiveecharts = false
        this.leftTable = false
        this.lefttree = true
        this.$nextTick(() => {
          this.lockrightone()
          this.lockrighttwo()
          this.lockrightthree()
          setTimeout(() => {
            this.echartsResize()
          }, 500)
        })
        pointshiplock.setVisible(true) //船闸图层
        this.map.removeLayer(polygonworkzone)
        this.map.removeLayer(this.workratio)
        this.map.addLayer(pointshiplock)
        this.map.removeLayer(polygonchannel)
        this.map.removeLayer(this.channelratio)
        this.map.removeLayer(this.shiplockratio)
      } else if (index == 3) {
        this.leftTable = false
        this.lefttree = true
        this.anchorageleft = true
        this.getAllAnchorage()
        this.getAllAnchorageTable()
        ;(this.detailLabel = situationanchorage), (this.fourecharts = true)
        this.fiveecharts = true
        this.tablecity = true
        this.$nextTick(() => {
          this.anchoragerightone()
          this.anchoragerighttwo()
          this.anchoragerightthree()
          this.anchoragerightfour()
          this.anchoragerightfive()
          setTimeout(() => {
            this.echartsResize()
          }, 500)
        })
        polygonanchorage.setVisible(true) //锚地图层
        this.map.removeLayer(polygonworkzone)
        this.map.removeLayer(this.workratio)
        this.map.removeLayer(pointshiplock)
        this.map.removeLayer(this.shiplockratio)
        this.map.removeLayer(polygonchannel)
        this.map.removeLayer(this.channelratio)
      }
    },
    // 港航运行态势分析子菜单
    addSomeClass1(index) {
      this.anchorageleft = true
      this.clickid = 6
      this.workleft = false
      this.hdclickid = 1
      this.czclickid = 13
      this.treeData = []
      this.channelleft = false
      this.tableData = []
      this.sonmueIndex2 = index
      this.detailsDialogVisible = false
      this.total = 0 //分页
      this.pagesize = 18 //分页
      this.pageno = 1 //分页
      this.odFlag = false
      this.lefttree = true
      this.leftTable = false
      this.tablecity = false
      this.tablegrade = false
      this.sonmenuShow1 = false
      this.fourecharts = true
      this.fiveecharts = false
      this.tablequery = ''
      setTimeout(() => {
        this.echartsResize()
      }, 500)
      this.$nextTick(() => {
        this.echartsClear()
        this.echartsInit(true)
      })
      setTimeout(() => {
        this.map.updateSize()
      }, 1000)
      this.reset()
      this.duanmianShow = false //断面折线图
      polygonworkzone.setVisible(false) //作业区图层
      polygonchannel.setVisible(false) //航道图层
      pointshiplock.setVisible(false) //船闸图层
      if (index == 0) {
        this.getwork()
        this.getworkAll()
        this.workleft = true
        this.anchorageleft = false
        ;(this.detailLabel = detectionwork), (this.fourecharts = true)
        this.fiveecharts = false
        this.$nextTick(() => {
          this.operationportone()
          this.operationporttwo()
          this.operationportthree()
          this.operationportfour()
          setTimeout(() => {
            this.echartsResize()
          }, 500)
        })
        polygonworkzone.setVisible(true) //作业区图层
        this.map.addLayer(polygonworkzone)
        this.map.removeLayer(this.workratio)
        this.map.removeLayer(pointshiplock)
        this.map.removeLayer(this.shiplockratio)
        this.map.removeLayer(polygonchannel)
        this.map.removeLayer(this.channelratio)
      } else if (index == 1) {
        this.channelleft = true
        this.getChannelTable()
        this.getAllChannelTable()
        ;(this.detailLabel = situationchannel), (this.fourecharts = false)
        this.fiveecharts = false
        this.tablegrade = true
        this.$nextTick(() => {
          this.operationchannelone()
          this.operationchanneltwo()
          this.operationchannelthree()
          setTimeout(() => {
            this.echartsResize()
          }, 500)
        })
        polygonchannel.setVisible(true) //航道图层
        this.map.removeLayer(polygonworkzone)
        this.map.removeLayer(this.workratio)
        this.map.removeLayer(pointshiplock)
        this.map.removeLayer(this.shiplockratio)
        this.map.addLayer(polygonchannel)
        this.map.removeLayer(this.channelratio)
      } else {
        this.getShipLockTree()
        this.getShipLockTreeAll()
        // this.leftTable = false;
        // this.lefttree = true;
        ;(this.detailLabel = situationlock), (this.fourecharts = false)
        this.fiveecharts = false
        this.$nextTick(() => {
          this.operationlockone()
          this.operationlocktwo()
          this.operationlockthree()
          setTimeout(() => {
            this.echartsResize()
          }, 500)
        })
        pointshiplock.setVisible(true) //船闸图层
        this.map.removeLayer(polygonworkzone)
        this.map.removeLayer(this.workratio)
        this.map.addLayer(pointshiplock)
        this.map.removeLayer(this.shiplockratio)
        this.map.removeLayer(polygonchannel)
        this.map.removeLayer(this.channelratio)
      }
    },
    // 船舶运行分析子菜单
    addSomeClass2(index) {
      this.leftTable = false
      this.clickid = 6
      this.hdclickid = 1
      this.czclickid = 13
      this.sonmueIndex3 = index
      this.detailsDialogVisible = false
      this.total = 0 //分页
      this.pagesize = 18 //分页
      this.pageno = 1 //分页
      this.odFlag = false
      this.sonmenuShow2 = false
      this.duanmianShow = false //断面折线图
      // this.fourecharts = true;
      // this.fiveecharts = false;
      setTimeout(() => {
        this.echartsResize()
      }, 500)
      setTimeout(() => {
        this.map.updateSize()
      }, 1000)
      this.$nextTick(() => {
        this.echartsClear()
        this.echartsInit(true)
        this.shiprightone()
        this.shiprighttwo()
        this.shiprightthree()
      })
      this.fourecharts = false
      this.fiveecharts = false
      this.threeecharts = true
      this.odFlag = false
      // this.$nextTick(() => {
      //   this.echartsInit(true);
      //   this.echartsResize();
      //   this.shiprightone();
      //   this.shiprighttwo();
      //   this.shiprightthree();
      // });
      this.reset()
      linetrack.setVisible(false) //轨迹图层
      linechannelfracture.setVisible(false) //h航道断面图层
      this.positionLayercab.setVisible(false) //热力图
      if (index == 0) {
        ;(this.detailLabel = analysistrack), linetrack.setVisible(true) //轨迹图层
      } else if (index == 1) {
        ;(this.detailLabel = analysisthermodynamic),
          this.positionLayercab.setVisible(true) //热力图
      } else {
        this.duanmianShow = true
        this.getLineChannelFracture()
        if (this.duanmianCharts) this.duanmianCharts.clear()
        // setTimeout(() => {
        //   this.$nextTick(() => {
        //     this.duanmianEcharts();
        //   });
        // }, 5000);
        // setTimeout(()=>{
        //   if(this.duanmianCharts) this.duanmianCharts.resize()
        // },1000)
        // this.duanmianlinechart()
        this.leftTable = true
        this.workleft = true
        this.detailLabel = analysistraffic
        linechannelfracture.setVisible(true) //h航道断面图层
      }
    },
    // 树节点过滤
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 点击切换年月日
    addClassText(index) {
      this.textcurrent = index
      this.isratiotable = false
      this.workJSON()
      console.log(this.current)
      // 判断基础设施能力利用与分析下标
      if (this.sonmueIndex == 0) {
        this.portrightone()
        this.portrighttwo()
        this.portrightthree()
        this.portrightfour()
        this.portrightfive()
      } else if (this.sonmueIndex == 1) {
        this.channelrightone()
        this.channelrighttwo()
        this.channelrightthree()
      } else if (this.sonmueIndex == 2) {
        this.lockrightone()
        this.lockrighttwo()
        this.lockrightthree()
      }
    },

    // 地图初始化
    reset() {
      view.setCenter([119.489064142175, 32.9653877905019])
      view.setZoom(8)
    },
    //断面echarts
    async duanmianEcharts() {
      this.duanmianCharts = echarts.init(document.getElementById('duanmian'))
      let datas = {
        sectionId: this.duanmianId
      }
      let { code, data } = await monitor.getLineChannel(datas)
      if (code == 200) {
        let time = Object.keys(data.flows)
        let values = Object.values(data.flows)
        let duanmianOPtion = {
          dataZoom: [
            {
              id: 'dataZoomX',
              type: 'inside',
              show: false, //是否显示下方滚动条
              start: 0, //显示数据开始位置
              end: 30, //显示数据结束位置
              zoomLock: true
            }
          ],
          title: {
            text: '',
            textStyle: {
              color: '#000',
              fontSize: '16px'
            },
            top: '3%'
          },
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
            bottom: '4%',
            width: '92%',
            height: '68%',
            containLabel: true
          },
          legend: {
            top: '3%',
            data: []
            // itemGap: 30,
          },
          xAxis: [
            {
              data: time,
              nameTextStyle: {
                color: '#999'
              },
              axisLabel: {
                textStyle: {
                  color: '#aaaaaa',
                  fontSize: 12
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
              },
              axisLabel: {
                textStyle: {
                  color: '#888'
                }
              }
            }
          ],
          series: [
            {
              data: values,
              smooth: true,
              type: 'line',
              showSymbol: false,
              itemStyle: {
                color: 'rgba(0,145,255,1)'
              },
              areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(0,145,255,1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(0,145,255,0)'
                  }
                ])
              }
            }
          ]
        }
        this.duanmianCharts.setOption(duanmianOPtion)
      }
    },
    echartsInit(isShow) {
      // 左边第二个折线图
      this.totalMileageCharts = echarts.init(
        document.getElementById('berth-left-two1')
      )
      let xAxisData = []
      let seriesData = []
      let totalMileageOption = {
        title: {
          text: '',
          textStyle: {
            color: '#000',
            fontSize: this.fontSize(0.16)
          }
          // top: "3%",
        },
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
          bottom: '4%',
          width: '92%',
          height: '68%',
          containLabel: true
        },
        legend: {
          top: '3%',
          data: []
          // itemGap: 30,
        },
        xAxis: [
          {
            nameTextStyle: {
              color: '#999'
            },
            data: xAxisData,
            axisLabel: {
              textStyle: {
                color: '#aaaaaa',
                fontSize: 12
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
            },
            axisLabel: {
              textStyle: {
                color: '#888'
              }
            }
          }
        ],
        series: []
      }
      this.totalMileageCharts.setOption(totalMileageOption)
      // 联运指数
      this.rightOneEcharts1 = echarts.init(
        document.getElementById('berth-right-one1')
      )
      let xAxisData11 = []
      let seriesData11 = []
      let rightOneOPtion1 = {
        title: {
          text: '',
          textStyle: {
            color: '#000',
            fontSize: this.fontSize(0.16)
          },
          top: '3%'
        },
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
          bottom: '4%',
          width: '82%',
          height: '68%',
          containLabel: true
        },
        legend: {
          top: '3%',
          data: []
          // itemGap: 30,
        },
        xAxis: [
          {
            nameTextStyle: {
              color: '#999'
            },
            data: xAxisData11,
            axisLabel: {
              textStyle: {
                color: '#aaaaaa',
                fontSize: 12
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
            },
            axisLabel: {
              textStyle: {
                color: '#888'
              }
            }
          }
        ],
        series: []
      }
      this.rightOneEcharts1.setOption(rightOneOPtion1)
      // 右边第一个折线图
      this.rightOneEcharts = echarts.init(
        document.getElementById('berth-right-one')
      )
      let xAxisData1 = []
      let seriesData1 = []
      let rightOneOPtion = {
        title: {
          text: '',
          textStyle: {
            color: '#000',
            fontSize: this.fontSize(0.16)
          },
          top: '3%'
        },
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
          bottom: '4%',
          width: '82%',
          height: '68%',
          containLabel: true
        },
        legend: {
          top: '3%',
          data: []
          // itemGap: 30,
        },
        xAxis: [
          {
            nameTextStyle: {
              color: '#999'
            },
            data: xAxisData1,
            axisLabel: {
              textStyle: {
                color: '#aaaaaa',
                fontSize: 12
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
            },
            axisLabel: {
              textStyle: {
                color: '#888'
              }
            }
          }
        ],
        series: []
      }
      this.rightOneEcharts.setOption(rightOneOPtion)
      // 右边第二个折线图
      this.rightTwoEcharts = echarts.init(
        document.getElementById('berth-right-two1')
      )
      let xAxisDatatwo = []
      let seriesDatatwo = []
      let rightTwoOption = {
        title: {
          text: '',
          textStyle: {
            color: '#000',
            fontSize: this.fontSize(0.16)
          },
          top: '3%'
        },
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
          bottom: '4%',
          width: '92%',
          height: '68%',
          containLabel: true
        },
        legend: {
          top: '3%',
          data: []
          // itemGap: 30,
        },
        xAxis: [
          {
            nameTextStyle: {
              color: '#999'
            },
            data: xAxisDatatwo,
            axisLabel: {
              textStyle: {
                color: '#aaaaaa',
                fontSize: 12
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
            },
            axisLabel: {
              textStyle: {
                color: '#888'
              }
            }
          }
        ],
        series: []
      }
      this.rightTwoEcharts.setOption(rightTwoOption)
      // 右边第三个折线图
      this.rightThreeEcharts = echarts.init(
        document.getElementById('berth-right-three')
      )
      let xAxisDatathree = []
      let seriesDatathree = []
      let rightThreeOption = {
        title: {
          text: '',
          textStyle: {
            color: '#000',
            fontSize: this.fontSize(0.16)
          },
          top: '3%'
        },
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
          bottom: '4%',
          width: '92%',
          height: '68%',
          containLabel: true
        },
        legend: {
          top: '3%',
          data: []
          // itemGap: 30,
        },
        xAxis: [
          {
            nameTextStyle: {
              color: '#999'
            },
            data: xAxisDatathree,
            axisLabel: {
              textStyle: {
                color: '#aaaaaa',
                fontSize: 12
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
            },
            axisLabel: {
              textStyle: {
                color: '#888'
              }
            }
          }
        ],
        series: []
      }
      this.rightThreeEcharts.setOption(rightThreeOption)
      if (isShow) {
        // 右边第四个折线图
        this.rightFourEcharts = echarts.init(
          document.getElementById('berth-right-four')
        )
        let xAxisDatafour = []
        let seriesDatafour = []
        let rightFourOption = {
          title: {
            text: '',
            textStyle: {
              color: '#000',
              fontSize: this.fontSize(0.16)
            },
            top: '3%'
          },
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
            bottom: '4%',
            width: '92%',
            height: '68%',
            containLabel: true
          },
          legend: {
            top: '3%',
            data: []
            // itemGap: 30,
          },
          xAxis: [
            {
              nameTextStyle: {
                color: '#999'
              },
              data: xAxisDatafour,
              axisLabel: {
                textStyle: {
                  color: '#aaaaaa',
                  fontSize: 12
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
              },
              axisLabel: {
                textStyle: {
                  color: '#888'
                }
              }
            }
          ],
          series: []
        }
        this.rightFourEcharts.setOption(rightFourOption)
        // 右边第五个饼图
        this.rightFiveEcharts = echarts.init(
          document.getElementById('berth-right-five')
        )
        let xAxisDatafive = []
        let seriesDatafive = []
        let rightFiveOption = {
          title: {
            text: '',
            textStyle: {
              color: '#000',
              fontSize: this.fontSize(0.16)
            },
            top: '3%'
          },
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
            bottom: '4%',
            width: '92%',
            height: '68%',
            containLabel: true
          },
          legend: {
            top: '3%',
            data: []
            // itemGap: 30,
          },
          xAxis: [
            {
              nameTextStyle: {
                color: '#999'
              },
              data: xAxisDatafive,
              axisLabel: {
                textStyle: {
                  color: '#aaaaaa',
                  fontSize: 12
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
              },
              axisLabel: {
                textStyle: {
                  color: '#888'
                }
              }
            }
          ],
          series: []
        }
        this.rightFiveEcharts.setOption(rightFiveOption)
      }
    },
    //监听echarts窗口变化
    windowResize() {
      window.onresize = () => {
        this.echartsResize()
      }
    },
    // echarte自适应
    echartsResize() {
      if (this.totalMileageCharts) this.totalMileageCharts.resize()
      // if (this.totalModelCharts) this.totalModelCharts.resize();
      if (this.rightOneEcharts) this.rightOneEcharts.resize()
      if (this.rightOneEcharts1) this.rightOneEcharts.resize()
      if (this.rightFiveEcharts) this.rightFiveEcharts.resize()
      if (this.rightTwoEcharts) this.rightTwoEcharts.resize()
      if (this.rightThreeEcharts) this.rightThreeEcharts.resize()
      if (this.rightFourEcharts) this.rightFourEcharts.resize()
      if (this.odEchartMap) this.odEchartMap.resize()
      if (this.duanmianCharts) this.duanmianCharts.resize()
    },
    // 清除echarts实例
    echartsClear() {
      if (this.totalMileageCharts) this.totalMileageCharts.clear()
      // if (this.totalModelCharts) this.totalModelCharts.clear();
      if (this.rightOneEcharts) this.rightOneEcharts.clear()
      if (this.rightFiveEcharts) this.rightFiveEcharts.clear()
      if (this.rightTwoEcharts) this.rightTwoEcharts.clear()
      if (this.rightThreeEcharts) this.rightThreeEcharts.clear()
      if (this.rightFourEcharts) this.rightFourEcharts.clear()
      if (this.odEchartMap) this.odEchartMap.clear()
      if (this.duanmianCharts) this.duanmianCharts.clear()
    },
    // 港口作业区左侧tree
    async getwork() {
      let { code, data } = await monitor.getworkTable()
      if (code === 200) {
        this.treeData = data
      } else {
        this.treeData = []
      }
    },
    // 港口作业区左侧tree all
    async getworkAll() {
      let { code, data } = await monitor.getworkAll()
      if (code === 200) {
        this.tableDataAll = data
      } else {
        this.tableDataAll = []
      }
    },

    //断面流量表格
    async getLineChannelFracture() {
      let datas = {
        name: this.tablequery
      }
      let { code, data } = await monitor.getLineChannelFracture(datas)
      if (code === 200) {
        let datas = data
        // this.total = data.totalcount
        this.tableData = datas
        this.tableDataAll = datas
        console.log(this.tableData)
      } else {
        // this.total = 0
        // this.tableData = []
      }
    },
    //锚地表格
    async getAllAnchorage() {
      let { res, status } = await monitor.getAllAnchorage({
        pageno: this.pageno,
        pagesize: this.pagesize,
        name: this.tablequery
      })
      if (status === 200) {
        let data = res.data
        console.log(data.totalcount)
        this.total = data.totalcount
        this.treeData = data.results
      } else {
        this.total = 0
        this.treeData = []
      }
    },
    // 航道左侧table
    async getChannelTable() {
      let { res, status } = await monitor.getChannelTable()
      if (status === 200) {
        let data = res.data
        this.treeData = data
        // this.total = data.totalcount;
        // this.tableData = data.results;
        // data.results.forEach(r=>{
        //   console.log(r);
        //   this.alldatas = r
        //   console.log(this.alldatas);
        // })
      } else {
        this.total = data.totalcount
        this.treeData = []
      }
    },
    // 航道左侧 all table
    async getAllChannelTable() {
      let { res, status } = await monitor.getAllChannelTable()
      if (status === 200) {
        let data = res.data
        this.total = data.totalcount
        this.tableDataAll = data
      } else {
        this.total = data.totalcount
        this.tableDataAll = []
      }
    },
    // 锚地左侧 all table
    async getAllAnchorageTable() {
      let { res, status } = await monitor.getAllAnchorageTable()
      if (status === 200) {
        let data = res.data
        this.total = data.totalcount
        this.tableDataAll = data
        console.log(this.tableDataAll)
      } else {
        this.total = data.totalcount
        this.tableData = []
      }
    },
    //船闸树状图
    async getShipLockTree() {
      // console.log(infrastructure)
      let { res, status } = await monitor.getShipLockTree()
      if (status === 200) {
        this.treeData = res.data
        // this.tableDataAll = res.data
      } else {
        this.treeData = []
      }
    },
    //船闸树状图所有信息
    async getShipLockTreeAll() {
      // console.log(infrastructure)
      let { res, status } = await monitor.getShipLockTreeAll()
      if (status === 200) {
        console.log(res)
        this.tableDataAll = res.data
      } else {
        this.tableDataAll = []
      }
    },

    // 港航发展左侧table
    async categorytable() {
      console.log(this.date)
      let datas = {
        time: '2020-02-05 00:00:00'
      }
      let times = this.date.substring(0, 11)
      let timess = times + '00:00:00'
      // datas.time = timess
      let { data, code } = await monitor.categorytable(datas)
      if (code === 200) {
        this.lefttableData = data
        this.lefttableData.forEach((r) => {
          console.log(r)
          if (r.category == 0) {
            r.category = '综合指数'
          } else if (r.category == 1) {
            r.category = '集装箱'
          } else if (r.category == 3) {
            r.category = '煤炭'
          } else if (r.category == 4) {
            r.category = '钢铁'
          } else if (r.category == 5) {
            r.category = '金属矿石'
          } else if (r.category == 6) {
            r.category = '矿建材料'
          } else if (r.category == 7) {
            r.category = '危险品'
          }
          r.indexInformation = r.indexInformation.toFixed(2)
          r.lastIndexInformation = r.lastIndexInformation.toFixed(2)
          r.rate = r.rate.substring(0, r.rate.indexOf('.') + 3) + '%'
        })
        // console.log(this.lefttableData);
      } else {
        this.lefttableData = []
      }
    },
    // 港航发展右侧table
    async throughcategorytable() {
      console.log(this.date)
      let datas = {
        time: '2020-02-05 00:00:00'
      }
      let times = this.date.substring(0, 11)
      let timess = times + '00:00:00'
      // datas.time = timess
      let { data, code } = await monitor.throughcategorytable(datas)
      if (code === 200) {
        console.log(data)
        this.righttableData = data
        this.righttableData.forEach((r) => {
          console.log(r)
          if (r.category == 0) {
            r.category = '综合指数'
          } else if (r.category == 1) {
            r.category = '江海指数'
          } else if (r.category == 2) {
            r.category = '江河指数'
          } else if (r.category == 3) {
            r.category = '海河联运'
          }
          r.indexInformation = r.indexInformation.toFixed(2)
          r.lastIndexInformation = r.lastIndexInformation.toFixed(2)
          r.rate = r.rate.substring(0, r.rate.indexOf('.') + 3) + '%'
        })
      } else {
        this.righttableData = []
      }
    },
    // 港航发展货物运量指数
    async freight() {
      // console.log(this.date)
      this.categorynum++
      if (this.categorynum == 0) {
        this.freightName = '综合指数'
      }
      if (this.categorynum > 7) {
        this.categorynum = 0
      } else if (this.categorynum == 2) {
        this.categorynum = 3
      }

      let datas = {
        category: this.categorynum,
        time: '2020-01-05 00:00:00'
      }
      let times = this.date.substring(0, 11)
      let timess = times + '00:00:00'
      // datas.time = timess
      let { data, code } = await monitor.freight(datas)
      if (code === 200) {
        this.exponents = data.indexInformation
        let aa = data.comparedToLastYear.split('.')[0]
        let bb = data.comparedToLastYear.split('.')[1]
        let cc = bb.substring(0, 1)
        // console.log(aa,cc);
        let aaa = data.comparedToLastMonth.split('.')[0]
        let bbb = data.comparedToLastMonth.split('.')[1]
        let ccc = bbb.substring(0, 1)
        this.comparedToLastYear = aa + '.' + cc + '%'
        this.comparedToLastMonth = aaa + '.' + ccc + '%'
        if (this.categorynum == 0) {
          this.freightName = '综合指数'
        } else if (this.categorynum == 1) {
          this.freightName = '集装箱'
        } else if (this.categorynum == 3) {
          this.freightName = '煤炭'
        } else if (this.categorynum == 4) {
          this.freightName = '钢铁'
        } else if (this.categorynum == 5) {
          this.freightName = '金属矿石'
        } else if (this.categorynum == 6) {
          this.freightName = '矿建材料'
        } else if (this.categorynum == 7) {
          this.freightName = '危险品'
        }
      } else {
        this.exponents = []
      }
    },
    // 获取港航发展指数走势图下拉框
    leftselect(val) {
      this.leftselectecharts = val
      this.getWharfCount()
    },
    // 获取港航发展右侧下拉框
    // rightdevelopselect(val){
    //   console.log(val)
    //   this.developselect = val;
    //   this.getWharfType1()
    // },

    // // 获取港航发展右侧联运指数走势分析图下拉框
    rightselsct(val) {
      console.log(val)
      this.rightselectecharts = val
      this.getWharfType1()
      this.getWharfCount1()
    },

    // },
    async duanmianlinechart() {
      if (this.duanmianCharts) {
        await this.duanmianCharts.setOption({
          grid: {
            // 布满div
            top: '20px',
            left: '50px',
            right: '15px',
            bottom: '30px'
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [150, 230, 224, 218, 135, 147, 260],
              type: 'line'
            }
          ]
        })
      }
    },
    // 港航发展总体形势0B
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
      }
    },
    //港航发展总体形势左边第二个图标图表
    async getWharfCount() {
      let datas = {
        category: this.leftselectecharts
      }
      console.log(this.leftselectecharts)
      let { data, code } = await monitor.categorys(datas)
      if (code === 200) {
        console.log(data)
        let time = Object.keys(data)
        let values = Object.values(data)
        if (this.totalMileageCharts) {
          this.totalMileageCharts.setOption({
            title: {
              text: '指数走势图'
            },
            dataZoom: [
              {
                id: 'dataZoomX',
                type: 'inside',
                show: false, //是否显示下方滚动条
                start: 100, //显示数据开始位置
                end: 30, //显示数据结束位置
                zoomLock: true
              }
            ],
            xAxis: [
              {
                // name: "月",
                data: time,
                axisLabel: {
                  rotate: 0
                }
              }
            ],
            series: [
              {
                lineStyle: {
                  color: 'rgb(0,145,255)'
                },
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: '#4ce68f'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //港航发展总体形势右边第一个图标图表
    async getWharfType1() {
      this.datasCategory++
      console.log(this.datasCategory)
      if (this.datasCategory == 4) {
        this.datasCategory = 0
      }
      let datas = {
        category: this.datasCategory,
        time: '2020-01-05 00:00:00'
      }
      // datas.category = this.rightselectecharts
      let times = this.date.substring(0, 11)
      let timess = times + '00:00:00'
      // datas.time = timess
      let { data, code } = await monitor.throughfreight(datas)
      if (code == 200) {
        let reg = /(\d+\.\d{2})\d+/
        let interception = data[0].indexInformation
          .toString()
          .replace(reg, '$1')
        // let title
        if (data[0].category == 0) {
          this.title = '江海河联运指数'
        } else if (data[0].category == 1) {
          this.title = '江海联运指数'
        } else if (data[0].category == 2) {
          this.title = '江河联运指数'
        } else if (data[0].category == 3) {
          this.title = '海河联运指数'
        }
        if (this.rightOneEcharts1) {
          this.rightOneEcharts1.setOption({
            title: {
              text: '江海河联运指数'
            },
            series: [
              {
                center: ['50%', '65%'],
                // splitLine: {
                //   show: false,
                // },
                startAngle: 200,
                endAngle: -20,
                type: 'gauge',
                radius: '100%',
                splitNumber: 10,
                min: 0,
                max: 200,
                progress: {
                  show: true
                },
                // 是否显示仪表盘轴线
                axisLine: {
                  // lineStyle: {
                  //   show: false,
                  // color: [[1, "#71d9ff"]],
                  // },
                },
                axisLine: {
                  show: true
                  // lineStyle:{
                  //   width:8
                  // }
                },
                // 是否显示刻度
                axisTick: {
                  show: true
                },
                axisLabel: {
                  color: '#000',
                  fontSize: 10,
                  distance: 15
                },
                // 展示结果
                data: [
                  {
                    value: interception,
                    // title 展示内容
                    name: this.title
                  }
                ],
                detail: {
                  fontStyle: 'normal',
                  fontSize: 20
                },
                pointer: {
                  // offsetCenter:[0,-10],
                  width: 4,
                  length: '60%'
                },
                title: {
                  // offsetCenter:[0,20]
                }
              }
            ],
            xAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ],
            yAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ]
          })
        }
      }
    },
    //港航发展总体形势右边第二个图标图表
    async getWharfCount1() {
      console.log(111)
      let datas = {
        category: this.rightselectecharts
      }
      let { code, data } = await monitor.throughcategorys(datas)
      console.log()
      if (code === 200) {
        console.log(data)
        let time = Object.keys(data)
        let values = Object.values(data)
        if (this.rightTwoEcharts) {
          this.rightTwoEcharts.setOption({
            title: {
              text: '指数走势图'
            },
            dataZoom: [
              {
                id: 'dataZoomX',
                type: 'inside',
                show: false, //是否显示下方滚动条
                start: 100, //显示数据开始位置
                end: 30, //显示数据结束位置
                zoomLock: true
              }
            ],
            xAxis: [
              {
                // name: "月份",
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //基础设施(港口)第一个图标
    async portrightone() {
      let dataall = []
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      if (data.type == '3') {
        data.type = 2
      } else {
        data.type = this.textcurrent + 1
      }
      console.log(this.clickid)
      data.objectid = 'TSZYQ_' + this.clickid
      let { res, status } = await monitor.portrightfive(data)
      if (status == 200) {
        let data = res.data
        this.allratio = []
        this.allratio = data
        for (const i in data) {
          dataall.push(data[i])
        }
        console.log(data.ylindex)
        let reg = /(\d+\.\d{2})\d+/
        let interception = data.ylindex.toString().replace(reg, '$1')
        if (this.rightOneEcharts) {
          await this.rightOneEcharts.setOption({
            title: {
              text: '利用水平仪表盘'
            },
            series: [
              {
                center: ['50%', '65%'],
                // splitLine: {
                //   show: false,
                // },
                startAngle: 200,
                endAngle: -20,
                type: 'gauge',
                radius: '100%',
                splitNumber: 10,
                min: 0,
                max: 1,
                progress: {
                  show: true
                },
                // 是否显示仪表盘轴线
                axisLine: {
                  // lineStyle: {
                  //   show: false,
                  // color: [[1, "#71d9ff"]],
                  // },
                },
                axisLine: {
                  show: true
                  // lineStyle:{
                  //   width:8
                  // }
                },
                // 是否显示刻度
                axisTick: {
                  show: true
                },
                axisLabel: {
                  color: '#000',
                  fontSize: 10,
                  distance: 15
                },
                // 展示结果
                data: [
                  {
                    value: interception,
                    // title 展示内容
                    name: '利用水平'
                  }
                ],
                detail: {
                  fontStyle: 'normal',
                  fontSize: 20
                },
                pointer: {
                  // offsetCenter:[0,-10],
                  width: 4,
                  length: '60%'
                },
                title: {
                  // offsetCenter:[0,20]
                }
              }
            ],
            xAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ],
            yAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ]
          })
        }
      }
    },
    //基础设施(港口)第二个图标
    async portrighttwo() {
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'TSZYQ_' + this.clickid
      let { res, status } = await monitor.portrightone(data)
      if (status === 200) {
        let data = res
        let time = Object.keys(data.data)
        let values = Object.values(data.data)
        if (this.rightTwoEcharts) {
          this.rightTwoEcharts.setOption({
            title: {
              text: '到港船舶数量折线图'
            },
            xAxis: [
              {
                // name: data.unit,
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //基础设施(港口)第三个图标
    async portrightthree() {
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'TSZYQ_' + this.clickid
      let { res, status } = await monitor.portrighttwo(data)
      if (status === 200) {
        let data = res
        let time = Object.keys(data.data)
        let values = Object.values(data.data)
        if (this.rightThreeEcharts) {
          this.rightThreeEcharts.setOption({
            title: {
              text: '港口吞吐量折线图'
            },
            xAxis: [
              {
                // name: data.unit,
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //基础设施(港口)第四个图标
    async portrightfour() {
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'TSZYQ_' + this.clickid
      let { res, status } = await monitor.portrightthree(data)
      if (status === 200) {
        let data = res
        let time = Object.keys(data.data)
        let values = Object.values(data.data)
        if (this.rightFourEcharts) {
          this.rightFourEcharts.setOption({
            title: {
              text: '泊位利用率折线图'
            },
            xAxis: [
              {
                // name: data.unit,
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //基础设施(港口)第五个图标
    async portrightfive() {
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'TSZYQ_' + this.clickid
      let { res, status } = await monitor.portrightfour(data)
      if (status === 200) {
        let data = res
        let time = Object.keys(data.data)
        let values = Object.values(data.data)
        if (this.rightFiveEcharts) {
          this.rightFiveEcharts.setOption({
            title: {
              text: '泊位量能比折线图'
            },
            xAxis: [
              {
                // name: data.unit,
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //基础设施(航道)第二个图标
    async channelrightone() {
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'GXHD_' + this.hdclickid
      let { res, status } = await monitor.channelrightone(data)
      if (status === 200) {
        let data = res
        let time = Object.keys(data.data)
        let values = Object.values(data.data)
        if (this.rightTwoEcharts) {
          this.rightTwoEcharts.setOption({
            title: {
              text: '船舶通过量折线图'
            },
            xAxis: [
              {
                // name: data.unit,
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //基础设施(航道)第三个图标
    async channelrighttwo() {
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'GXHD_' + this.hdclickid
      let { res, status } = await monitor.channelrighttwo(data)
      if (status === 200) {
        let data = res
        let time = Object.keys(data.data)
        let values = Object.values(data.data)
        let that = this
        if (this.rightThreeEcharts) {
          this.rightThreeEcharts.setOption({
            title: {
              text: '船舶货运量折线图'
            },
            xAxis: [
              {
                // name: data.unit,
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ],
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
      }
    },
    //基础设施(航道)第一个图标
    async channelrightthree() {
      let dataall = []
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'GXHD_' + this.hdclickid
      let { res, status } = await monitor.channelrightthree(data)
      if (status == 200) {
        let data = res
        this.allratio = []
        this.allratio = data
        // for (const i in data) {
        dataall.push(Object.values(data)[0])
        // }
        console.log(dataall)
        let reg = /(\d+\.\d{2})\d+/
        let interception = dataall.toString().replace(reg, '$1')
        if (this.rightOneEcharts) {
          await this.rightOneEcharts.setOption({
            title: {
              text: '利用水平仪表盘'
            },
            series: [
              {
                center: ['50%', '65%'],
                // splitLine: {
                //   show: false,
                // },
                startAngle: 200,
                endAngle: -20,
                type: 'gauge',
                radius: '100%',
                splitNumber: 10,
                min: 0,
                max: 1,
                progress: {
                  show: true
                },
                // 是否显示仪表盘轴线
                axisLine: {
                  // lineStyle: {
                  //   show: false,
                  // color: [[1, "#71d9ff"]],
                  // },
                },
                axisLine: {
                  show: true
                  // lineStyle:{
                  //   width:8
                  // }
                },
                // 是否显示刻度
                axisTick: {
                  show: true
                },
                axisLabel: {
                  color: '#000',
                  fontSize: 10,
                  distance: 15
                },
                // 展示结果
                data: [
                  {
                    value: interception,
                    // title 展示内容
                    name: '利用水平'
                  }
                ],
                detail: {
                  fontStyle: 'normal',
                  fontSize: 20
                },
                pointer: {
                  // offsetCenter:[0,-10],
                  width: 4,
                  length: '60%'
                },
                title: {
                  // offsetCenter:[0,20]
                }
              }
            ],
            xAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ],
            yAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ]
          })
        }
      }
    },

    //基础设施(船闸)第二个图标
    async lockrightone() {
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'CZ_' + this.czclickid
      console.log(data)
      let { res, status } = await monitor.lockrightone(data)
      if (status === 200) {
        let data = res
        let time = Object.keys(data.data)
        let values = Object.values(data.data)
        if (this.rightTwoEcharts) {
          this.rightTwoEcharts.setOption({
            title: {
              text: '船舶通过量折线图'
            },
            xAxis: [
              {
                // name: data.unit,
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //基础设施(船闸)第三个图标
    async lockrighttwo() {
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'CZ_' + this.czclickid
      let { res, status } = await monitor.lockrighttwo(data)
      if (status === 200) {
        let that = this
        let data = res
        let time = Object.keys(data.data)
        let values = Object.values(data.data)
        if (this.rightThreeEcharts) {
          this.rightThreeEcharts.setOption({
            title: {
              text: '船舶货运量折线图'
            },
            xAxis: [
              {
                // name: data.unit,
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ],
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
      }
    },
    //基础设施(船闸)第一个图标
    async lockrightthree() {
      let dataall = []
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'CZ_' + this.czclickid
      let { res, status } = await monitor.lockrightthree(data)
      if (status == 200) {
        let data = res.data
        console.log(data)
        this.allratio = []
        this.allratio = data
        for (const i in data) {
          dataall.push(data[i])
        }
        let reg = /(\d+\.\d{2})\d+/
        let interception = data.ylindex.toString().replace(reg, '$1')
        if (this.rightOneEcharts) {
          await this.rightOneEcharts.setOption({
            title: {
              text: '利用水平仪表盘'
            },
            series: [
              {
                center: ['50%', '65%'],
                // splitLine: {
                //   show: false,
                // },
                startAngle: 200,
                endAngle: -20,
                type: 'gauge',
                radius: '100%',
                splitNumber: 10,
                min: 0,
                max: 1,
                progress: {
                  show: true
                },
                // 是否显示仪表盘轴线
                axisLine: {
                  // lineStyle: {
                  //   show: false,
                  // color: [[1, "#71d9ff"]],
                  // },
                },
                axisLine: {
                  show: true
                  // lineStyle:{
                  //   width:8
                  // }
                },
                // 是否显示刻度
                axisTick: {
                  show: true
                },
                axisLabel: {
                  color: '#000',
                  fontSize: 10,
                  distance: 15
                },
                // 展示结果
                data: [
                  {
                    value: interception,
                    // title 展示内容
                    name: '利用水平'
                  }
                ],
                detail: {
                  fontStyle: 'normal',
                  fontSize: 20
                },
                pointer: {
                  // offsetCenter:[0,-10],
                  width: 4,
                  length: '60%'
                },
                title: {
                  // offsetCenter:[0,20]
                }
              }
            ],
            xAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ],
            yAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ]
          })
        }
      }
    },

    //基础设施(锚地)第二个图标
    async anchoragerightone() {
      let { res, status } = await monitor.anchoragerightone()
      if (status === 200) {
        let data = res.data
        let name = []
        let number = []
        let numbers = []
        let all = []
        data.forEach((r) => {
          for (let i in r) {
            all.push({ name: i, number: r[i] })
          }
        })
        all.forEach((r) => {
          number.push(Object.values(r))
        })
        number.forEach((r) => {
          console.log(r)
          if (r[0] == 'order') {
            r.splice(0, 2)
          } else {
            name.push(r[0])
            numbers.push({ name: r[0], value: r[1] })
          }
        })

        if (this.rightTwoEcharts) {
          this.rightTwoEcharts.setOption({
            title: {
              text: '船舶锚泊数量折线图'
            },
            xAxis: [
              {
                // name: "年份",
                data: name
              }
            ],
            series: [
              {
                data: numbers,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //基础设施(锚地)第三个图标
    async anchoragerighttwo() {
      let { res, status } = await monitor.anchoragerighttwo()
      if (status === 200) {
        let data = res.data
        let name = []
        let number = []
        let numbers = []
        let all = []
        data.forEach((r) => {
          for (let i in r) {
            all.push({ name: i, number: r[i] })
          }
        })
        all.forEach((r) => {
          number.push(Object.values(r))
        })
        number.forEach((r) => {
          console.log(r)
          if (r[0] == 'order') {
            r.splice(0, 2)
          } else {
            name.push(r[0])
            numbers.push({ name: r[0], value: r[1] })
          }
        })
        if (this.rightThreeEcharts) {
          this.rightThreeEcharts.setOption({
            title: {
              text: '船舶锚泊数量折线图'
            },
            xAxis: [
              {
                // name: "年份",
                data: name
              }
            ],
            series: [
              {
                data: numbers,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //基础设施(锚地)第四个图标
    async anchoragerightthree() {
      let { res, status } = await monitor.anchoragerightthree()
      if (status === 200) {
        let data = res.data
        let name = []
        let number = []
        let numbers = []
        let all = []
        data.forEach((r) => {
          for (let i in r) {
            all.push({ name: i, number: r[i] })
          }
        })
        all.forEach((r) => {
          number.push(Object.values(r))
        })
        number.forEach((r) => {
          console.log(r)
          if (r[0] == 'order') {
            r.splice(0, 2)
          } else {
            name.push(r[0])
            numbers.push({ name: r[0], value: r[1] })
          }
        })
        if (this.rightFourEcharts) {
          this.rightFourEcharts.setOption({
            title: {
              text: '船舶锚泊数量折线图'
            },
            xAxis: [
              {
                // name: "年份",
                data: name
              }
            ],
            series: [
              {
                data: numbers,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //基础设施(锚地)第五个图标
    async anchoragerightfour() {
      let { res, status } = await monitor.anchoragerightfour()
      if (status === 200) {
        let data = res.data
        let name = []
        let number = []
        let numbers = []
        let all = []
        data.forEach((r) => {
          for (let i in r) {
            all.push({ name: i, number: r[i] })
          }
        })
        all.forEach((r) => {
          number.push(Object.values(r))
        })
        number.forEach((r) => {
          console.log(r)
          if (r[0] == 'order') {
            r.splice(0, 2)
          } else {
            name.push(r[0])
            numbers.push({ name: r[0], value: r[1] })
          }
        })
        if (this.rightFiveEcharts) {
          this.rightFiveEcharts.setOption({
            title: {
              text: '船舶锚泊数量折线图'
            },
            xAxis: [
              {
                // name: "年份",
                data: name
              }
            ],
            series: [
              {
                data: numbers,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //基础设施(锚地)第一个图标
    async anchoragerightfive() {
      if (this.rightOneEcharts) {
        await this.rightOneEcharts.setOption({
          title: {
            text: '利用水平仪表盘'
          },
          series: [
            {
              center: ['50%', '65%'],
              // splitLine: {
              //   show: false,
              // },
              startAngle: 200,
              endAngle: -20,
              type: 'gauge',
              radius: '100%',
              splitNumber: 10,
              min: 0,
              max: 1,
              progress: {
                show: true
              },
              // 是否显示仪表盘轴线
              axisLine: {
                // lineStyle: {
                //   show: false,
                // color: [[1, "#71d9ff"]],
                // },
              },
              axisLine: {
                show: true
                // lineStyle:{
                //   width:8
                // }
              },
              // 是否显示刻度
              axisTick: {
                show: true
              },
              axisLabel: {
                color: '#000',
                fontSize: 10,
                distance: 15
              },
              // 展示结果
              data: [
                {
                  value: 0.75,
                  // title 展示内容
                  name: '利用水平'
                }
              ],
              detail: {
                fontStyle: 'normal',
                fontSize: 20
              },
              pointer: {
                // offsetCenter:[0,-10],
                width: 4,
                length: '60%'
              },
              title: {
                // offsetCenter:[0,20]
              }
            }
          ],
          xAxis: [
            {
              name: '',
              axisLine: {
                show: false
              }
            }
          ],
          yAxis: [
            {
              name: '',
              axisLine: {
                show: false
              }
            }
          ]
        })
      }
    },
    // 船舶运行分析第一个图标
    async shiprightone() {
      let { code, data } = await monitor.ShipOperationAnalysisOne()
      let xData = []
      let yData = []
      if (code === 200) {
        let datas = data
        xData = Object.keys(data)
        let result = []
        for (let i = 0; i < xData.length; i += xData.length) {
          result.push(xData.slice(i, i + xData.length))
        }
        for (const key in data) {
          yData.push({
            name: key,
            value: data[key]
          })
        }
        let legendData = result.map((r) => {
          return {
            icon: 'circle',
            itemWidth: 10, // 设置宽度class
            itemHeight: 10, // 设置高度im
            itemGap: 40, // 设置间距
            itemGap: 20, // 设置间距
            top: '20%',
            x: "50%",
            right: 10,
            bottom: 135,
            data: r ? r : []
          }
        })
        if (this.rightOneEcharts) {
          this.rightOneEcharts.setOption({
            title: {
              text: '船舶类型饼图',
              textStyle: {
                color: '#000',
                fontSize: this.fontSize(0.16)
              },
              top: '3%'
            },
            tooltip: {
              trigger: 'item'
            },
            grid: {
              left: '2%',
              bottom: '4%',
              width: '82%',
              height: '68%',
              containLabel: true
            },
            legend: [
              {
                icon: "circle",
                itemWidth: 10, // 设置宽度class
                itemHeight: 10, // 设置高度im
                itemGap: 40, // 设置间距
                itemGap: 20, // 设置间距
                top: "20%",
                x: "50%",
                right: "10%",
                bottom: 135,
                data: legendData[0].data,
              },
            ],
            // legend: {
            //   type: 'scroll',
            //   orient: 'vertical',
            //   icon: 'circle',
            //   itemWidth: 10, // 设置宽度class
            //   itemHeight: 10, // 设置高度im
            //   itemGap: 20, // 设置间距
            //   top: '10%',
            //   // x: '220',
            //   right: '5%',
            //   bottom: 135,
            //   formatter: function (name) {
            //     // 获取legend显示内容
            //     let data = result //你的数据
            //     let total = 0
            //     let tarValue = 0
            //     let value = 0
            //     for (let i = 0, l = data.length; i < l; i++) {
            //       total += data[i].value
            //       if (data[i].name == name) {
            //         tarValue = data[i].value
            //         value = data[i].value
            //       }
            //     }
            //     return [
            //       '{a|' +
            //         echarts.format.truncateText(
            //           name,
            //           150,
            //           '14px Microsoft Yahei',
            //           '…'
            //         ) +
            //         '}'
            //     ].join(' ')
            //   },
            //   tooltip: {
            //     show: true
            //   },
            //   textStyle: {
            //     rich: {
            //       a: {
            //         color: 'rgb(51,51,51)',
            //         width: 80,
            //         align: 'left'
            //       },
            //       b: {
            //         width: 50,
            //         align: 'left',
            //         color: 'rgb(51,51,51)'
            //       },
            //       x: {
            //         width: 30,
            //         align: 'left',
            //         color: 'rgb(51,51,51)'
            //       }
            //     }
            //   }
            // },
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
            series: [
              {
                type: 'pie',
                right: '50%',
                radius: ['50%', '70%'],
                center: ['50%', '55%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: this.fontSize(0.16),
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: yData
              }
            ],
            xAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ],
            yAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ]
          })
        }
      }
    },
    //船舶运行分析第二个图标
    async shiprighttwo() {
      let { code, data } = await monitor.ShipOperationAnalysisTwo()
      let XData = []
      let YData = []
      if (code === 200) {
        XData.push(Object.keys(data))
        YData.push(Object.values(data))
        if (this.rightTwoEcharts) {
          this.rightTwoEcharts.setOption({
            title: {
              text: '各类型船舶数量柱状图'
            },
            color: ['#6decff'],
            xAxis: {
              type: 'category',
              data: XData[0],
              axisLabel: {
                rotate: 40
              }
            },
            yAxis: {
              type: 'value',
              name: '单位:个'
            },
            series: [
              {
                data: YData[0],
                type: 'bar',
                barWidth: 12
              }
            ]
          })
        }
      }
    },
    //船舶运行分析第三个图标
    async shiprightthree() {
      let { code, data } = await monitor.ShipOperationAnalysisThree()
      let XData = []
      let YData = []
      if (code === 200) {
        XData.push(Object.keys(data))
        YData.push(Object.values(data))
        if (this.rightThreeEcharts) {
          this.rightThreeEcharts.setOption({
            title: {
              text: '各属地船舶数量柱状图'
            },
            color: ['#6decff'],
            xAxis: {
              type: 'category',
              data: XData[0],
              axisLabel: {
                rotate: 40
              }
            },
            yAxis: {
              type: 'value',
              name: '单位:个'
            },
            series: [
              {
                data: YData[0],
                type: 'bar',
                barWidth: 12
              }
            ]
          })
        }
      }
    },

    //港航运行态势分析(港口)第三个图标
    async operationportone() {
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'TSZYQ_' + this.clickid
      let { res, status } = await monitor.portrightone(data)
      if (status === 200) {
        let data = res
        let time = Object.keys(data.data)
        let values = Object.values(data.data)
        if (this.rightThreeEcharts) {
          this.rightThreeEcharts.setOption({
            title: {
              text: '到港船舶数量折线图'
            },
            xAxis: [
              {
                // name: data.unit,
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //港航运行态势分析(港口)第四个图标
    async operationporttwo() {
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'TSZYQ_' + this.clickid
      let { res, status } = await monitor.portrighttwo(data)
      if (status === 200) {
        let data = res
        let time = Object.keys(data.data)
        let values = Object.values(data.data)
        if (this.rightFourEcharts) {
          this.rightFourEcharts.setOption({
            title: {
              text: '港口吞吐量折线图'
            },
            xAxis: [
              {
                // name: data.unit,
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //港航运行态势分析(港口)第一个图标
    async operationportthree() {
      let dataall = []
      let data = {
        planningId: 'TSZYQ_1'
        // type: 1,
      }
      // data.type = this.textcurrent + 1;
      // data.planningId = "TSZYQ_" + this.clickid;
      let { res, status } = await monitor.operationportthree(data)
      if (status == 200) {
        let data = res.res
        console.log(data)
        // for (const i in data) {
        //   dataall.push(data[i]);
        // }
        console.log(data.ylindex)
        let reg = /(\d+\.\d{2}).+/
        let interception = data.ylindex.toString().replace(reg, '$1')
        if (this.rightOneEcharts) {
          await this.rightOneEcharts.setOption({
            title: {
              text: '繁忙度仪表盘'
            },
            series: [
              {
                center: ['50%', '65%'],
                // splitLine: {
                //   show: false,
                // },
                startAngle: 200,
                endAngle: -20,
                type: 'gauge',
                radius: '100%',
                splitNumber: 10,
                min: 0,
                max: 1,
                progress: {
                  show: true
                },
                // 是否显示仪表盘轴线
                axisLine: {
                  // lineStyle: {
                  //   show: false,
                  // color: [[1, "#71d9ff"]],
                  // },
                },
                axisLine: {
                  show: true
                  // lineStyle:{
                  //   width:8
                  // }
                },
                // 是否显示刻度
                axisTick: {
                  show: true
                },
                axisLabel: {
                  color: '#000',
                  fontSize: 10,
                  distance: 15
                },
                // 展示结果
                data: [
                  {
                    value: interception,
                    // title 展示内容
                    name: '繁忙度'
                  }
                ],
                detail: {
                  fontStyle: 'normal',
                  fontSize: 20
                },
                pointer: {
                  // offsetCenter:[0,-10],
                  width: 4,
                  length: '60%'
                },
                title: {
                  // offsetCenter:[0,20]
                }
              }
            ],
            xAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ],
            yAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ]
          })
        }
      }
    },
    //港航运行态势分析(港口)第二个图标
    async operationportfour() {
      let dataall = []
      let datas = {
        portId: 'TSZYQ_1'
        // type: 1,
      }

      // data.type = this.textcurrent + 1;
      // datas.portId = "TSZYQ_" + this.clickid;
      let { code, data } = await monitor.operationportfour(datas)
      if (code == 200) {
        // for (const i in data) {
        //   dataall.push(data[i]);
        // }
        console.log(data)
        let s = data
        let reg = /(\d+\.\d{2}).+/
        let interception = s.toString().replace(reg, '$1')
        if (this.rightTwoEcharts) {
          await this.rightTwoEcharts.setOption({
            title: {
              text: '作业效率仪表盘'
            },
            series: [
              {
                center: ['50%', '65%'],
                // splitLine: {
                //   show: false,
                // },
                startAngle: 200,
                endAngle: -20,
                type: 'gauge',
                radius: '100%',
                splitNumber: 10,
                min: 0,
                max: 1,
                progress: {
                  show: true
                },
                // 是否显示仪表盘轴线
                axisLine: {
                  // lineStyle: {
                  //   show: false,
                  // color: [[1, "#71d9ff"]],
                  // },
                },
                axisLine: {
                  show: true
                  // lineStyle:{
                  //   width:8
                  // }
                },
                // 是否显示刻度
                axisTick: {
                  show: true
                },
                axisLabel: {
                  color: '#000',
                  fontSize: 10,
                  distance: 15
                },
                // 展示结果
                data: [
                  {
                    value: interception,
                    // title 展示内容
                    name: '作业效率'
                  }
                ],
                detail: {
                  fontStyle: 'normal',
                  fontSize: 20
                },
                pointer: {
                  // offsetCenter:[0,-10],
                  width: 4,
                  length: '60%'
                },
                title: {
                  // offsetCenter:[0,20]
                }
              }
            ],
            xAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ],
            yAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ]
          })
        }
      }
    },
    //港航运行态势分析(航道)第二个图标
    async operationchannelone() {
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'GXHD_' + this.hdclickid
      let { res, status } = await monitor.channelrightone(data)
      if (status === 200) {
        let data = res
        let time = Object.keys(data.data)
        let values = Object.values(data.data)
        if (this.rightTwoEcharts) {
          this.rightTwoEcharts.setOption({
            title: {
              text: '船舶通过量折线图'
            },
            xAxis: [
              {
                // name: data.unit,
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //港航运行态势分析(航道)第三个图标
    async operationchanneltwo() {
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'GXHD_' + this.hdclickid
      let { res, status } = await monitor.channelrighttwo(data)
      if (status === 200) {
        let data = res
        let time = Object.keys(data.data)
        let values = Object.values(data.data)
        let that = this
        if (this.rightThreeEcharts) {
          this.rightThreeEcharts.setOption({
            title: {
              text: '船舶航速折线图'
            },
            xAxis: [
              {
                // name: data.unit,
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ],
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
      }
    },
    //港航运行态势分析(航道)第一个图标
    async operationchannelthree() {
      let dataall = []
      let data = {
        planningId: 1
        // type: 1,
      }
      // data.type = this.textcurrent + 1;
      data.planningId = 'TSZYQ_' + this.clickid
      let { res, status } = await monitor.operationportthree(data)
      if (status == 200) {
        let data = res.res
        console.log(data)
        // for (const i in data) {
        //   dataall.push(data[i]);
        // }
        console.log(data.ylindex)
        let reg = /(\d+\.\d{2}).+/
        let interception = data.ylindex.toString().replace(reg, '$1')
        console.log(interception)
        if (this.rightOneEcharts) {
          await this.rightOneEcharts.setOption({
            title: {
              text: '繁忙度仪表盘'
            },
            series: [
              {
                center: ['50%', '65%'],
                // splitLine: {
                //   show: false,
                // },
                startAngle: 200,
                endAngle: -20,
                type: 'gauge',
                radius: '100%',
                splitNumber: 10,
                min: 0,
                max: 1,
                progress: {
                  show: true
                },
                // 是否显示仪表盘轴线
                axisLine: {
                  // lineStyle: {
                  //   show: false,
                  // color: [[1, "#71d9ff"]],
                  // },
                },
                axisLine: {
                  show: true
                  // lineStyle:{
                  //   width:8
                  // }
                },
                // 是否显示刻度
                axisTick: {
                  show: true
                },
                axisLabel: {
                  color: '#000',
                  fontSize: 10,
                  distance: 15
                },
                // 展示结果
                data: [
                  {
                    value: interception,
                    // title 展示内容
                    name: '繁忙度'
                  }
                ],
                detail: {
                  fontStyle: 'normal',
                  fontSize: 20
                },
                pointer: {
                  // offsetCenter:[0,-10],
                  width: 4,
                  length: '60%'
                },
                title: {
                  // offsetCenter:[0,20]
                }
              }
            ],
            xAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ],
            yAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ]
          })
        }
      }
    },

    //港航运行态势分析(船闸)第二个图标
    async operationlockone() {
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'CZ_' + this.czclickid
      console.log(data)
      let { res, status } = await monitor.lockrightone(data)
      if (status === 200) {
        let data = res
        let time = Object.keys(data.data)
        let values = Object.values(data.data)
        if (this.rightTwoEcharts) {
          this.rightTwoEcharts.setOption({
            title: {
              text: '船舶通过量折线图'
            },
            xAxis: [
              {
                // name: data.unit,
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1)'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ]
          })
        }
      }
    },
    //港航运行态势分析(船闸)第三个图标
    async operationlocktwo() {
      let data = {
        objectid: 1,
        type: 1
      }
      data.type = this.textcurrent + 1
      data.objectid = 'CZ_' + this.czclickid
      let { res, status } = await monitor.lockrighttwo(data)
      if (status === 200) {
        let data = res
        let time = Object.keys(data.data)
        let values = Object.values(data.data)
        let that = this
        if (this.rightThreeEcharts) {
          this.rightThreeEcharts.setOption({
            title: {
              text: '待闸时间折线图'
            },
            xAxis: [
              {
                // name: data.unit,
                data: time
              }
            ],
            series: [
              {
                data: values,
                smooth: true,
                type: 'line',
                showSymbol: false,
                itemStyle: {
                  color: 'rgba(0,145,255,1))'
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(0,145,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,145,255,0)'
                    }
                  ])
                }
              }
            ],
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
      }
    },
    //港航运行态势分析(船闸)第一个图标
    async operationlockthree() {
      let dataall = []
      let data = {
        planningId: 1
        // type: 1,
      }
      // data.type = this.textcurrent + 1;
      data.planningId = 'TSZYQ_' + this.clickid
      let { res, status } = await monitor.operationportthree(data)
      if (status == 200) {
        let data = res.res
        console.log(data)
        // for (const i in data) {
        //   dataall.push(data[i]);
        // }
        console.log(data.ylindex)
        let reg = /(\d+\.\d{2}).+/
        let str = data.ylindex
        let interception = str.toString().replace(reg, '$1')
        console.log(interception)
        if (this.rightOneEcharts) {
          await this.rightOneEcharts.setOption({
            title: {
              text: '繁忙度仪表盘'
            },
            series: [
              {
                center: ['50%', '65%'],
                // splitLine: {
                //   show: false,
                // },
                startAngle: 200,
                endAngle: -20,
                type: 'gauge',
                radius: '100%',
                splitNumber: 10,
                min: 0,
                max: 1,
                progress: {
                  show: true
                },
                // 是否显示仪表盘轴线
                axisLine: {
                  // lineStyle: {
                  //   show: false,
                  // color: [[1, "#71d9ff"]],
                  // },
                },
                axisLine: {
                  show: true
                  // lineStyle:{
                  //   width:8
                  // }
                },
                // 是否显示刻度
                axisTick: {
                  show: true
                },
                axisLabel: {
                  color: '#000',
                  fontSize: 10,
                  distance: 15
                },
                // 展示结果
                data: [
                  {
                    value: interception,
                    // title 展示内容
                    name: '繁忙度'
                  }
                ],
                detail: {
                  fontStyle: 'normal',
                  fontSize: 20
                },
                pointer: {
                  // offsetCenter:[0,-10],
                  width: 4,
                  length: '60%'
                },
                title: {
                  // offsetCenter:[0,20]
                }
              }
            ],
            xAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ],
            yAxis: [
              {
                name: '',
                axisLine: {
                  show: false
                }
              }
            ]
          })
        }
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
  position: relative;
}
.information-retrieval {
  width: 100px;
  height: 100%;
  box-shadow: 0px 2px 16px 0px rgba(4, 23, 37, 0.3);
  background: rgb(29, 88, 133);
  .information-box {
    height: 93%;
    display: flex;
    flex-direction: column;
    align-items: center;
    > div {
      width: 74px;
      margin-top: 20px;
      background-color: rgba(29, 132, 210, 0.7);
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      cursor: pointer;
      position: relative;
      .sonmenu,
      .sonmenu1 {
        position: absolute; // width: 74px;
        right: -80px;
        top: 0;
        width: 73px;
        height: 86px;
        background-color: #4d799c;
        border-radius: 6px;
        overflow: hidden;
        z-index: 20;
        > div {
          width: 100%;
          height: 33%;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: solid 1px #70a0c7;
          cursor: pointer;
        }
        > div:last-child {
          border: none;
        }
        .sonactive {
          background-color: #21b8ce;
        }
      }
      > img {
        width: 30px;
        height: 30px;
        margin-top: 7px;
      }
      > p {
        font-size: 14px;
        color: #ffffff;
        padding: 5px 5px;
        text-align: center;
      }
      .sonmenu {
        height: 114px;
        > div {
          height: 25%;
        }
      }
    }
    .active {
      background-color: rgba(41, 237, 252, 0.7);
    }
  }
}
// .top-view{
//   position:absolute;
//   top:10px;
//   left:10px;
// }
.view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .top-view {
    width: 100%;
    height: 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .view-img {
      width: 45%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 90%;
        height: 20%;
      }
    }
    .top-view-title {
      width: 10%;

      span {
        font-size: calc(100vw * 22 / 1920);
        font-weight: 700;
      }
    }
  }
  .text-view {
    width: 100%;
    height: 95%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .left {
    width: 21%;
    height: 98%;
    background: #fff;
    position: relative;
    margin: 0 5px;
    #berth-left-one {
      width: 100%;
      padding: 5px;
      height: 20%;
      min-height: 130px;
      border-radius: 10px;
      .title {
        font-size: calc(100vw * 16 / 1920);
        color: #000;
        font-weight: 600;
        padding: 5px 5px;
      }
      .firstimg {
        background: url('../../assets/img/monitor/beijing.png') no-repeat;
        background-size: 100% 100%;
        height: calc(100% - 20px);
        color: #fff;
        display: flex;
        justify-content: space-between;
        .topzxt {
          background: url('../../assets/img/monitor/zxt.png') no-repeat;
          background-size: 100% 60%;
          height: 100%;
          background-position: center;
          width: 25%;
        }
        .leftimgtext {
          width: 25%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          .toptext {
            font-size: calc(100vw * 30 / 1920);
            color: rgb(21, 79, 116);
            font-weight: 600;
            margin-bottom: 5%;
          }
          .buttontext {
            width: 98%;
            color: rgb(0, 26, 100);
            padding: 3% 10% 0 10%;
            font-size: calc(100vw * 14 / 1920);
          }
        }
        .rightimgtext {
          > p {
            color: rgb(128, 128, 128);
            font-size: calc(100vw * 12 / 1920);
          }
          width: 35%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          padding-right: 3%;
          padding-top: 5%;
          white-space: nowrap;
          .rightzs {
            font-size: calc(100vw * 20 / 1920);
            font-weight: 600;
            color: rgb(231, 60, 4);
            padding: 2% 0;
          }
          .righttime {
            color: rgb(0, 26, 100);
            // margin-bottom: -15%;
            font-size: calc(100vw * 12 / 1920);
          }
          .rightimgtext_bottom {
            // height: 50%;
            margin-top: 8%;
            padding-right: 5%;
            font-size: calc(100vw * 12 / 1920);
            p {
              width: 100%;
              margin: 5% 0;
              letter-spacing: 1px;
              font-size: calc(100vw * 12 / 1920);
            }
          }
        }
        // flex-direction: column;
        // justify-content: center;
        // padding-left: 5%;
        // .firstimg-number {
        //   font-size: 40px;
        //   font-weight: 600;
        // }
      }
      .twoimg {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
        height: calc(50% - 20px);
        .leftimg {
          background: url('../../assets/img/monitor/yanjiang.png') no-repeat;
          background-size: 100% 100%;
          width: 48.5%;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 5%;
          .leftimg-number {
            font-size: 40px;
            font-weight: 600;
          }
        }
        .rightimg {
          background: url('../../assets/img/monitor/neihe.png') no-repeat;
          background-size: 100% 100%;
          width: 48.5%;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 5%;
          .rightimg-number {
            font-size: 40px;
            font-weight: 600;
          }
        }
      }
    }
    #berth-left-two {
      width: 100%;
      height: 35%;
      // min-height: 200px;
      border-radius: 10px;
      margin-top: 10%;
      position: relative;
      #berth-left-two1 {
        width: 100%;
        height: 100%;
      }
      .leftinfrastructureSelect {
        position: absolute;
        top: -3%;
        left: 49%;
        z-index: 10;
        width: 50%;
      }
    }
    #berth-left-three {
      width: 100%;
      // min-height: calc(63% - 200px);
      border-radius: 10px;
      margin-top: 5%;
      height: 35%;
      overflow: auto;
    }
    #berth-left-four {
      position: absolute;
      top: 15px;
      left: 300px;
      z-index: 999;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .table-container,
  .leftinfrastructure {
    width: 16%;
    height: 100%;
    background: #264b68;
    position: relative;
    padding: 10px 10px;
    .table-search,
    .tree-search {
      min-height: 35px;
      height: 4.5%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .search-input {
        width: 100%;
        height: 100%;
        /deep/ .el-input input {
          border: none;
          background-color: #608bad !important;
          color: #ffffff;
        }
        & ::placeholder {
          color: #ffffff;
        }
        /deep/ i {
          color: #fff;
        }
      }
      .search-select {
        width: 35%;
        height: 100%;
        /deep/ .el-select input {
          border: none;
          background-color: #608bad !important;
          color: #ffffff;
        }
        /deep/ i {
          color: #fff;
        }
      }
      .search-input-width {
        width: 100%;
      }
    }
    .tree-content {
      height: 94%;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      justify-content: space-between;
      padding-right: 20px;
      padding-top: 15px;
      .el-tree {
        color: #fff;
        background: transparent;
        /deep/ .el-tree-node__content:hover {
          background-color: rgba(0, 155, 249, 0.6);
          color: #fff;
        }
        /deep/ .el-tree-node:focus > .el-tree-node__content {
          background-color: rgba(0, 155, 249, 0.6);
        }
        /deep/ .el-tree-node > .el-tree-node__content {
          background-color: transparent;
        }
      }
    }
    .anchorage-content {
      width: 100%;
      height: 96%;
      overflow-y: auto;
      justify-content: space-between;
      flex-direction: column;
      padding-right: 0px;
      .table-content {
        width: 100%;
        height: 94%; // padding-right: 2px;
        border: 1px solid #2a5e87;
        .el-table {
          border: 1px solid #2a5e87;
        }
      }
      .pagination-container {
        display: flex;
        height: 6%;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
  .gis-container {
    width: 57%;
    height: 98%;
    position: relative;
    // padding:10px 10px;
    box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.1);
    #container {
      width: 100%;
      height: 100%;
      background: #fff;
      padding: 5px;
      position: absolute;
    }
    #echartsMap {
      width: 100%;
      height: 100%;
      background: #fff;
      padding: 5px;
      position: absolute;
    }
    .gisSelect {
      position: absolute;
      top: 3%;
      right: -5%;
      .el-select {
        width: 72%;
      }
    }
    .shipSelect {
      position: absolute;
      top: 15px;
      left: 100px;
      width: 25%;
    }
    .ratioColor {
      width: 23px;
      height: 150px;
      position: absolute;
      right: 10px;
      bottom: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .berthlegend {
      width: 70px;
      height: 155px;
      // border:2px solid #fff;
      position: absolute;
      right: 5px;
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
      }
    }
    .centerselect {
      position: absolute;
      top: 15px;
      left: 50px;
      display: flex;
      justify-content: flex-start;
      width: 100%;
      .infrastructureSelect {
        width: 15%;
        margin-right: 15px;
      }
      .infrastructureinput {
        width: 25%;
      }
    }
  }
  .od-width,
  .od-width3 {
    width: 62%;
  }
  .od-widths {
    width: 78%;
  }
  .shipright {
    height: 90% !important;
  }
  .righttext {
    height: 95% !important;
  }
  .rightText {
    background: #186fb0 !important;
  }
  .right {
    width: 22%;
    height: 98.5%;
    background: #fff;
    padding: 10px 10px;
    .right-echarts {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      // justify-content: space-around;
      overflow: auto;
      flex: 1;
      div {
        flex: 1;
        width: 100%;
        border: 1px solid block;
        min-height: 33.3%;
        position: relative;
        .rightinfrastructureSelect {
          position: absolute;
          top: 0%;
          left: 49%;
          z-index: 10;
          width: 50%;
        }
        #berth-right-two1 {
          width: 100%;
          height: 100%;
        }
      }
      .rightTable {
        border: 1px solid rgb(235, 238, 245);
      }
    }
    .shipRightSelect {
      margin: 5px 15px;
      .el-select {
        width: 100%;
      }
    }
    .right-text {
      width: 95%;
      height: 20px;
      margin: 5px 10px;
      display: flex;
      flex: 1;
      div {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 1px solid #fff;
        background: #21b8ce;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
.rightTable {
  height: 30%;
  overflow: auto;
  /deep/ .el-table tr {
    height: 38.5px;
  }
  /deep/.el-table--enable-row-hover {
    .el-table__body tr:hover {
      > td.el-table__cell {
        background: #009bf9;
        opacity: 0.4;
      }
    }
  }
}

#berth-left-three {
  /deep/.el-table--enable-row-hover {
    .el-table__body tr:hover {
      > td.el-table__cell {
        background: #009bf9;
        opacity: 0.4;
      }
    }
  }
  /deep/ .el-table tr {
    height: 38.5px !important;
  }
}
.infrastructureinput {
  /deep/.el-input--prefix {
    .el-input__inner {
      border-radius: 18px;
    }
  }
}
#popup {
  height: 364px;
}
#popup-content {
  border-radius: 10px;
}
.ol-popup {
  position: absolute;
  top: -377px;
  right: -263px;
  // max-height: 364px;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2); // padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  min-width: 280px;
  // overflow: hidden;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 12px;
  right: 20px;
  font-size: 16px;
}
.popup-content-box {
  width: 310px;
  .title {
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    font-size: 16px;
    color: #2a8df0;
    background-color: #f6f6f6;
    i {
      float: right;
      margin-right: 15px;
      cursor: pointer;
    }
  }
  .content {
    height: 298px;
    padding: 10px 20px;
    border: 1px solid #e7ecf2;
  }
  .info-list {
    height: 100%;
    border: 1px solid #c5d6e3;
    overflow: auto;
    > li {
      display: flex;
      border-bottom: 1px solid #c5d6e3;
      &:nth-of-type(odd) {
        background-color: rgba(202, 233, 255, 0.3);
      }
      > span {
        padding: 5px 0;
        display: flex;
        align-items: center;
        line-height: 20px;
      }
      .label {
        width: 38%;
        padding-left: 15px;
        padding-right: 10px;
      }
      .value {
        width: 62%;
        padding-left: 5px;
        padding-right: 5px;
        white-space: wrap;
        word-break: break-all;
        border-left: 1px solid #c5d6e3;
      }
      #duanmian {
        width: 100%;
        height: 150px;
        div:first-child {
          width: 100% !important;
        }
      }
    }
    .empty {
      display: inline-block;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
  }
}
// .el-table {
//   // border: 1px solid #2a5e87;
// }
.el-table,
.el-table__expanded-cell {
  background-color: transparent !important;
}
.el-table th,
.el-table tr,
.el-table td {
  background-color: transparent !important;
}
/deep/ .el-pagination__total {
  color: #fff;
}
/deep/ .btn-prev {
  background: #608bad !important;
  i {
    color: #fff;
  }
}
/deep/ .btn-next {
  background: #608bad !important;
  i {
    color: #fff;
  }
}
/deep/ .el-pager li {
  background: #608bad !important;
  i {
    color: #fff;
  }
}
/deep/ .el-pager .number {
  background: #608bad !important;
  i {
    color: #fff;
  }
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  color: #fff;
  background-color: #009bf9 !important;
}

/deep/ .el-table__body tr.current-row > td {
  background-color: #009bf9 !important;
  color: #fff;
  // color: rgba(72, 176, 255);
}
/deep/.el-table__header-wrapper .el-table__body {
  font-size: 12px !important;
}
.titleshow {
  height: 100% !important;
}
</style>
