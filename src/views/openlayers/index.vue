<template>
  <div class="view"
    v-loading="loading"
    element-loading-text="数据加载中......"
    element-loading-background="rgba(0, 0, 0, 0.2)"
  >
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
          <div class="sonmenu" v-if="index == 4 && sonmenuShow">
            <div
              v-for="(item2, someMenuindex) in sonmueArry"
              :key="item2.id"
              :class="{ sonactive: someMenuindex == sonmueIndex }"
              @click.stop="addSomeClass(someMenuindex)"
            >
              {{ item2.name }}
            </div>
          </div>
        </div>
      </div>
      <!-- :class="rightHide ? 'hide-right' : ''" -->
    </div>
    <div
      class="r-panel"
      :class="[
        { 'hide-right': rightHide && !leftHide },
        { 'hide-left': leftHide && rightHide === false },
        { fullscreen: leftHide && rightHide },
        { 'Water-right': current == 4 },
        { 'land-planning-right': current == 6 }
      ]"
    >
      <div class="tree-container" v-if="showTree">
        <div class="left-show" @click="hideleft">
          <i
            :class="leftHide ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"
          ></i>
        </div>
        <!-- <el-button @click="hideleft">默认按钮</el-button> -->
        <div class="tree-search" v-if="current != 5">
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
          <div class="search-select" v-if="current == 1">
            <el-select
              v-model="situationOrPlan"
              placeholder=""
              @change="selectcurrentTwo"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="tree-switch" v-else>
          <div
            v-for="(item, index) in portOrShoreline"
            :key="item.id"
            :class="{ active: index === portOrShorelineIndex }"
            @click="selectPortOrShoreline(item, index)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="tree-content">
          <el-tree
            class="filter-tree"
            :data="treeData"
            :props="defaultProps"
            :default-expand-all="true"
            :default-checked-keys='checkedList'
            :filter-node-method="filterNode"
            :current-node-key="currentNodeKey"
            node-key="id"
            ref="tree"
            highlight-current
            show-checkbox
            @node-click="handleNodeClick"
            @check-change='handleCheckBox'
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
      <div class="table-container" v-else>
        <div class="left-show" @click="hideleft">
          <i
            :class="leftHide ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"
          ></i>
        </div>
        <div class="table-search" v-if="current != 5">
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
          <div class="search-select" v-if="current != 3 && current != 4">
            <el-select
              v-model="situationOrPlan"
              placeholder=""
              @change="selectcurrentTwo"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="tree-switch" v-else>
          <div
            v-for="(item, index) in portOrShoreline"
            :key="item.id"
            :class="{ active: index === portOrShorelineIndex }"
            @click="selectPortOrShoreline(item, index)"
          >
            {{ item.name }}
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
                  <span v-if="current == 3">{{ row.anchoragename }}</span>
                  <span v-else-if="current == 1">{{ row.channelname }}</span>
                  <span v-else-if="current == 4 && sonmueIndex == 1">{{
                    row.watername
                  }}</span>
                  <span v-else-if="current == 4 && sonmueIndex == 2">{{
                    row.cabinname
                  }}</span>
                  <span v-else-if="current == 5 && portOrShorelineIndex == 0">{{
                    row.workareaname
                  }}</span>
                  <span v-else-if="portOrShorelineIndex == 0">{{
                    row.anchoragename
                  }}</span>
                  <!-- <span v-else-if="current == 5">{{
                    row.workareaname
                  }}</span> -->
                </template>
              </el-table-column>
              <el-table-column
                prop="anchoragelocation"
                label="所属城市"
                min-width="100"
                align="center"
                v-if="current == 3"
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
                v-if="current == 1"
              >
                <template slot-scope="{ row }">
                  <span v-if="situationOrPlan === '现状'">{{
                    row.presentlevel
                  }}</span>
                  <span v-else>{{ row.planninglevel }}</span>
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
      <div class="gis-container">
        <div class="legend-box" :class="{ legendFold: legendFold }">
          <div class="legend-title">
            <span>图例</span><img @click="foldLegend" :src="isFold" alt="" />
          </div>
          <div class="legend-content">
            <!-- <div>
              <div>
                <img
                  :src="changeLegendImg('港口')"
                  alt=""
                  @click="featureHideOrShow('港口')"
                />
              </div>
              <span class="legend-text">港口</span>
            </div> -->
            <div>
              <div>
                <img
                  :src="changeLegendImg('码头')"
                  alt=""
                  @click="featureHideOrShow('码头')"
                />
              </div>
              <span class="legend-text">码头</span>
            </div>
            <div>
              <div>
                <img
                  :src="changeLegendImg('船闸')"
                  alt=""
                  @click="featureHideOrShow('船闸')"
                />
              </div>
              <span class="legend-text">船闸</span>
            </div>
            <div>
              <div>
                <img
                  :src="changeLegendImg('锚地')"
                  alt=""
                  @click="featureHideOrShow('锚地')"
                />
              </div>
              <span class="legend-text">锚地</span>
            </div>
            <div>
              <div>
                <img
                  :src="changeLegendImg('桥梁')"
                  alt=""
                  @click="featureHideOrShow('桥梁')"
                />
              </div>
              <span class="legend-text">桥梁</span>
            </div>
            <div>
              <div>
                <img
                  :src="changeLegendImg('服务区')"
                  alt=""
                  @click="featureHideOrShow('服务区')"
                />
              </div>
              <span class="legend-text">服务区</span>
            </div>
            <div>
              <div>
                <img
                  :src="changeLegendImg('洗舱站')"
                  alt=""
                  @click="featureHideOrShow('洗舱站')"
                />
              </div>
              <span class="legend-text">洗舱站</span>
            </div>
            <!-- <div>
              <div>
                <img
                  :src="changeLegendImg('作业区')"
                  alt=""
                  @click="featureHideOrShow('作业区')"
                />
              </div>
              <span class="legend-text">作业区</span>
            </div> -->
            <div>
              <div>
                <img
                  :src="changeLegendImg('港口')"
                  alt=""
                  @click="featureHideOrShow('港口')"
                />
              </div>
              <span class="legend-text">港口规划</span>
            </div>
            <div>
              <div>
                <img
                  :src="changeLegendImg('空间规划')"
                  alt=""
                  @click="featureHideOrShow('空间规划')"
                />
              </div>
              <span class="legend-text">空间规划</span>
            </div>
            <div>
              <div>
                <img
                  :src="changeLegendImg('航道')"
                  alt=""
                  @click="featureHideOrShow('航道')"
                />
              </div>
              <span class="legend-text">航道</span>
            </div>
          </div>
        </div>
        <div id="toolbar">
          <div
            class="tool-btn"
            :class="{ toolActive: toolIndex === 0 ? true : false }"
            @click="measure('distance')"
          >
            <div>
              <i class="iconfont icon-ceju"></i>
              <span>测距</span>
            </div>
          </div>
          <div
            class="tool-btn"
            :class="{ toolActive: toolIndex === 1 ? true : false }"
            @click="measure('area')"
          >
            <div>
              <i class="iconfont icon-mianji"></i>
              <span>测面</span>
            </div>
          </div>
          <div
            class="tool-btn"
            :class="{ toolActive: toolIndex === 2 ? true : false }"
            @click="tag"
          >
            <div>
              <i class="iconfont icon-biaoji"></i>
              <span>标记</span>
            </div>
          </div>
          <div class="tool-btn" @click="reset">
            <div>
              <i class="iconfont icon-Reset"></i>
              <span>重置</span>
            </div>
          </div>
        </div>
        <div id="container" v-show="openlayers"></div>
        <div id="container-3D" v-show="cesium"></div>
        <div class="change-btn">
          <button
            @click="
              changeMap(1)
              changeBg(0)
            "
            class="control_btn"
            :class="{ btn_selected: curSelectedIndex == 0 }"
          >
            2D平面图
          </button>
          <button
            @click="
              changeMap(2)
              changeBg(1)
            "
            class="control_btn"
            :class="{ btn_selected: curSelectedIndex == 1 }"
          >
            2D卫星图
          </button>
          <button
            @click="
              changeMap(3)
              changeBg(2)
            "
            class="control_btn"
            :class="{ btn_selected: curSelectedIndex == 2 }"
          >
            3D卫星图
          </button>
        </div>
        <!-- 所在地市 -->
        <div class="gisCity" v-if="gisCityShow">
          <el-select
            v-model="mapcity"
            @change="mapCitySelect"
          >
            <el-option
              v-for="item in portPlanCityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <!-- 所在行政 -->
        <div class="gisAdministrative" v-if='gisAdministrativeShow'>
          <el-select
            v-model="mapAdministrative"
            @change="mapAdministrativeSelect"
          >
            <el-option
              v-for="item in administrativeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <!-- 所属航道名称 -->
        <div class="gisChannelName" v-if="gisChannelNameShow">
          <el-select
            v-model="mapChannelName"
            @change="ChannelNameSelect"
          >
            <el-option
              v-for="item in ChannelNameOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <!-- 港口规划的城市select -->
        <div class="city-select" v-if="current == 6">
          <el-select
            v-model="portPlanCitySelectValue"
            @change="portPlanCityChange"
          >
            <el-option
              v-for="item in portPlanCityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="region-box" v-if="current == 6">
          <el-checkbox-group
            v-model="regionCheckList"
            @change="handleCheckChange"
          >
            <div class="el_container">
              <el-checkbox
                label="城镇开发边界"
                @change="checkboxSelected1"
              ></el-checkbox>
              <span
                class="color_block"
                style="background-color: #fc63ad"
                v-show="checkbox_Selected1"
              ></span>
            </div>
            <div class="el_container">
              <el-checkbox
                label="生态保护红线"
                @change="checkboxSelected2"
              ></el-checkbox>
              <span
                class="color_block"
                style="background-color: #fbc2cf"
                v-show="checkbox_Selected2"
              ></span>
            </div>
            <div class="el_container">
              <el-checkbox
                label="生态空间管控区"
                @change="checkboxSelected3"
              ></el-checkbox>
              <span
                class="color_block"
                style="background-color: #fbf2de"
                v-show="checkbox_Selected3"
              ></span>
            </div>
            <div class="el_container">
              <el-checkbox
                label="永久基本农田"
                @change="checkboxSelected4"
              ></el-checkbox>
              <span
                class="color_block"
                style="background-color: #fcfb72"
                v-show="checkbox_Selected4"
              ></span>
            </div>
          </el-checkbox-group>
        </div>
        <!-- 弹框 -->
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
                  <!-- 图片 -->
                  <li>
                    <div class="sceneImgBox">
                      <div class="sceneImgTitle">现场图片</div>
                      <div class="sceneImg">
                        <!-- <img src="../../assets/img/login/login_bg.png" alt=""> -->
                        <img :src="scene_Img" alt="">
                      </div>
                    </div>
                  </li>
                  <!-- 查看PDF -->
                  <li>
                    <div class="lookPDF" v-if="current == 5 && this.portOrShorelineIndex !== 1 || current == 5 && this.portOrShorelineIndex == 0">
                      <el-button type="primary" size="mini" @click="checkPDF">查看PDF</el-button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!-- 标记弹窗 -->
        <div id="tag-popup" v-show="tagpopup">
          <div id="tag-popup-title">
            添加标记
            <i
              class="iconfont icon-cha"
              id="tag-popup-close"
              @click="tagcloser"
            ></i>
          </div>
          <div id="tag-popup-content-box">
            <div>
              <span>名称</span>
              <input
                id="tag-popup-name"
                ref="taginput"
                autocomplete="off"
                v-model="tagnameinput"
              />
            </div>
            <div>
              <span>备注</span>
              <textarea
                id="tag-popup-content"
                ref="tagtextarea"
                v-model="tagnodetextarea"
              ></textarea>
            </div>
          </div>
          <div>
            <button id="tag-popup-save" @click="tagsave">保存</button>
            <button id="tag-popup-delete" @click="tagdelete">删除</button>
          </div>
        </div>
        <!-- 航道颜色图例现状 -->
        <div class="channelColor" v-if="channelshowxz">
          <div class="channeldiv">
            <div class="twochannel"></div>
            <div class="channeltitle">二 级 航 道</div>
          </div>
          <div class="channeldiv">
            <div class="threechannel"></div>
            <div class="channeltitle">三 级 航 道</div>
          </div>
          <div class="channeldiv">
            <div class="fourchannel"></div>
            <div class="channeltitle">四 级 航 道</div>
          </div>
          <div class="channeldiv">
            <div class="fivechannel"></div>
            <div class="channeltitle">五 级 航 道</div>
          </div>
          <div class="channeldiv">
            <div class="sixchannel"></div>
            <div class="channeltitle">六 级 航 道</div>
          </div>
          <div class="channeldiv">
            <div class="sevenchannel"></div>
            <div class="channeltitle">七 级 航 道</div>
          </div>
        </div>
        <!-- 航道颜色图例现状 -->
        <div class="channelColorgh" v-if="channelshowgh">
          <div class="channeldivgh">
            <div class="twochannelgh"></div>
            <div class="channeltitle">二 级 航 道</div>
          </div>
          <div class="channeldivgh">
            <div class="threechannelgh"></div>
            <div class="channeltitle">三 级 航 道</div>
          </div>
          <div class="channeldivgh">
            <div class="fourchannelgh"></div>
            <div class="channeltitle">四 级 航 道</div>
          </div>
          <div class="channeldivgh">
            <div class="fivechannelgh"></div>
            <div class="channeltitle">五 级 航 道</div>
          </div>
          <div class="channeldivgh">
            <div class="sixchannelgh"></div>
            <div class="channeltitle">六 级 航 道</div>
          </div>
          <div class="channeldivgh">
            <div class="sevenchannelgh"></div>
            <div class="channeltitle">七 级 航 道</div>
          </div>
          <div class="channeldivgh">
            <div class="eightchannelgh"></div>
            <div class="channeltitle">等外级航道</div>
          </div>
        </div>
      </div>
      <div class="statistics-container">
        <div class="right-show" @click="hideRight">
          <i
            :class="rightHide ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
          ></i>
        </div>
        <div class="statistics-title"><span>统计数据</span></div>
        <div class="statistics-content">
          <div class="statistics-block" v-if="current !== 2">
            <div 
              v-for="item in allCount"
              :key="item.num"
              :class="{ 'block-width': allCount.length == 2 }"
            >
              <p>
                <span>{{ item.num != 0 ? item.num : '-' }}</span
                ><span>{{ item.company }}</span>
              </p>
              <p>{{ item.name }}</p>
            </div>
          </div>
          <div class="statistics-block" v-else>
            <div class="block-width block-widths">
              <p>交通部门船闸</p>
            </div>
            <div class="block-width block-widths color-block">
              <p>52个</p>
            </div>
          </div>
          <div id="echarts-total-mileage"></div>
          <div id="echarts-total-model"></div>
          <div id="echarts-city-model"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { common, infrastructure, tag } from '@/api/index'
import {
  ChannelNameOption,
  administrativeOption,
  portoperationarea,
  infrastructurebridge,
  situationlock,
  situationanchorage,
  situationchannel,
  BaseBerth,
  BaseShiplock,
  BaseAnchorage,
  BaseBridge,
  BaseCabinwashing,
  BaseChannel,
  BasePortplanning,
  tBaseShoreline,
  BaseWaterservice,
  BaseWorkarea
} from '@/assets/js/localData'
import ProDetailsDialog from './components/ProDetailsDialog.vue'
import { mapState } from 'vuex'
import { NewMeasure } from '@/utils/measure-new'
import * as echarts from 'echarts'
import { Tag } from '@/utils/tag'
import Viewer from '@/components/Viewer'
import { Distinguish } from '@/utils/distinguish'
import 'ol/ol.css'
import Map from 'ol/Map'
import GeoJSON from 'ol/format/GeoJSON'
import Overlay from 'ol/Overlay'
import WMTS from 'ol/source/WMTS'
import TileWMS from 'ol/source/TileWMS'
import View from 'ol/View'
import { Point, LineString } from 'ol/geom'
import Feature from 'ol/Feature'
import TileImage from 'ol/source/TileImage'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { getWidth, getTopLeft } from 'ol/extent'
import { get as getProjection, Projection } from 'ol/proj'
import { register } from 'ol/proj/proj4'
import { Style, Fill, Icon, Stroke, Text, Circle } from 'ol/style'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import Polygon from 'ol/geom/Polygon'
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
import axios from 'axios'
import GEOJSON_CONST from '@/assets/json/yjjbnt.json' //永久基本农田JSON文件(镇江市)
import ecologicalRedLines from '@/assets/json/ecologicalRedLines.json' //国家级生态保护红线JSON文件(镇江市)
import ecospace from '@/assets/json/ecospace.json' //生态空间管控区JSON文件(镇江市)
import development from '@/assets/json/development.json' //城镇开发边界JSON文件(镇江市)
// import ycPY from '@/assets/json/YCGEOJSON.json' //永久基本农田JSON文件(盐城市)
import ycdevelopment from '@/assets/json/ycdevelopment.json' //城镇开发边界JSON文件(盐城市)
import ycecospace from '@/assets/json/ycecospace.json' //生态空间管控区JSON文件(盐城市-国家)
import ycecospace1 from '@/assets/json/ycecospace1.json' //生态空间管控区JSON文件(盐城市-省级)
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom' //禁用地图双击放大
import Measure from '@/utils/measure.js'
import channel from '@/assets/json/channel.json' //航道JSON文件
import branchchannel from '@/assets/json/branchchannel.json' //支线航道JSON文件
import anchorage from '@/assets/json/anchorage.json' //锚地JSON文件
import shiplock from '@/assets/json/shiplock.json' //船闸JSON文件
import bridge from '@/assets/json/bridge.json' //桥梁JSON文件
import service from '@/assets/json/service.json' //服务区JSON文件
import washingstation from '@/assets/json/washingstation.json' //洗舱站JSON文件
import portplanning from '@/assets/json/ycportplanning.json' //盐城港口规划(作业区)JSON文件
import tzportplanning from '@/assets/json/tzportplanning.json' //泰州港口规划(作业区)JSON文件
import JiangyanCoastline from '@/assets/json/JiangyanCoastline.json' //泰州港口规划(岸线)JSON文件
import ycJiangyanCoastline from '@/assets/json/ycJiangyanCoastline.json' //盐城港口规划(岸线)JSON文件

// import WorkZone from "@/assets/json/SituationalDetection/WorkZone.json" //作业区JSON文件
import changzhouharbor from '@/assets/json/wharf/changzhouharbor.json' //码头常州港JSON文件
import jiangyinharbor from '@/assets/json/wharf/jiangyinharbor.json' //码头江阴港JSON文件
import lianyungangharbor from '@/assets/json/wharf/lianyungangharbor.json' //码头连云港港JSON文件
import nanjingharbor from '@/assets/json/wharf/nanjingharbor.json' //码头南京港JSON文件
import nantongcoastalharbor from '@/assets/json/wharf/nantongcoastalharbor.json' //码头南通沿海JSON文件
import nantongharbor from '@/assets/json/wharf/nantongharbor.json' //码头南通JSON文件
import suzhouharbor from '@/assets/json/wharf/suzhouharbor.json' //码头苏州JSON文件
import taizhouharbor from '@/assets/json/wharf/taizhouharbor.json' //码头泰州JSON文件
import yanchengcoastalharbor from '@/assets/json/wharf/yanchengcoastalharbor.json' //码头盐城沿海JSON文件
import yangzhouharbor from '@/assets/json/wharf/yangzhouharbor.json' //码头扬州JSON文件
import zhenjiangharbor from '@/assets/json/wharf/zhenjiangharbor.json' //码头镇江JSON文件
import TZNeiheHarbor from '@/assets/json/wharf/TZNeiheHarbor.json' //码头内河镇江JSON文件
import YCNeiheHarbor from '@/assets/json/wharf/YCNeiheHarbor.json' //码头内河盐城JSON文件
import { fromLonLat } from 'ol/proj.js'
let viewer = null
let tilesetGL = null
let highTile = null // 当前高亮3dtiles
let tileVisibleFn = null
// let Measure = null;
let Mark = null
let Distinguishing = null
let componentPopupPosition = null
let anonymous = null
let map = null
let view = null
let vectorSource = null
let vectorLayer = null
let highVectorSource = null
let highVectorLayer = null
let build = null
let lineFeature = null
let helpTooltipElement = null
let feature = null
let helpTooltip = null
let draw = null
let measureTooltipElement = null
let measureTooltip = null
let listener = null
let mapMouseMove = null
let polygonyjjbnt = null //永久基本农田(镇江)
let ycpolygonyjjbnt = null ////永久基本农田(盐城)
let polygonecologicalRedLines = null //国家级生态保护红线
let polygonecospace = null //生态空间管控区(镇江)
let ycpolygonecospace = null //生态空间管控区(盐城-国家)
let ycpolygonecospace1 = null //生态空间管控区(盐城-省级)
let polygondevelopment = null //城镇开发边界(镇江)
let ycpolygondevelopment = null //城镇开发边界(盐城)
let polygonchannel = null //航道现状图层
let polygonchannelplan = null //航道规划图层
let linebranchchannel = null //支线航道现状图层
let linebranchchannelplan = null //支线航道规划图层
let polygonanchorage = null //锚地图层
let pointshiplock = null //船闸图层
let pointbridge = null //桥梁图层
let polygonworkzone = null //盐城作业区图层
let tzpolygonworkzone = null //盐城作业区图层
let linechangzhou = null //码头常州图层
let linejiangyin = null //码头江阴港图层
let linelianyungang = null //码头连云港图层
let linenanjing = null //码头南京图层
let linenantongcoastal = null //码头南通沿海图层
let linenantong = null //码头南通图层
let linesuzhou = null //码头苏州图层
let linetaizhou = null //码头泰州图层
let lineyanchengcoastal = null //码头盐城沿海图层
let lineyangzhou = null //码头扬州图层
let linezhengjiang = null //码头镇江图层
let pointservice = null // 服务区图层
let pointwashing = null //洗舱站图层
let linecoastline = null //姜堰岸线图层
let yclinecoastline = null //盐城岸线图层
let pointtaizhouNeihe = null //码头泰州内河图层
let pointyanchengNeihe = null //码头盐城内河图层
let sonmueIndex = 0
// let maptype = 2
export default {

  props: {
    // 弹框标题
    title: {
      type: String,
      default: '项目基本信息'
    },
    // 控制弹框显隐
    visible: {
      type: Boolean,
      default: false
    }
    // 显示内容
  },
  name: 'openlayers',
  components: {
    ProDetailsDialog
  },
  data() {
    return {
      fullscreenLoading: false,
      maptype: 2,
      tagnameinput: '',
      tagnodetextarea: '',
      pointsignSource: null, //标记数据源
      pointsignLayer: null, //标记图层
      polygondevelopment: null, //城镇开发边界图层(镇江市)
      ycpolygondevelopment :null, //城镇开发边界图层(盐城市)
      polygonecospace: null, //生态空间管控区图层(镇江市)
      ycpolygonecospace: null, //生态空间管控区图层(盐城市-国家)
      ycpolygonecospace1: null, //生态空间管控区图层(盐城市-省级)
      polygonecologicalRedLines: null, //国家级生态保护红线图层
      polygonyjjbnt: null, //永久基本农田图层(镇江市)
      ycpolygonyjjbnt: null,//永久基本农田图层(盐城市)
      polygonchannel: null, //航道现状图层
      polygonchannelplan: null, //航道规划图层
      linebranchchannel: null, //支线航道现状图层
      linebranchchannelplan:null, //支线航道规划图层
      polygonanchorage: null, //锚地图层
      pointshiplock: null, //船闸图层
      pointbridge: null, //桥梁图层
      pointservice: null, //服务区图层
      linecoastline: null, //姜堰岸线图层
      yclinecoastline: null, //盐城岸线图层
      pointwashing: null, //洗舱站图层
      polygonworkzone: null, //作业区图层
      tzpolygonworkzone:null,//泰州作业区
      linechangzhou: null, //码头常州港图层
      linejiangyin: null, //码头江阴港图层
      linelianyungang: null, //码头连云港图层
      linenanjing: null, //码头南京图层
      linenantongcoastal: null, //码头南通沿海图层
      linenantong: null, //码头南通图层
      linesuzhou: null, //码头苏州图层
      linetaizhou: null, //码头泰州图层
      lineyanchengcoastal: null, //码头盐城沿海图层
      lineyangzhou: null, //码头扬州图层
      linezhengjiang: null, //码头镇江图层
      pointtaizhouNeihe: null, //码头内河泰州图层
      pointyanchengNeihe :null, //码头内河盐城图层
      positionLayer: null, //点图层
      positionSource: null, //点数据源
      map: null, //map图层
      parser: null,
      layer: null, //地图图层
      toolIndex: null,
      buildyLayer: null,
      build: null,
      clickObj: {},
      detailLabel: [],
      baseShiplock: [],
      mapFlag: true,
      detailsData: [],
      menuData: [
        {
          name: '码头',
          img: require('../../assets/img/framework/wharf.png')
        },
        {
          name: '航道',
          img: require('../../assets/img/framework/wharf.png')
        },
        {
          name: '船闸',
          img: require('../../assets/img/framework/navigationlock.png')
        },
        {
          name: '锚地',
          img: require('../../assets/img/framework/anchorage.png')
        },
        {
          name: '其他',
          img: require('../../assets/img/framework/other.png')
        },
        {
          name: '港口规划',
          img: require('../../assets/img/framework/port.png')
        },
        {
          name: '国土规划',
          img: require('../../assets/img/framework/land.png')
        }
      ],
      portOrShoreline: [
        {
          id: 1,
          name: '作业区'
        },
        {
          id: 2,
          name: '岸线'
        }
      ],
      portOrShorelineIndex: 1,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      filterText: '', //树状图的模糊查询字段
      treeData: [],
      current: 0,
      options: [
        {
          value: '现状',
          label: '现状'
        },
        {
          value: '规划',
          label: '规划'
        }
      ],
      checkbox_Selected1: true,
      checkbox_Selected2: true,
      checkbox_Selected3: true,
      checkbox_Selected4: true,
      curSelectedIndex: 0,
      sonmenuShow: false,
      sonmueIndex: 0,
      situationOrPlan: '现状',
      rightHide: false,
      rightHideFlag: true,
      leftHide: false,
      leftHideFlag: true,
      tableData: [],
      showTree: true,
      tablequery: '',
      total: 0, //分页
      pagesize: 18, //分页
      pageno: 1, //分页
      detailsDialogVisible: false, // 项目基本信息弹框显隐
      tagpopup: false, // 标记弹窗现隐
      deletetag:null,//删除标记feature
      detailsDialogField: [],
      popTitle: '基本信息', // 弹框名称
      highProId: '', // 当前高亮的项目id
      radius: 1,
      legendFold: false, // 图例窗口折叠开关
      listFold: true, // 项目列表窗口折叠开关
      cesium: false, //cesium地图
      openlayers: true, //openlayers 地图
      // clickObj: false, //弹窗
      popupField: [
        {
          label: '城市',
          value: '扬州市'
        },
        {
          label: '泊位',
          value: '海轮泊位'
        }
      ],
      currentRow: null,
      allCount: [],
      sonmueArry: [
        {
          name: '桥梁',
          id: 'son1'
        },
        {
          name: '服务区',
          id: 'son2'
        },
        {
          name: '洗舱站',
          id: 'son3'
        }
      ],
      iconImgs: {
        // 补水站: 'waterStation',
        // 地涵: 'culvert',
        港口: 'port',
        码头: 'wharf',
        船闸: 'navigationLock',
        锚地: 'anchorage',
        桥梁: 'bridge',
        服务区: 'serviceArea',
        洗舱站: 'cabinWashingStation',
        作业区: 'operationArea',
        港区: 'portArea',
        空间规划: 'spatialPlanning',
        航道: 'channel',
        // 水闸: 'sluice',
        // 泵站: 'pumpingStation',
        一级航道: '#00e4ff',
        二级航道: '#16b568',
        // 三级航道: '#9d77e5',
        三级航道: '#ff0000',
        四级航道: '#184fa2'
      },
      totalMileageCharts: null, // 入库项目总里程柱状图
      totalModelCharts: null, // 入库BIM模型数柱状图
      cityModelCharts: null, // 各市BIM模型数折线图
      cityModelCharts: null, // 各市BIM模型数折线图
      cityModelCharts: null, // 各市BIM模型数折线图
      legendFlag: {
        港口: false,
        码头: true,
        船闸: false,
        锚地: false,
        桥梁: false,
        服务区: false,
        洗舱站: false,
        作业区: false,
        港区: false,
        空间规划: false,
        航道: false
        // 补水站: true,
        // 船闸: true,
        // 地涵: true,
        // 锚地: true,
        // 桥梁: true,
        // 水闸: true,
        // 泵站: true
      },
      portPlanCityOptions: [
        {
          value: '全省',
          label: '全省'
        },
        {
          value: '南京市',
          label: '南京市'
        },
        {
          value: '苏州市',
          label: '苏州市'
        },
        {
          value: '无锡市',
          label: '无锡市'
        },
        {
          value: '常州市',
          label: '常州市'
        },
        {
          value: '镇江市',
          label: '镇江市'
        },
        {
          value: '扬州市',
          label: '扬州市'
        },
        {
          value: '泰州市',
          label: '泰州市'
        },
        {
          value: '南通市',
          label: '南通市'
        },
        {
          value: '淮安市',
          label: '淮安市'
        },
        {
          value: '连云港',
          label: '连云港'
        },
        {
          value: '盐城市',
          label: '盐城市'
        },
        {
          value: '徐州市',
          label: '徐州市'
        },
        {
          value: '宿迁市',
          label: '宿迁市'
        }
      ],
      portPlanCitySelectValue: '全省',
      regionCheckList: [
        '城镇开发边界',
        '生态保护红线',
        '生态空间管控区',
        '永久基本农田'
      ],
      regionCheckList1: [
        '城镇开发边界',
        '生态保护红线',
        '生态空间管控区',
        '永久基本农田'
      ],
      regionCheckList2: [],
      berthArry: [],
      berthArryship: [],
      drawLayers: [],
      drawElements: [],
      overlay: new Overlay({
        element: document.getElementById('popup'),
        autoPan: {
          animation: {
            duration: 250
          }
        }
      }),
      jsonall: [], //json图层数组
      measureType1: '',
      measureType2: '',
      tagname: null,
      tagtextarea: null,
      MarkID: null,
      markx: null,
      marky: null,
      markdeleteid: null,
      lefttulie: true,
      typecurrent: '',
      fourindex: 0,
      // wmtsUrl_1:"",
      img: null, //影像图层
      img_ibo: null, //影像图层
      img_cia: null, //影像图层
      tableDataAll: [],
      tableid: '',
      bioajiAll: [], //标记数组
      channelshowxz: false, //现状图裂
      channelshowgh: false, //规划图裂
      currentNodeKey:'',
      mapcity:"全省",
      mapAdministrative:'全省',
      mapChannelName:'全省',
      gisCityShow:false,
      gisAdministrativeShow:false,
      gisChannelNameShow:false,
      scene_Img:'',
      pdfUrl:'',
      checkedList:[],
      loading: true,
      ischecked:true,
      // treeid:"objectid",
    }
  },
  // created(){
  //   this.currentNodeKey = id;
  //   this.$nextTick(()=>{
  //     this.$refs.tree.setCurrentKey(this.currentNodeKey)
  //   })
  // },
  mounted() {
    this.detailLabel = BaseBerth
    this.initMap()
    this.echartsInit()
    this.windowResize()
    this.getWharfTree()
    this.getWharfAllCount()
    this.getWharfCount()
    this.getWharfType()
    this.getWharfGrade()
    this.getMarkList()
    this.getAllBaseBerth() // 码头树形图全部信息
    this.getAllChannelTable()

    // this.loadingFunction()
    // map.updateSize()
  },
  // 销毁释放内存
  destroyed() {
    if (viewer) {
      viewer.dataSources.removeAll(true)
      viewer.destroy()
    }
    if (map) {
      if (vectorSource) vectorSource.clear()
      if (vectorLayer) map.removeLayer(vectorLayer)
      if (highVectorSource) highVectorSource.clear()
      if (highVectorLayer) map.removeLayer(highVectorLayer)
    }
    viewer = null
    highTile = null
    tilesetGL = null
    tileVisibleFn = null
    componentPopupPosition = null
    anonymous = null
    map = null
    view = null
    vectorSource = null
    vectorLayer = null
    highVectorSource = null
    highVectorLayer = null
    polygonyjjbnt = null
    ycpolygonyjjbnt = null
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar
    }),
    isFold() {
      if (!this.legendFold)
        // 折叠
        return require('@/assets/img/overview/icon_fold.png')
      if (this.legendFold)
        // 展开
        return require('@/assets/img/overview/icon_open.png')
    },
    administrativeOption(){
      return [...administrativeOption]
    },
    ChannelNameOption(){
      return [...ChannelNameOption]
    }
  },
  watch: {
    'sidebar.opened'() {
      setTimeout(() => {
        this.echartsResize()
        if (map) map.updateSize()
      }, 200)
    },
    filterText(val) {
      // this.$refs.tree.filter(val)
      console.log(this.filterText);
      if(this.current == 0){
        // 码头
        this.getWharfTree()
      }else if(this.current == 1){
        // 航道
        this.getChannelTable()
      }else if(this.current == 2){
        // 船闸
        this.getShipLockTree()
      } else if(this.current == 3){
        // 锚地
        this.getAllAnchorage()
      }else if(this.current == 4 && this.sonmueIndex == 0 || this.current == 4){
        // 桥梁
        this.getBridgeTree()
      }
    },
    rightHide(val) {
      setTimeout(() => {
        this.echartsResize()
        if (map) {
          map.updateSize()
        }
      }, 1000)
    },
    leftHide(val) {
      setTimeout(() => {
        this.echartsResize()
        if (map) {
          map.updateSize()
        }
      }, 1000)
    },
    current(val) {
      // if (map) map.updateSize()
      if (val === 4) {
        setTimeout(() => {
          this.echartsResize()
          if (map) map.updateSize()
        }, 1000)
      }
    }
  },
  // 4.19 获取全部项目接口
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
    // 航道JSON
    // 多选框选中事件
    checkboxSelected1(e) {
      this.checkbox_Selected1 = e
    },
    checkboxSelected2(e) {
      this.checkbox_Selected2 = e
    },
    checkboxSelected3(e) {
      this.checkbox_Selected3 = e
    },
    checkboxSelected4(e) {
      this.checkbox_Selected4 = e
    },
    // 右侧按钮点击变色
    changeBg(index) {
      console.log(111)
      this.curSelectedIndex = index
    },
    // 关闭弹框
    closePopup() {
      // console.log(this.detailsData)
      this.detailsDialogVisible = false
    },
    // 点击事件（切换2d、3d）
    changeMap(type) {
      // viewer.scene.mode = type
      // var tdtToken = ''
      // // 服务域名
      // var tdtUrl = 'https://t{s}.tianditu.gov.cn/';
      // 服务负载子域
      this.toolIndex = null
      var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
      var layer
      let projection = getProjection('EPSG:4326')
      let projectionExtent = projection.getExtent()
      if (type === 1) {
        this.openlayers = true
        this.cesium = false
        this.img.setVisible(false)
      } else if (type == 3) {
        this.openlayers = false
        this.cesium = true
        this.init3DMap()
        this.img.setVisible(false)
      } else if (type == 2) {
        this.openlayers = true
        this.cesium = false
        this.img = new TileLayer({
          source: new XYZ({
            url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=237e34c50a090cc10e304c42326b13ca',
            zIndex: 1
          })
        })
        map.addLayer(this.img)
      }
    },
    // 加载江苏省边界geoJson
    loadBoundaryGeoJson() {
      common.loadGeoJson('/geoJson/江苏省边界.json').then((res) => {
        let promise = Cesium.GeoJsonDataSource.load(res, {
          stroke: Cesium.Color.fromBytes(49, 150, 255, 255),
          fill: Cesium.Color.fromBytes(194, 219, 245, 0),
          strokeWidth: 4.0
        })
        promise.then(function (dataSource) {
          viewer.dataSources.add(dataSource)
          let entities = dataSource.entities.values
          //可对单个实体进行设置
          for (var i = 0; i < entities.length; i++) {
            let entity = entities[i]
            let name = entity.name
            entity.polygon.height = 100
            if (entity.properties.X && entity.properties.Y && name) {
              const lng = entity.properties.X
              const lat = entity.properties.Y
              entity.position = Cesium.Cartesian3.fromDegrees(lng, lat, 2001)
              entity.label = new Cesium.LabelGraphics({
                show: true,
                text: name,
                color: Cesium.Color.fromCssColorString('#fff'),
                scale: 0.5, //这里非常巧妙的先将字体大小放大一倍在缩小一倍
                font: 'normal 28px MicroSoft YaHei',
                style: Cesium.LabelStyle.FILL,
                fillColor: Cesium.Color.BLACK
              })
              // entity.polygon.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(
              //   800
              // )
            }
          }
        })
      })
    },
    // 图例控制feature显隐
    featureHideOrShow(type) {
      let typecurrent
      this.legendFlag[type] = !this.legendFlag[type]
      if (type === '码头' && !this.legendFlag[type]) {
        // this.lineLayerWhart.setVisible(false)
        this.WharfJsonHide()
      } else if (type === '码头' && this.legendFlag[type]) {
        // this.lineLayerWhart.setVisible(true)
        this.WharfJsonShow()
      } else if (type === '船闸' && !this.legendFlag[type]) {
        pointshiplock.setVisible(false)
      } else if (type === '船闸' && this.legendFlag[type]) {
        pointshiplock.setVisible(true)
      } else if (type === '桥梁' && !this.legendFlag[type]) {
        pointbridge.setVisible(false)
      } else if (type === '桥梁' && this.legendFlag[type]) {
        pointbridge.setVisible(true)
      } else if (type === '洗舱站' && !this.legendFlag[type]) {
        // this.positionLayercab.setVisible(false)
        pointwashing.setVisible(false)
      } else if (type === '洗舱站' && this.legendFlag[type]) {
        // this.positionLayercab.setVisible(true)
        pointwashing.setVisible(true)
      } else if (type === '港口' && !this.legendFlag[type]) {
        // this.lineLayershoreline.setVisible(false)
        linecoastline.setVisible(false)
        yclinecoastline.setVisible(false)
        polygonworkzone.setVisible(false)
        tzpolygonworkzone.setVisible(false)
      } else if (type === '港口' && this.legendFlag[type]) {
        // this.lineLayershoreline.setVisible(true)
        linecoastline.setVisible(true)
        yclinecoastline.setVisible(true)
        polygonworkzone.setVisible(true)
        tzpolygonworkzone.setVisible(true)
      } else if (type === '航道' && !this.legendFlag[type]) {
        polygonchannel.setVisible(false)
        polygonchannelplan.setVisible(false)
        linebranchchannel.setVisible(false)
        linebranchchannelplan.setVisible(false)
      } else if (type === '航道' && this.legendFlag[type]) {
        polygonchannel.setVisible(true)
        polygonchannelplan.setVisible(false)
        linebranchchannel.setVisible(true)
        linebranchchannelplan.setVisible(false)
      } else if (type === '锚地' && !this.legendFlag[type]) {
        polygonanchorage.setVisible(false)
      } else if (type === '锚地' && this.legendFlag[type]) {
        polygonanchorage.setVisible(true)
      } else if (type === '服务区' && !this.legendFlag[type]) {
        pointservice.setVisible(false)
      } else if (type === '服务区' && this.legendFlag[type]) {
        pointservice.setVisible(true)
      } else if (type === '空间规划' && !this.legendFlag[type]) {
        polygonyjjbnt.setVisible(false)
        polygonecologicalRedLines.setVisible(false)
        polygonecospace.setVisible(false)
        polygondevelopment.setVisible(false)
        this.ycisshow()
      } else if (type === '空间规划' && this.legendFlag[type]) {
        polygonyjjbnt.setVisible(true)
        polygonecologicalRedLines.setVisible(true)
        polygonecospace.setVisible(true)
        polygondevelopment.setVisible(true)
        this.ycshow()
      }
      this.lefttulie = false
      this.changeLegendImg(type, this.lefttulie)
    },
    // 获取项目JSON文件
    async getProjectJsonFiles(proids) {
      const result = await common.getProjectJsonFiles({ proids: proids })
      if (result.status === 200)
        result.res.docinfos.results.forEach((i) => {
          this.loadGeoJson(i.docsource, i.epsg)
        })
    },
    // 图例图片切换
    changeLegendImg(type, lefttulie) {
      let typecurrent
      if (this.sonmueIndex == '1') {
        this.typecurrent = '服务区'
      } else if (this.sonmueIndex == '2') {
        this.typecurrent = '洗舱站'
      } else if (this.current == '0') {
        this.typecurrent = '码头'
      } else if (this.current == '1') {
        this.typecurrent = '航道'
      } else if (this.current == '2') {
        this.typecurrent = '船闸'
      } else if (this.current == '3') {
        this.typecurrent = '锚地'
      } else if (this.current == '4') {
        this.typecurrent = '桥梁'
      } else if (this.current == '5') {
        this.typecurrent = '港口'
      } else if (this.current == '6') {
        this.typecurrent = '空间规划'
      }
      if (this.lefttulie) {
        if (this.typecurrent == type) {
          return require(`@/assets/img/gisIcon/${this.iconImgs[type]}.png`)
        } else {
          return require(`@/assets/img/gisIcon/${this.iconImgs[type]}-grey.png`)
        }
      } else {
        if (this.legendFlag[type]) {
          return require(`@/assets/img/gisIcon/${this.iconImgs[type]}.png`)
        } else {
          return require(`@/assets/img/gisIcon/${this.iconImgs[type]}-grey.png`)
        }
      }
    },
    // 图例展开|收起
    foldLegend() {
      this.legendFold = !this.legendFold
    },
    // 项目列表展开|收起
    foldList() {
      this.listFold = !this.listFold
    },
    // 工具-测量
    measure(type) {
      // console.log(this.toolDefault())
      switch (type) {
        case 'distance':
          this.toolIndex = 0
          break
        case 'area':
          this.toolIndex = 1
          break
      }
      this.toolLastIndex = this.toolIndex
      // console.log(this.toolLastIndex);
      if (this.toolLastIndex == 0) {
        this.measureType2 = 'LineString'
        // Measure.measure(map ,this.measureType2);
        Measure.clearDraw(this.map)
        this.isLengthMeasuring = true
        this.isTrendLengthMeasuring = false
        this.isAreaMeasuring = false
        this.spaceVisible = false
        this.visible = false
        // this.clearTrendMeasure()
        Measure.measure(map, 'LineString', () => {
          this.isLengthMeasuring = false
        })
      } else {
        this.measureType1 = 'Polygon'
        // Measure.measure(map, this.measureType1);
        Measure.clearDraw(this.map)
        this.isAreaMeasuring = true
        this.isTrendLengthMeasuring = false
        this.isLengthMeasuring = false
        this.visible = false
        this.spaceVisible = false
        // this.clearTrendMeasure()
        Measure.measure(map, 'Polygon', () => {
          this.isAreaMeasuring = false
        })
      }
    },

    // 工具-标记
    tag() {
      this.toolIndex = 2
      this.toolLastIndex = 2
      // 工具栏-标记
      // Mark.tagging()
    },

    // 工具-重置
    reset() {
      view.setCenter([119.489064142175, 32.9653877905019])
      view.setZoom(8)
      this.detailsDialogVisible = false
      this.tagpopup = false
      this.toolIndex = null
    },
    // 2D 地图
    initMap() {
      console.log(this.maptype)
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
      // 标记点的图层
      this.pointsignSource = new VectorSource()
      this.pointsignLayer = new VectorLayer({
        source: this.pointsignSource
      })

      map = new Map({
        layers: [
          tdLayer,
          identification,
          this.pointsignLayer
          // this.positionLayercab,
          // this.lineLayerWhart,
          // this.lineLayershoreline
        ],
        target: 'container',
        view
      })
      // 禁用地图双击放大
      const dblClickInteraction = map
        .getInteractions()
        .getArray()
        .find((interaction) => {
          return interaction instanceof DoubleClickZoom
        })
      map.removeInteraction(dblClickInteraction)
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
      // 码头常州港图层
      ;(linechangzhou = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(changzhouharbor)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0,128,0,0.8)',
            width: 4
          })
        }),
        visible: true,
        zIndex: 11
      })),
        map.addLayer(linechangzhou)
      // 码头江阴港图层
      ;(linejiangyin = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(jiangyinharbor)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0,128,0,0.8)',
            width: 4
          })
        }),
        visible: true,
        zIndex: 11
      })),
        map.addLayer(linejiangyin)
      // 码头连云港图层
      ;(linelianyungang = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(lianyungangharbor)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0,128,0,0.8)',
            width: 4
          })
        }),
        visible: true,
        zIndex: 11
      })),
        map.addLayer(linelianyungang)
      // 码头南京图层
      ;(linenanjing = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(nanjingharbor)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0,128,0,0.8)',
            width: 4
          })
        }),
        visible: true,
        zIndex: 11
      })),
        map.addLayer(linenanjing)
      // 码头南通沿海图层
      ;(linenantongcoastal = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(nantongcoastalharbor)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0,128,0,0.8)',
            width: 4
          })
        }),
        visible: true,
        zIndex: 11
      })),
        map.addLayer(linenantongcoastal)
      // 码头南通图层
      ;(linenantong = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(nantongharbor)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0,128,0,0.8)',
            width: 4
          })
        }),
        visible: true,
        zIndex: 11
      })),
        map.addLayer(linenantong)
      // 码头苏州图层
      ;(linesuzhou = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(suzhouharbor)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0,128,0,0.8)',
            width: 4
          })
        }),
        visible: true,
        zIndex: 11
      })),
        map.addLayer(linesuzhou)
      // 码头泰州图层
      ;(linetaizhou = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(taizhouharbor)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0,128,0,0.8)',
            width: 4
          })
        }),
        visible: true,
        zIndex: 11
      })),
        map.addLayer(linetaizhou)
      // 码头盐城沿海图层
      ;(lineyanchengcoastal = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(yanchengcoastalharbor)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0,128,0,0.8)',
            width: 4
          })
        }),
        visible: true,
        zIndex: 11
      })),
        map.addLayer(lineyanchengcoastal)
      // 码头扬州图层
      ;(lineyangzhou = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(yangzhouharbor)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0,128,0,0.8)',
            width: 4
          })
        }),
        visible: true,
        zIndex: 11
      })),
        map.addLayer(lineyangzhou)
      // 码头镇江图层
      ;(linezhengjiang = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(zhenjiangharbor)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0,128,0,0.8)',
            width: 4
          })
        }),
        visible: true,
        zIndex: 11
      })),
       map.addLayer(linezhengjiang)
      // 码头内河图层
      // 码头泰州内河图层
      ;(pointtaizhouNeihe = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(TZNeiheHarbor)
        }),
        // style:null,
        style: new Style({
          // image: new Icon({
          //   scale: 0.8,
          //   src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwpJREFUeNqMVElPU2EUPX1tKVDsQCktFEMZkmrYiRgGTdSlCikKrtzqAo2KCwzGrUNkY0yMif4AE5kqka0LUSFAIHEDOFEIY1VapkLH573P1+GVoN7k5JvuOe/e77vvqk7dmEamvX3syqLBLaOOUEwIExYIk4R+wuvTN2fC5KvgqjIFyaGZhkeESvzdvhJuE/rSNzVpQmoa7hM6eD23EsbgSABjU9tY+hWRfIotWtQc1uNsrQml9iz+YK/88TuEmEIwIRaKiHjm8eHNcADxuDKkudWwhL53fjQ1mNHmtkKjVnXIxxwtBDm6FhaLxkTcfbGAgQ97xdKNzzxDfnQ+XwRz5KxapDsURZEf4Buh5EmvT3LMtMXvE9LoKD+y58x93ITrLTbJjVDOKbeymHclRJEpxdZ8s1hb9cL/wyutd4LrsNjKYLY6kz4DHwNoIlGnXeeg5UVBLg0MDq8r0gztbGBuZgTarGxUVJ2UoNHq4J0eRiQUVKTP3ETAHGENz8antxXRxWJRiqQUpa46bAVW6XJUcLrqIbICzdNtLMU9yoJ2niVKIz3CDf8SJodeIhrZ/VNjFCEjuLkGo8WR9F36meQWCfIfAFFUXvb8l1ES3UyKsUUjIewGNzA79V7hq9WkImbBZaloC7QKJ4O5eN+yMRWUKNY2c5K7zIKfeFZzSL+HpKK7KrBXQlBrIAhqWOwVUAkCzIVOhW+1KzcxHec79HBRnqk1op9qMPHSeUYbDlYe48tAXIxDo8mCLseAHL0JuXnmVIoUEnNl83CE3dxFyop0aKo3pR5ld4tErcjONSKfXtuQ7yAxIw6Y7NjZCiT9GonDXLmwuzVyC7pFi1dtzYWY94Ux8TmIPIMV/7Jqlx5XiSNbO8ch/cskylF20Y+Oe5dL0Nhgyiw1Zc+jM/cJMx5ccXBz4K0uOVNFt+kk5Oi0qmvtrTacJwJ3nFFqX8tUo0y052ulBzhXJ7WvBO+pzN23wV6g4eF/NlgW6knfFDK9KH1umlWES3ID5c4QkeGV9/isinx7Mvm/BRgAmoIOhl2lilgAAAAASUVORK5CYII='
          // })
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({
              color: "rgba(0,128,0,0.7)"
            })
          })
        }),
        visible: true,
        zIndex: 11
      })),
       map.addLayer(pointtaizhouNeihe)
       // 码头盐城内河图层
      ;(pointyanchengNeihe = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(YCNeiheHarbor)
        }),
        style: new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({
              color: "rgba(0,128,0,0.7)"
            })
          })
        }),
        visible: true,
        zIndex: 11
      })),
       map.addLayer(pointyanchengNeihe)
        
      // 姜堰岸线图层
      ;(linecoastline = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(JiangyanCoastline)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 4
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(linecoastline)
        // 盐城岸线图层
      ;(yclinecoastline = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(ycJiangyanCoastline)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 4
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(yclinecoastline)
      // 盐城港口规划(作业区)图层
      ;(polygonworkzone = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(portplanning)
        }),
        style: new Style({
          fill: new Fill({
            color: 'rgba(0,0,255,0.7)'
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(polygonworkzone)
        // 泰州港口规划(作业区)图层
      ;(tzpolygonworkzone = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(tzportplanning)
        }),
        style: new Style({
          fill: new Fill({
            color: 'rgba(0,0,255,0.7)'
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(tzpolygonworkzone)
      // 桥梁图层
      ;(pointbridge = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(bridge)
        }),
        style: new Style({
          image: new Icon({
            scale: 0.8,
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAphJREFUeNqUVFtLVFEU/s7M6ISUqWFkWZZa0O2ppprnCoKJMro8CQpFdJmICrLTD2gq6fKgFNFD71rZBTHoPexCEBhRFgaWldGDotZMM6dv7b3PnDMzFTMLvn32WXutb6+99trLcs6gUBJOOccWgyixkEgSo8RL4i5xD7aVpG2Oq1VAmHB2cbxINOP/Mkx0EHf8ypCPKMjxHHFa/X97DTy7CbwdAH580DY1jcCKbUDkADB/lWx422x+lkjnRphwLiiy1AzQfwp4egPIpP8eW4B7bzwMxC4BQcmOIu3wCBPOHo49SDNNt2I8zGMUJcu3Am0PXdK9RK/lOOoC3hP1uH8MeNKFkiR6FNihfD4RjQHDXI+vQ8DgNZQsg9ehfIFFxL6QKQ19ASZn/Yx3OgWUcTvLYsos7ZthhUiRJGlWUcYUNkH7iO/2K2LSIoQRZf3uUXbThrnA50mgMkwCMgQDWp/OSNb1ZnWzfVFKJUARrhfCBUrplgZlgBF+nGAUXP2Z1hGJlAc1fpN4SSWwcp5x8HzrQuYFhFUoRr5MaaeJpD7ymlqtH/rukY9O+iLUt5wt7DFijira8TdKGaZ2iseqrQDi6/RXZHwa6Hqhv7NCPsLqBnc2Jtl5pabyAtwTzOhv+1qPTETmovPbKGne4s6eC2Gfmkb26xcg3DXAYuZoWVVhlYhO1sQm+2rkKWrpyyvsOAu7u7Q63HQE2NntFnZTQLUg4KRajF2manPxZPL0dP2JnCB+6QqzrR6Oneq22h7w4R/i9Qb+TSRr0bj/HXeqXpDXbSSBV4l4tn1Jx3HblzhWL9UXsOGgtC+XXs57vLB9eX1xN8fzRTZYWzpMTmcrMLMtaZqriVbTQEeIlMGI0bUqG9vqzXf/I8AAVynJagNCPsoAAAAASUVORK5CYII=',
            anchor: [0.48, 0.52]
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(pointbridge)
      // 船闸图层
      ;(pointshiplock = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(shiplock)
        }),
        style: new Style({
          image: new Icon({
            scale: 0.8,
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxFJREFUeNqUVF1Ik2EUfr7PbZriunCzZv7RSmsLTNML034MioxMIxXMbvsDDerCKIIgIiJv9cbLIIK00tQCocJ+vNFUTOlHhc2/LbZQDP/m3Drn9fvmnEzqwLP37H3Peb5zznveI138chyh0pDVoaOlREEuIYHgIUwQ+ggvCS2Xek94yHadrxRKSAZnaXlE2IXNZYRwk/AieFMTRBRBywNCDf93LNrx0f0GQ7M9cC05hI0x0gSrPhuHDIUwRaXwB58rH79NWFlHqJIt+5bwbLKByNrh8/vWheRYHBN452rGEUMRyhIvQyNpapRjjhayEl0pk3n9XtSN3kWnq3UDWbDw2XtXC9neAfsoWZWKGvr9fr6AUULi0/F6Yfg/UmA8g4qkKlYnCTs5wjImm6Kadbpb4Rz+ja4n/RjusmPhzxImhn7B61kJS9jpbgP7kuwglMtKa+ATXQCn8rXjJ+ZmFmDrm8Knx70Y/myHRhexafrsq0gJE+awxrfJoovWrvaTLK06+Pxw2aaFvjTvwYp3Y20HZ7tVNZtveTtramt45pcDhH4i86340N/+HXpjjCDLrdi/gdCt+JKYZOUFkPjFr6XAjOitUfApkcgRohEw65rDItVUkjamHSFpAzpbC3oDNa2orCUeByszkZxhEmQcoSocYV/bN7jt03D8cAX243TxgVbllAcIafv0OXAujq+mS1Gk56ciNTMBYwNO2Hon19KzzwiI/NKNYt2rz1KPezjCZtby4k5CluR1qUTG6LA7N5nqloEUilgbtfaw1FKwT35cobrdHNLYddTYr8K2CNdw8O0IZSAhLS8FsYYYHDUW4XxStdrYZplHECk3eKcs8Qr2xGaGJYyKjUR2iRUHii2CzEKplideVY+vc2eJuIm0kZZaeuioNt+jh38aEqSwxHxWYCxGlfk+DwfeqiU0hk6bW4QtWjmyqjL5Go7FF+OD+zU1fDf1qFM4xum2iQs4bDjF40v1q1d8ww7Yc7Q8/McBy0RNwZtyqBWlz0PTSrigDFAbYVmBTdnjMyvZNoX6/xVgAM2qJcWwrvYlAAAAAElFTkSuQmCC'
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(pointshiplock)
      // 服务区图层
      ;(pointservice = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(service)
        }),
        style: new Style({
          image: new Icon({
            scale: 0.8,
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAq5JREFUeNqcVUtMU1EQPfe1lhaBGFITwdIq1JgCBj914cKFxMTEaAJaNdGw0USNLowxYly6RHZ+VsadbqyJYCJ+Ej/ITjFEY9FoRI2SglIDgqBIO87c91peP35wktM7786d05l5c+cpxw1CrsxshouXJgvrGJWMacZHRh/jGqPT2YVpPpstQmgHETUzXtPfRc5sY8AOO5GD0ZY+HRsnOtZPVN9NVHzThOiyJzabtFm+mlClU+bQ23hpnUoCx18AFz4AyfxqmFkp4KAfaA8BLkNvnWacEEUTMlmE9eh0CtjaC9wdwT/JRi9wPZwh3cG4qjhMeQFvGL4jMeD8e8xJDgWAM3VaHWRUC+EeVi71TwCrembTTF4+leWoKqphNLYUTL9vPVBboh9bDKs1cLFAzVTNSjh2nYQKrgbFB4Bvo3mE4iO+ljQJ4VrR7nwukI+b/9bp4uhq9CN9GQKmOJUfk8w0w505pfdvz/qGnfyzSLSByRwy5zxg6C3o+UOknt7nyrsBw0CqJwoVqAMxKb16BEek1e5b4bRuQFFeh7g8oMSghujGht1QnlKkxj5B/QwC4wmO1IzQpWxxMOKM0upi4OWEjZBTU/4QjIZGtpZzQQ0z3aJiHZ1a2gAafqeP+j0Zr7jU8JlomxbmREjclBwRyrwmmYinBKq8Amr+AqjKoF7T/WhJr5zsEG2vz2yBLPmayH9RYyOg72YqNDqsffZVZawdQhiVKVLHwRzw21qmKgTlW57Hp5bUQ3l9pr4sjP3sI75WY0fTV0+uzRW5elseA/cS/3X1dgqhVnmuSZTtYugMm5Ea6vdEYjscyCJrtzLNG19n7ePraIyo9gGRu4uo7BbRim5zL2d8nbOPr0IDdvscBmwkd8CqP3wCpK7NjDWMxZZJCv/E+gREC30CfgkwAOAdvMbYAeTEAAAAAElFTkSuQmCC'
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(pointservice)
      //洗舱站图层
      ;(pointwashing = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(washingstation)
        }),
        style: new Style({
          image: new Icon({
            scale: 0.8,
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAsxJREFUeNqUVE1ME1EQnn273UUstIpIW6smLWqUpCrSAxd/Dhh/DmJAY4wXJVEPXvSA0XBUY+TsRRNveikqJopGLuLJGCgJBxO0mIa/Vg8of9put1tnXne3u9UamOTLmzf75tuZN/NGOLH8GMqlv/qsjEu7gVZEAKEiphGjiOeIF+2/nqh41uErlBPigZO43EM0wv8lgbiOeGY3SjYiEZc7iG7aT+nzMKhNQFyfhW/6Ej/TwNzQzALQJoVhM/PQD58aP7+JyDsITTIV7Y/UOLzVEqBDwRHStL7A8VIbh6PSNjgvNyMB6zY+U7TAjOg6iUxDitvZIXijffmLzC707ZX2GW5l3wH5GFl18jssFApUgAlE8KE6zA+uRo5J2+Gi3ELqDCJEKZ8iskm8s9cYmSnL6TlIjxT3glC04c9BYAwCrbugyuvmNsrmCKa/hXk24fa0ZLQGL4CZ5sLkdxiPDXGCf8mPxAzsPHMIquu93Id8u/A+iYvuMEraKFbTlOTgSEUyknw2B18HPlp7m28LRegjzWwNkprgBkxNgOD+CEiKy0GmZVSYej8GimetZUuXfP2S8QIUezxr6mphPpmG3OJvWBcOOAhnP3yCgpaHqvU1tmZmlk5aihQfc5dSUjUshMCjdAgVRRR5lfScZpk3MivaFBGOkbaXlSLJ/FwCUZGhPhJyEiKRP7oDRNkFmblFy7yb+Ux1mAj7SWuTQhhuMSK3vw68YX/FonhDfqjd2mCkKPCnaL5gR2M/wMYeWGVj0xO8JEfNxg4zGkGoXCPLBeyliOhbMdkePNsl7zO3VxFZXh4kjeHSS9XqUQ7wzhdAqEhE347jk+tRDpoV7kXEyqfNDeoYGcQrlzEFcqCJE9dTvM9c6EjVpAIclhppfJl+9w3figO2A5e7KxywRNRnN7LyU5g+Dc0mxDljgCYROQNJw0bfmvBsX7n/HwEGAOox9YYgrnKxAAAAAElFTkSuQmCC'
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(pointwashing)
      // 锚地图层
      ;(polygonanchorage = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(anchorage)
        }),
        style: new Style({
          fill: new Fill({
            color: 'rgba(255,0,0,0)'
          }),
          stroke: new Stroke({
            color: 'rgba(255,0,0,1)',
            lineDash: [10, 10, 10, 10],
            width: 2
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(polygonanchorage)
      // 现状
      let styleFunction = function (feature) {
        let dn = feature.get('currentSituation')
        // console.log(dn);
        if (dn == '二级') {
          return new Style({
            fill: new Fill({
              color: 'rgba(2,114,47,0.8)'
            }),
            stroke: new Stroke({
              color: 'rgba(2,114,47,0.8)',
              width: 5
            })
          })
        } else if (dn == '三级') {
          return new Style({
            fill: new Fill({
              color: 'rgba(254,0,0,0.8)'
            }),
            stroke: new Stroke({
              color: 'rgba(254,0,0,0.8)',
              width: 5
            })
          })
        } else if (dn == '四级') {
          return new Style({
            fill: new Fill({
              color: 'rgba(255,0,198,0.8)'
            }),
            stroke: new Stroke({
              color: 'rgba(255,0,198,0.8)',
              width: 3
            })
          })
        } else if (dn == '五级') {
          return new Style({
            fill: new Fill({
              color: 'rgba(0,91,231,0.8)'
            }),
            stroke: new Stroke({
              color: 'rgba(0,91,231,0.8)',
              width: 3
            })
          })
        } else if (dn == '六级') {
          return new Style({
            fill: new Fill({
              color: 'rgba(56,167,0,0.8)'
            }),
            stroke: new Stroke({
              color: 'rgba(56,167,0,0.8)',
              width: 1
            })
          })
        } else if (dn == '七级') {
          return new Style({
            fill: new Fill({
              color: 'rgba(255,170,1,0.8)'
            }),
            stroke: new Stroke({
              color: 'rgba(255,170,1,0.8)',
              width: 1
            })
          })
        }
      }
      // 规划
      let styleFunctionPlan = function (feature) {
        let dn = feature.get('currentSituations')
        console.log(dn);
        if (dn == '二级') {
          return new Style({
            fill: new Fill({
              color: 'rgba(2,114,47,0.8)'
            }),
            stroke: new Stroke({
              color: 'rgba(2,114,47,0.8)',
              width: 5
            })
          })
        } else if (dn == '三级') {
          return new Style({
            fill: new Fill({
              color: 'rgba(254,0,0,0.8)'
            }),
            stroke: new Stroke({
              color: 'rgba(254,0,0,0.8)',
              width: 5
            })
          })
        } else if (dn == '四级') {
          return new Style({
            fill: new Fill({
              color: 'rgba(255,0,198,0.8)'
            }),
            stroke: new Stroke({
              color: 'rgba(255,0,198,0.8)',
              width: 3
            })
          })
        }
      }
      // 航道现状图层
      ;(polygonchannel = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(channel)
        }),
        style: styleFunction,
        visible: false,
        zIndex: 10
      })),
      map.addLayer(polygonchannel)
      // 航道规划图层
      ;(polygonchannelplan = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(channel)
        }),
        style: styleFunctionPlan,
        visible: false,
        zIndex: 10
      })),
      map.addLayer(polygonchannelplan)

      // 支线航道现状颜色
      let styleFunctionBranch = function(feature){
        let dn = feature.get('branchline')
        if (dn == '二级航道') {
          return new Style({
            stroke: new Stroke({
              color: 'rgba(2,114,47,0.8)',
              width: 5
            })
          })
        } else if (dn == '三级航道') {
          return new Style({
            stroke: new Stroke({
              color: 'rgba(254,0,0,0.8)',
              width: 5
            })
          })
        } else if (dn == '四级航道') {
          return new Style({
            stroke: new Stroke({
              color: 'rgba(255,0,198,0.8)',
              width: 3
            })
          })
        } else if (dn == '五级航道') {
          return new Style({
            stroke: new Stroke({
              color: 'rgba(0,91,231,0.8)',
              width: 3
            })
          })
        } else if (dn == '六级航道') {
          return new Style({
            stroke: new Stroke({
              color: 'rgba(56,167,0,0.8)',
              width: 1
            })
          })
        } else if (dn == '七级航道') {
          return new Style({
            stroke: new Stroke({
              color: 'rgba(255,170,1,0.8)',
              width: 1
            })
          })
        } else if(dn == "/"){
          return new Style({
            stroke: new Stroke({
              color: 'rgba(255,170,1,0)',
              width: 1
            })
          })
        }
      }
      // 支线航道规划颜色
      let styleFunctionBranchplan = function(feature){
        let dn = feature.get('branchlines')
        if (dn == '二级航道') {
          return new Style({
            stroke: new Stroke({
              color: 'rgba(2,114,47,0.8)',
              width: 5
            })
          })
        } else if (dn == '三级航道') {
          return new Style({
            stroke: new Stroke({
              color: 'rgba(254,0,0,0.8)',
              width: 5
            })
          })
        } else if (dn == '四级航道') {
          return new Style({
            stroke: new Stroke({
              color: 'rgba(255,0,198,0.8)',
              width: 3
            })
          })
        } else if (dn == '五级航道') {
          return new Style({
            stroke: new Stroke({
              color: 'rgba(0,77,228,0.8)',
              width: 3
            })
          })
        } else if (dn == '六级航道') {
          return new Style({
            stroke: new Stroke({
              color: 'rgba(47,164,0,0.8)',
              width: 3
            })
          })
        } else if (dn == '七级航道') {
          return new Style({
            stroke: new Stroke({
              color: 'rgba(255,162,0,0.8)',
              width: 3
            })
          })
        } else if (dn == '等外级航道') {
          return new Style({
            stroke: new Stroke({
              color: 'rgba(0,255,255,0.8)',
              width: 3
            })
          })
        }
      }
      // 支线航道现状图层
      ;(linebranchchannel = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(branchchannel)
        }),
        style: styleFunctionBranch,
        visible: false,
        zIndex: 10
      })),
        map.addLayer(linebranchchannel)
        // 支线航道规划图层
      ;(linebranchchannelplan = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(branchchannel)
        }),
        style: styleFunctionBranchplan,
        visible: false,
        zIndex: 10
      })),
        map.addLayer(linebranchchannelplan)
      // 永久基本农田图层(镇江市)
      ;(polygonyjjbnt = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(GEOJSON_CONST)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(255,255,0,0.2)',
            width: 1
          }),
          fill: new Fill({
            color: 'rgba(255,255,0,0.2)'
          })
        }),
        visible: false,
        zIndex: 11
      })),
      map.addLayer(polygonyjjbnt)
      // 国家级生态保护红线图层
      ;(polygonecologicalRedLines = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(ecologicalRedLines)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(255,115,153,0.4)',
            width: 1
          }),
          fill: new Fill({
            color: 'rgba(255,115,153,0.4)'
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(polygonecologicalRedLines)

      // 生态空间管控区图层(镇江市)
      ;(polygonecospace = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(ecospace)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(255,235,190,0.4)',
            width: 1
          }),
          fill: new Fill({
            color: 'rgba(255,235,190,0.4)'
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(polygonecospace)
        // 生态空间管控区图层(盐城市-国家)
      ;(ycpolygonecospace = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(ycecospace)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(255,235,190,0.4)',
            width: 1
          }),
          fill: new Fill({
            color: 'rgba(255,235,190,0.4)'
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(ycpolygonecospace)
          // 生态空间管控区图层(盐城市-省级)
      ;(ycpolygonecospace1 = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(ycecospace1)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(255,235,190,0.4)',
            width: 1
          }),
          fill: new Fill({
            color: 'rgba(255,235,190,0.4)'
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(ycpolygonecospace1)
      //  城镇开发边界图层(镇江市)
      ;(polygondevelopment = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(development)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(255,0,127,0.6)',
            width: 1
          }),
          fill: new Fill({
            color: 'rgba(255,0,127,0.6)'
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(polygondevelopment)
        //  城镇开发边界图层(盐城市)
      ;(ycpolygondevelopment = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(ycdevelopment)
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(255,0,127,0.6)',
            width: 1
          }),
          fill: new Fill({
            color: 'rgba(255,0,127,0.6)'
          })
        }),
        visible: false,
        zIndex: 11
      })),
        map.addLayer(ycpolygondevelopment)
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
      // 地图点击事件
      map.on('singleclick', (evt) => {
        console.log(evt)
        this.detailsDialogVisible = true
        const coordinate = evt.coordinate
        console.log(coordinate)
        var pixel = map.getEventPixel(evt.originalEvent)
        console.log(pixel)
        var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
          return feature
        })
        if (feature) {
          // 点击测距测面
          this.tagpopup = false
          this.detailsDialogVisible = false
          console.log(feature)
          this.deletetag = feature
          this.markdeleteid = feature.values_.id
          if (this.toolLastIndex == 0 || this.toolLastIndex == 1) {
            console.log(this.toolLastIndex)
            this.tagpopup = false
            this.detailsDialogVisible = false
            console.log(this.tagpopup)
            var values = feature.values_
            // var valuesa = feature.values_.flatCoordinates;
            var valuesX = feature.values_.geometry.extent_[0]
            var valuesY = feature.values_.geometry.extent_[1]
            console.log(valuesX, valuesY)
            this.clickObj = feature.values_.info
            if (values.hasOwnProperty('info')) {
              this.clickObj = feature.values_.info
            } else {
              this.clickObj = feature.values_
              this.detailsDialogVisible = false
            }
            this.overlay.setPosition(coordinate)
            map.addOverlay(this.overlay)
            this.toolLastIndex = null
            this.toolIndex = null
            this.detailsDialogVisible = false
            view.setCenter([119.489064142175, 32.9653877905019])
          } else {
            // 标记弹窗
            if (feature.values_['id'] !== undefined) {
              this.bioajiAll.forEach((r) => {
                // console.log(feature.values_.SBF,r.objectid);
                if (feature.values_.id == r.markid) {
                  this.tagnameinput = r.markName
                  this.tagnodetextarea = r.markNote
                }
              })
            } else {
              // 点位弹窗
              this.tagpopup = false
              this.tableDataAll.forEach((r) => {
                // console.log(feature.values_.SBF,r.objectid);
                console.log(r);
                
                if (
                  feature.values_.SBF == r.objectid ||
                  feature.values_.d_type == r.objectid
                ) {
                  this.scene_Img = ''
                  let ImgPSGIS = 'http://101.132.68.240:6022'
                  this.scene_Img = ImgPSGIS + r.attachedFilePath
                  this.pdfUrl = r.attachedPDFFilePath
                  view.setZoom(12)
                  this.detailsDialogVisible = true
                  this.clickObj = r
                  this.overlay.setPosition(coordinate)
                  map.addOverlay(this.overlay)
                  view.setCenter(coordinate)
                }
              })
            }
          }
          if (this.toolLastIndex == 2) {
            this.tagpopup = true
          }
          if (feature.values_['id'] !== undefined) {
            this.tagpopup = true
            this.detailsDialogVisible = false
          }
        } else {
          // 添加标记
          this.detailsDialogVisible = false
          this.tagpopup = false
          if (this.toolLastIndex == 2) {
            console.log(evt)
            this.tagpopup = true
            console.log(this.toolLastIndex)
            var point = evt.coordinate_
            var feature = new Feature({
              id: evt.map.ol_uid,
              geometry: new Point(point)
            })
            let style = new Style({
              image: new CircleStyle({
                radius: 5,
                fill: new Fill({
                  color: 'red'
                })
              })
            })
            feature.setStyle(style)
            console.log(feature)
            this.pointsignLayer.getSource().addFeature(feature)
            this.MarkID = feature.values_.geometry.ol_uid
            this.markx = feature.values_.geometry.flatCoordinates[0]
            this.marky = feature.values_.geometry.flatCoordinates[1]
            this.tagnameinput = ''
            this.tagnodetextarea = ''
          }
        }
      })
    },
    // 码头JSON隐藏
    WharfJsonHide() {
      linechangzhou.setVisible(false) // 码头常州港图层
      linejiangyin.setVisible(false) // 码头江阴港图层
      linelianyungang.setVisible(false) // 码头连云港图层
      linenanjing.setVisible(false) // 码头南京图层
      linenantongcoastal.setVisible(false) //  码头南通沿海图层
      linenantong.setVisible(false) // 码头南通图层
      linesuzhou.setVisible(false) // 码头苏州图层
      linetaizhou.setVisible(false) // 码头泰州图层
      lineyanchengcoastal.setVisible(false) // 码头盐城沿海图层
      lineyangzhou.setVisible(false) // 码头扬州图层
      linezhengjiang.setVisible(false) // 码头扬州图层
      pointtaizhouNeihe.setVisible(false) // 码头泰州内河图层
      pointyanchengNeihe.setVisible(false)  // 码头盐城内河图层
    },
    // 码头JSON显示
    WharfJsonShow() {
      linechangzhou.setVisible(true) // 码头常州港图层
      linejiangyin.setVisible(true) // 码头江阴港图层
      linelianyungang.setVisible(true) // 码头连云港图层
      linenanjing.setVisible(true) // 码头南京图层
      linenantongcoastal.setVisible(true) //  码头南通沿海图层
      linenantong.setVisible(true) // 码头南通图层
      linesuzhou.setVisible(true) // 码头苏州图层
      linetaizhou.setVisible(true) // 码头泰州图层
      lineyanchengcoastal.setVisible(true) // 码头盐城沿海图层
      lineyangzhou.setVisible(true) // 码头扬州图层
      linezhengjiang.setVisible(true) // 码头扬州图层
      pointtaizhouNeihe.setVisible(true) // 码头泰州内河图层
      pointyanchengNeihe.setVisible(true)  // 码头盐城内河图层
    },
    // 关闭标记弹窗
    tagcloser() {
      this.tagpopup = false
      this.toolLastIndex = null
      this.toolIndex = null
    },
    // 获取已有标记
    async getMarkList() {
      const result = await tag.getMarkList()
      if (result.status === 200) {
        console.log(result)
        this.bioajiAll = result.res.points.results
        result.res.points.results.forEach((i) => {
          console.log(i)
          this.tagnameinput = i.markName
          this.tagnodetextarea = i.markNote
          var markx = i.markx
          var marky = i.marky
          var markid = i.markid
          var feature = new Feature({
            geometry: new Point([markx, marky]),
            id: markid
          })
          let style = new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: 'red'
              })
            })
          })
          feature.setStyle(style)
          console.log(feature)
          this.pointsignLayer.getSource().addFeature(feature)
        })
      }
    },
    // 保存标记
    async tagsave() {
      this.tagname = this.$refs.taginput.value
      this.tagtextarea = this.$refs.tagtextarea.value
      let data = {
        markId: this.MarkID,
        markName: this.tagname,
        markNote: this.tagtextarea,
        markx: this.markx,
        marky: this.marky
      }
      const result = await tag.addMark(data)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: result.msg
        })
        this.tagpopup = false
        this.getMarkList()
        this.toolLastIndex = null
        this.toolIndex = null
      } else {
        this.pointsignLayer
          .getSource()
          .getFeatures()
          .forEach((r) => {
            if (r.values_.id == this.markdeleteid) {
              this.pointsignLayer.getSource().removeFeature(r)
            }
          })
        this.toolLastIndex = null
        this.toolIndex = null
        this.$message.error(result.msg)
      }
    },
    // 删除标记
    async tagdelete() {
      // this.getMarkList()
      let data = {
        markId: this.markdeleteid
      }
      console.log(this.markdeleteid)
      const result = await tag.deleteMark(data)
      if (result.status === 200) {
        // this.getMarkList()
        this.tagpopup = false
        this.$message({
          type: 'success',
          message: result.msg
        })
        this.toolLastIndex = null
        this.toolIndex = null
        console.log(this.deletetag);
        map.removeLayer(this.pointsignLayer)
        // let styleShow = new Style({
        //   image: new CircleStyle({
        //     radius: 5,
        //     fill: new Fill({
        //       color: 'rgba(0,0,0,0)'
        //     })
        //   })
        // })
        // // this.deletetag.setStyle(styleShow)
        // // this.pointsignLayer.getSource().addFeature(this.deletetag)
        // this.pointsignLayer
        //   .getSource()
        //   .getFeatures()
        //   .forEach((r) => {
        //     if (r.values_.id == this.markdeleteid) {
        //       // r.setStyle(styleShow)
        //       this.pointsignLayer.getSource().removeFeature(r)
        //       map.removeLayer(r)
        //      console.log(r);
        //     }
        //   })
        //   // console.log(this.pointsignLayer);
        //   this.pointsignLayer.getSource().changed()
        // console.log(this.pointsignLayer);
      } else this.$message.error(result.msg)
    },
    // 3D 地图
    init3DMap() {
      Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MTIzNzY5OC1hOWM2LTRiMWMtYTc5YS1lNjFmZmJhNDcxZjEiLCJpZCI6MTEzNjIsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyJdLCJpYXQiOjE1NjAxMzMzOTZ9.u3sp8GEkT7NjKeexeoUzMjgND6FHk0iGhdV-YxrJw-o'
      var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
      viewer = new Cesium.Viewer('container-3D', {
        geocoder: false,
        homeButton: false,
        selectionIndicator: false, //是否显示选取指示器组件
        sceneModePicker: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fulllscreenButtond: false,
        vrButton: false,
        infoBox: false,
        creditsDisplay: false,
        scene3DOnly: false
      })

      let layer = new Cesium.UrlTemplateImageryProvider({
        url: 'https://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=083966b3f15ae6b884523c3475aea981',
        subdomains: subdomains,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 18
      })
      // viewer.imageryLayers.addImageryProvider(layer);
      // 开启阴影
      let shadowMap = viewer.shadowMap
      viewer.shadows = false
      shadowMap.maximumDistance = 1000.0 // 米为单位
      shadowMap.darkness = 0.7 // 月球上是黑色阴影
      shadowMap.softShadows = true
      // 定位至江苏省
      setTimeout(() => {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            119.489064142175,
            32.9653877905019,
            650000
          ),
          offset: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-25)
            // range: 5000
          },
          complete: () => {
            // 加载江苏省边界
            this.loadBoundaryGeoJson()
          }
        })
      }, 1000)
      viewer.screenSpaceEventHandler.setInputAction((movement) => {
        this.clickObj = {}
        let vectorLayer = viewer.scene.pick(movement.position)
        if (vectorLayer.id.info) {
          // this.detailsDialogVisible = true;
          this.clickObj = vectorLayer.id.info
          // console.log(clickObj)
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
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
    // 桥梁城市查询
    mapCitySelect(val){
      this.mapcity = val
      this.getBridgeTree()
    },
    // 桥梁所属航道名称查询
    ChannelNameSelect(val){
      this.mapChannelName = val
      this.getBridgeTree()
    },
    // 桥梁所在行政划分查询
    mapAdministrativeSelect(val){
      this.mapAdministrative = val
      this.getBridgeTree()
    },
    // 作业区查看PDF
    checkPDF(){
      console.log(this.pdfUrl);
      let ImgPSGIS = 'http://101.132.68.240:6022'
      window.open(ImgPSGIS + this.pdfUrl)
    },
    // 飞到树形图最后一个节点具体点位
    handleNodeClick(val) {
      console.log(val);
      // this.tableid = val.objectid
      if (this.current == 1 || this.current == 0) {
        this.tableid = val.objectid
      } else {
        this.tableid = val.id
      }
      this.scene_Img = ''
      this.pdfUrl = ''
      console.log(this.tableid);
      this.tableDataAll.forEach((r) => {
        if (r.objectid == this.tableid) {
          console.log(r);
          let ImgPSGIS = 'http://101.132.68.240:6022'
          this.scene_Img = ImgPSGIS + r.attachedFilePath
          this.pdfUrl = r.attachedPDFFilePath
          let coordinates
          if (this.current == 4 && this.sonmueIndex == 0) {
            let cood = r.coordinates.split(',')[0]
            coordinates = cood.split(' ')
          } else if (this.current == 1) {
            polygonchannel
              .getSource()
              .getFeatures()
              .forEach((item) => {
                console.log(item.values_.SBF);
                if (this.tableid == item.values_.SBF) {
                  this.datapointX = item.values_.geometry.flatCoordinates[0]
                  this.datapointY = item.values_.geometry.flatCoordinates[1]
                  coordinates = [this.datapointX, this.datapointY]
                }
              })
              linebranchchannel
              .getSource()
              .getFeatures()
              .forEach((item) => {
                console.log(item.values_.SBF);
                if (this.tableid == item.values_.SBF) {
                  this.datapointX = item.values_.geometry.flatCoordinates[0]
                  this.datapointY = item.values_.geometry.flatCoordinates[1]
                  coordinates = [this.datapointX, this.datapointY]
                }
              })
          } else if (this.current == 2) {
            pointshiplock
              .getSource()
              .getFeatures()
              .forEach((item) => {
                if (this.tableid == item.values_.SBF) {
                  this.datapointX = item.values_.geometry.flatCoordinates[0]
                  this.datapointY = item.values_.geometry.flatCoordinates[1]
                  coordinates = [this.datapointX, this.datapointY]
                }
              })
          } else if (this.current == 3) {
            polygonanchorage
              .getSource()
              .getFeatures()
              .forEach((item) => {
                if (this.tableid == item.values_.SBF) {
                  this.datapointX = item.values_.geometry.flatCoordinates[0]
                  this.datapointY = item.values_.geometry.flatCoordinates[1]
                  coordinates = [this.datapointX, this.datapointY]
                }
              })
          } else if (this.current == 5 && this.portOrShorelineIndex == 0) {
            polygonworkzone
              .getSource()
              .getFeatures()
              .forEach((item) => {
                if (this.tableid == item.values_.SBF) {
                  this.datapointX = item.values_.geometry.flatCoordinates[0]
                  this.datapointY = item.values_.geometry.flatCoordinates[1]
                  coordinates = [this.datapointX, this.datapointY]
                }
              })
            tzpolygonworkzone
            .getSource()
            .getFeatures()
            .forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
          } else if (this.current == 5 && this.portOrShorelineIndex == 1) {
            linecoastline
              .getSource()
              .getFeatures()
              .forEach((item) => {
                if (this.tableid == item.values_.SBF) {
                  this.datapointX = item.values_.geometry.flatCoordinates[0]
                  this.datapointY = item.values_.geometry.flatCoordinates[1]
                  coordinates = [this.datapointX, this.datapointY]
                }
              })
              yclinecoastline
              .getSource()
              .getFeatures()
              .forEach((item) => {
                if (this.tableid == item.values_.SBF) {
                  this.datapointX = item.values_.geometry.flatCoordinates[0]
                  this.datapointY = item.values_.geometry.flatCoordinates[1]
                  coordinates = [this.datapointX, this.datapointY]
                }
              })
          } else if(this.current == 0){
            linechangzhou.getSource().getFeatures().forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
            linejiangyin.getSource().getFeatures().forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
            linelianyungang.getSource().getFeatures().forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
            linenanjing.getSource().getFeatures().forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
            linenantongcoastal.getSource().getFeatures().forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
            linenantongcoastal.getSource().getFeatures().forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
            linenantong.getSource().getFeatures().forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
            linesuzhou.getSource().getFeatures().forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
            linetaizhou.getSource().getFeatures().forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
            lineyanchengcoastal.getSource().getFeatures().forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
            lineyangzhou.getSource().getFeatures().forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
            linezhengjiang.getSource().getFeatures().forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
            pointtaizhouNeihe.getSource().getFeatures().forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
            pointyanchengNeihe.getSource().getFeatures().forEach((item) => {
              if (this.tableid == item.values_.SBF) {
                this.datapointX = item.values_.geometry.flatCoordinates[0]
                this.datapointY = item.values_.geometry.flatCoordinates[1]
                coordinates = [this.datapointX, this.datapointY]
              }
            })
          }
          view.setZoom(12)
          this.detailsDialogVisible = true
          this.clickObj = r
          this.overlay.setPosition(coordinates)
          map.addOverlay(this.overlay)
          view.setCenter(coordinates)
        }
      })
    },
    // 飞到table列表具体点位
    handleCurrentChange(val) {
      console.log(val)
      this.tableid = val.objectid
      console.log(this.current, this.sonmueIndex)
      if (this.current == 1) {
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
      } else if (this.current == 4 && this.sonmueIndex == 1) {
        pointservice
          .getSource()
          .getFeatures()
          .forEach((item) => {
            console.log(item)
            if (this.tableid == item.values_.d_type) {
              this.datapointX = item.values_.geometry.flatCoordinates[0]
              this.datapointY = item.values_.geometry.flatCoordinates[1]
              console.log(this.datapointX, this.datapointY)
            }
          })
      } else if (this.current == 4 && this.sonmueIndex == 2) {
        pointwashing
          .getSource()
          .getFeatures()
          .forEach((item) => {
            console.log(item)
            if (this.tableid == item.values_.SBF) {
              this.datapointX = item.values_.geometry.flatCoordinates[0]
              this.datapointY = item.values_.geometry.flatCoordinates[1]
              console.log(this.datapointX, this.datapointY)
            }
          })
      }
      console.log(this.tableDataAll)
      this.tableDataAll.forEach((r) => {
        if (
          r.objectid == this.tableid ||
          r.id == this.tableid ||
          r.sectionId == this.tableid
        ) {
          view.setZoom(12)
          this.detailsDialogVisible = true
          this.clickObj = r
          this.overlay.setPosition([this.datapointX, this.datapointY])
          map.addOverlay(this.overlay)
          view.setCenter([this.datapointX, this.datapointY])
        }
      })
    },
    // 码头树形图全部信息
    async getAllBaseBerth() {
      // console.log(infrastructure)
      let { res, status } = await infrastructure.getAllBaseBerth()
      if (status === 200) {
        console.log(res)
        this.tableDataAll = res.data
        this.tableDataAll.forEach(item=>{
          this.checkedList.push(item.objectid)
        })
        this.$nextTick(()=>{
          this.$refs.tree.setCheckedKeys(this.checkedList);
        })
      } else {
        this.tableDataAll = []
      }
    },
    // 航道左侧 all table
    async getAllChannelTable() {
      let { res, status } = await infrastructure.getAllChannelTable()
      if (status === 200) {
        let data = res.data
        this.tableDataAll = data
        // 干线航道现状图层
        polygonchannel.getSource().getFeatures().forEach(item=>{
          this.tableDataAll.forEach(r=>{
            if(r.objectid == item.values_.SBF){
              item.values_.currentSituation = r.presentlevel
            }
          })
        })
        // 干线航道规划图层
        polygonchannelplan.getSource().getFeatures().forEach(item=>{
          this.tableDataAll.forEach(r=>{
            if(r.objectid == item.values_.SBF){
              item.values_.currentSituations = r.planninglevel
            }
          })
        })
        // 支线航道现状图层
        linebranchchannel.getSource().getFeatures().forEach(item=>{
          this.tableDataAll.forEach(r=>{
            if(r.objectid == item.values_.SBF){
              item.values_.branchline = r.planninglevel
            }
          })
        })
        // 支线航道规划图层
        linebranchchannelplan.getSource().getFeatures().forEach(item=>{
          this.tableDataAll.forEach(r=>{
            if(r.objectid == item.values_.SBF){
              item.values_.branchlines = r.planninglevel
            }
          })
        })
        // 渲染树形图
        this.tableDataAll.forEach(item=>{
          // console.log(item);
          this.checkedList.push(item.objectid)
        })
        // console.log(this.checkedList);
        this.$nextTick(()=>{
          this.$refs.tree.setCheckedKeys(this.checkedList);
        })
      } else {
        this.tableDataAll = []
      }
    },
    //船闸树状图所有信息
    async getShipLockTreeAll() {
      // console.log(infrastructure)
      let { res, status } = await infrastructure.getShipLockTreeAll()
      if (status === 200) {
        this.tableDataAll = res.data
        this.tableDataAll.forEach(item=>{
          this.checkedList.push(item.objectid)
        })
        this.$nextTick(()=>{
          this.$refs.tree.setCheckedKeys(this.checkedList);
        })
      } else {
        this.tableDataAll = []
      }
    },
    // 锚地左侧 all table
    async getAllAnchorageTable() {
      let { res, status } = await infrastructure.getAllAnchorageTable()
      if (status === 200) {
        let data = res.data
        this.tableDataAll = data
        this.tableDataAll.forEach(item=>{
          this.checkedList.push(item.objectid)
        })
        this.$nextTick(()=>{
          this.$refs.tree.setCheckedKeys(this.checkedList);
        })
      } else {
        this.tableDataAll = []
      }
    },
    // 桥梁左侧 all table
    async getBaseBridge() {
      let { res, status } = await infrastructure.getBaseBridge()
      if (status === 200) {
        let data = res.data
        this.tableDataAll = data
        this.tableDataAll.forEach(item=>{
          this.checkedList.push(item.objectid)
        })
        this.$nextTick(()=>{
          this.$refs.tree.setCheckedKeys(this.checkedList);
        })
      } else {
        this.tableDataAll = []
      }
    },
    // 服务区左侧所有表格
    async getAllBaseWaterservice() {
      let { res, status } = await infrastructure.getAllBaseWaterservice()
      if (status === 200) {
        let data = res.data
        this.tableDataAll = data
      } else {
        this.tableDataAll = []
      }
    },
    // 岸线左侧所有表格
    async gettBaseShoreline() {
      let { res, status } = await infrastructure.gettBaseShoreline()
      if (status === 200) {
        let data = res.data
        this.tableDataAll = data
        this.tableDataAll.forEach(item=>{
          this.checkedList.push(item.objectid)
        })
        this.$nextTick(()=>{
          this.$refs.tree.setCheckedKeys(this.checkedList);
        })
      } else {
        this.tableDataAll = []
      }
    },
    // 作业区左侧所有表格
    async getAllPortTree() {
      let { res, status } = await infrastructure.getAllPortTree()
      if (status === 200) {
        let data = res.data
        this.tableDataAll = data
        this.tableDataAll.forEach(item=>{
          this.checkedList.push(item.objectid)
        })
        this.$nextTick(()=>{
          this.$refs.tree.setCheckedKeys(this.checkedList);
        })
      } else {
        this.tableDataAll = []
      }
    },
    // 获取复选框选中的值
    handleCheckChange(val) {
      if (val.length > 0) {
        this.regionCheckList2 = []
        this.regionCheckList1.forEach((el) => {
          if (val.includes(el)) {
          } else {
            this.regionCheckList2.push(el)
          }
        })
      } else {
        this.regionCheckList2 = this.regionCheckList1
      }
      val.forEach((item) => {
        if (item == '永久基本农田') {
          polygonyjjbnt.setVisible(true)
        }
        if (item == '城镇开发边界') {
          if(this.portPlanCitySelectValue == '全省'){
            polygondevelopment.setVisible(true)
            ycpolygondevelopment.setVisible(true)
          }else if(this.portPlanCitySelectValue == '镇江市'){
            polygondevelopment.setVisible(true)
          }else if(this.portPlanCitySelectValue == '盐城市'){
            ycpolygondevelopment.setVisible(true)
            this.zjisshow()
          }
        }
        if (item == '生态空间管控区') {
          polygonecospace.setVisible(true)
          if(this.portPlanCitySelectValue == '全省'){
            polygonecospace.setVisible(true)
            ycpolygonecospace.setVisible(true)
            ycpolygonecospace1.setVisible(true)
          }else if(this.portPlanCitySelectValue == '镇江市'){
            polygonecospace.setVisible(true)
          }else if(this.portPlanCitySelectValue == '盐城市'){
            ycpolygonecospace.setVisible(true)
            ycpolygonecospace1.setVisible(true)
            this.zjisshow()
          }
        }
        if (item == '生态保护红线') {
          polygonecologicalRedLines.setVisible(true)
        }
      })
      // this.regionCheckList2 = [...new Set(this.regionCheckList2 )]
      this.regionCheckList2.forEach((li) => {
        if (li == '永久基本农田') {
          polygonyjjbnt.setVisible(false)
        }
        if (li == '城镇开发边界') {
          if(this.portPlanCitySelectValue == '全省'){
            polygondevelopment.setVisible(false)
            ycpolygondevelopment.setVisible(false)
          }else if(this.portPlanCitySelectValue == '镇江市'){
            polygondevelopment.setVisible(false)
          }else if(this.portPlanCitySelectValue == '盐城市'){
            ycpolygondevelopment.setVisible(false)
            this.zjisshow()
          }
        }
        if (li == '生态空间管控区') {
          // polygonecospace.setVisible(false)
          if(this.portPlanCitySelectValue == '全省'){
            polygonecospace.setVisible(false)
            ycpolygonecospace.setVisible(false)
            ycpolygonecospace1.setVisible(false)
          }else if(this.portPlanCitySelectValue == '镇江市'){
            polygonecospace.setVisible(false)
          }else if(this.portPlanCitySelectValue == '盐城市'){
            ycpolygonecospace.setVisible(false)
            ycpolygonecospace1.setVisible(false)
            this.zjisshow()
          }
        }
        if (li == '生态保护红线') {
          polygonecologicalRedLines.setVisible(false)
        }
      })
    },
    // loading
    loadingFunction(){
      console.log(this.ischecked);
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 5000);
    },
    // 全选
    // 复选框控制现隐
    handleCheckBox(data,checked,indeterminate){
      // this.ischecked = checked
      if(this.current == 0){
        let pointStyle = new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({
              color: "rgba(0,128,0,0)"
            })
          })
        })
        let pointStyleshow = new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({
              color: "rgba(0,128,0,0.7)"
            })
          })
        })
        let lineStyle = new Style({
          stroke: new Stroke({
            color: 'rgba(0,128,0,0)',
            width: 4
          })
        })
        let lineStyleShow = new Style({
          stroke: new Stroke({
            color: 'rgba(0,128,0,0.8)',
            width: 4
          })
        })
        if(checked){
          pointtaizhouNeihe.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(pointStyleshow)
            }
          })
          pointyanchengNeihe.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(pointStyleshow)
            }
          })
          linechangzhou.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyleShow)
            }
          })
          linejiangyin.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyleShow)
            }
          })
          linelianyungang.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyleShow)
            }
          })
          linenanjing.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyleShow)
            }
          })
          linenantongcoastal.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyleShow)
            }
          })
          linenantong.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyleShow)
            }
          })
          linesuzhou.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyleShow)
            }
          })
          linetaizhou.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyleShow)
            }
          })
          lineyanchengcoastal.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyleShow)
            }
          })
          lineyangzhou.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyleShow)
            }
          })
          linezhengjiang.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyleShow)
            }
          })
        }else{
          pointtaizhouNeihe.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(pointStyle)
            }
          })
          pointyanchengNeihe.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(pointStyle)
            }
          })
          linechangzhou.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyle)
            }
          })
          linejiangyin.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyle)
            }
          })
          linelianyungang.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyle)
            }
          })
          linenanjing.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyle)
            }
          })
          linenantongcoastal.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyle)
            }
          })
          linenantong.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyle)
            }
          })
          linesuzhou.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyle)
            }
          })
          linetaizhou.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyle)
            }
          })
          lineyanchengcoastal.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyle)
            }
          })
          lineyangzhou.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyle)
            }
          })
          linezhengjiang.getSource().getFeatures().forEach((item)=>{
            if(data.objectid == item.values_.SBF){
              item.setStyle(lineStyle)
            }
          })
        }
      }else if(this.current == 1){
        if(this.situationOrPlan == '现状'){
          let styleFunction = function (feature) {
            return new Style({
              fill: new Fill({
                color: 'rgba(2,114,47,0)'
              }),
              stroke: new Stroke({
                color: 'rgba(2,114,47,0)',
                width: 5
              })
            })
            
          }
          let styleFunctionShow = function(feature){
            let dn = feature.get('currentSituation')
            console.log(dn);
            // console.log(dn);
            if (dn == '二级') {
              return new Style({
                fill: new Fill({
                  color: 'rgba(2,114,47,0.8)'
                }),
                stroke: new Stroke({
                  color: 'rgba(2,114,47,0.8)',
                  width: 5
                })
              })
            } else if (dn == '三级') {
              return new Style({
                fill: new Fill({
                  color: 'rgba(254,0,0,0.8)'
                }),
                stroke: new Stroke({
                  color: 'rgba(254,0,0,0.8)',
                  width: 5
                })
              })
            } else if (dn == '四级') {
              return new Style({
                fill: new Fill({
                  color: 'rgba(255,0,198,0.8)'
                }),
                stroke: new Stroke({
                  color: 'rgba(255,0,198,0.8)',
                  width: 3
                })
              })
            } else if (dn == '五级') {
              return new Style({
                fill: new Fill({
                  color: 'rgba(0,91,231,0.8)'
                }),
                stroke: new Stroke({
                  color: 'rgba(0,91,231,0.8)',
                  width: 3
                })
              })
            } else if (dn == '六级') {
              return new Style({
                fill: new Fill({
                  color: 'rgba(56,167,0,0.8)'
                }),
                stroke: new Stroke({
                  color: 'rgba(56,167,0,0.8)',
                  width: 1
                })
              })
            } else if (dn == '七级') {
              return new Style({
                fill: new Fill({
                  color: 'rgba(255,170,1,0.8)'
                }),
                stroke: new Stroke({
                  color: 'rgba(255,170,1,0.8)',
                  width: 1
                })
              })
            }
          }
          let styleFunctionBranch = function(feature){
            return new Style({
              stroke: new Stroke({
                color: 'rgba(2,114,47,0)',
                width: 5
              })
            }) 
          }
          let styleFunctionBranchShow = function(feature){
            let dn = feature.get('branchline')
            if (dn == '二级航道') {
              return new Style({
                stroke: new Stroke({
                  color: 'rgba(2,114,47,0.2)',
                  width: 5
                })
              })
            } else if (dn == '三级航道') {
              return new Style({
                stroke: new Stroke({
                  color: 'rgba(254,0,0,0.2)',
                  width: 5
                })
              })
            } else if (dn == '四级航道') {
              return new Style({
                stroke: new Stroke({
                  color: 'rgba(255,0,198,0.2)',
                  width: 3
                })
              })
            } else if (dn == '五级航道') {
              return new Style({
                stroke: new Stroke({
                  color: 'rgba(0,91,231,0.2)',
                  width: 3
                })
              })
            } else if (dn == '六级航道') {
              return new Style({
                stroke: new Stroke({
                  color: 'rgba(56,167,0,0.2)',
                  width: 1
                })
              })
            } else if (dn == '七级航道') {
              return new Style({
                stroke: new Stroke({
                  color: 'rgba(255,170,1,0.2)',
                  width: 1
                })
              })
            } else if(dn == "/"){
              return new Style({
                stroke: new Stroke({
                  color: 'rgba(255,170,1,0)',
                  width: 1
                })
              })
            }
          }
          if(checked){
            console.log(111);
            polygonchannel.getSource().getFeatures().forEach((item)=>{
              if(data.objectid == item.values_.SBF){
                item.setStyle(styleFunctionShow)
              }
            })
            linebranchchannel.getSource().getFeatures().forEach((item)=>{
              if(data.objectid == item.values_.SBF){
                item.setStyle(styleFunctionBranchShow)
              }
            })
          }else{
            polygonchannel.getSource().getFeatures().forEach((item)=>{
              if(data.objectid == item.values_.SBF){
                item.setStyle(styleFunction)
              }
            })
            linebranchchannel.getSource().getFeatures().forEach((item)=>{
              if(data.objectid == item.values_.SBF){
                item.setStyle(styleFunctionBranch)
              }
            })
          }
        }else if(this.situationOrPlan == '规划'){
          let styleFunctionPlan = function (feature) {
            return new Style({
              fill: new Fill({
                color: 'rgba(2,114,47,0)'
              }),
              stroke: new Stroke({
                color: 'rgba(2,114,47,0)',
                width: 5
              })
            })
          }
          let styleFunctionPlanShow = function(feature){
            let dn = feature.get('currentSituations')
            if (dn == '二级') {
              return new Style({
                fill: new Fill({
                  color: 'rgba(2,114,47,0.8)'
                }),
                stroke: new Stroke({
                  color: 'rgba(2,114,47,0.8)',
                  width: 5
                })
              })
            } else if (dn == '三级') {
              return new Style({
                fill: new Fill({
                  color: 'rgba(254,0,0,0.8)'
                }),
                stroke: new Stroke({
                  color: 'rgba(254,0,0,0.8)',
                  width: 5
                })
              })
            } else if (dn == '四级') {
              return new Style({
                fill: new Fill({
                  color: 'rgba(255,0,198,0.8)'
                }),
                stroke: new Stroke({
                  color: 'rgba(255,0,198,0.8)',
                  width: 3
                })
              })
            }
          }
          let styleFunctionBranchplan = function(feature){
            return new Style({
              stroke: new Stroke({
                color: 'rgba(2,114,47,0)',
                width: 5
              })
            }) 
          }
          let styleFunctionBranchplanShow = function(feature){
            let dn = feature.get('branchlines')
            if (dn == '二级航道') {
              return new Style({
                stroke: new Stroke({
                  color: 'rgba(2,114,47,0.8)',
                  width: 5
                })
              })
            } else if (dn == '三级航道') {
              return new Style({
                stroke: new Stroke({
                  color: 'rgba(254,0,0,0.8)',
                  width: 5
                })
              })
            } else if (dn == '四级航道') {
              return new Style({
                stroke: new Stroke({
                  color: 'rgba(255,0,198,0.8)',
                  width: 3
                })
              })
            } else if (dn == '五级航道') {
              return new Style({
                stroke: new Stroke({
                  color: 'rgba(0,77,228,0.8)',
                  width: 3
                })
              })
            } else if (dn == '六级航道') {
              return new Style({
                stroke: new Stroke({
                  color: 'rgba(47,164,0,0.8)',
                  width: 3
                })
              })
            } else if (dn == '七级航道') {
              return new Style({
                stroke: new Stroke({
                  color: 'rgba(255,162,0,0.8)',
                  width: 3
                })
              })
            } else if (dn == '等外级航道') {
              return new Style({
                stroke: new Stroke({
                  color: 'rgba(0,255,255,0.8)',
                  width: 3
                })
              })
            }
          }
          if(checked){
            polygonchannelplan.getSource().getFeatures().forEach((item)=>{
              if(data.objectid == item.values_.SBF){
                item.setStyle(styleFunctionPlanShow)
              }
            })
            linebranchchannelplan.getSource().getFeatures().forEach((item)=>{
              if(data.objectid == item.values_.SBF){
                item.setStyle(styleFunctionBranchplanShow)
              }
            })
          }else{
            polygonchannelplan.getSource().getFeatures().forEach((item)=>{
              if(data.objectid == item.values_.SBF){
                item.setStyle(styleFunctionPlan)
              }
            })
            linebranchchannelplan.getSource().getFeatures().forEach((item)=>{
              if(data.objectid == item.values_.SBF){
                item.setStyle(styleFunctionBranchplan)
              }
            })
          }
        }
      }else if(this.current == 2){
        let czPoint = new Style({
          image: new Icon({
            scale: 0,
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxFJREFUeNqUVF1Ik2EUfr7PbZriunCzZv7RSmsLTNML034MioxMIxXMbvsDDerCKIIgIiJv9cbLIIK00tQCocJ+vNFUTOlHhc2/LbZQDP/m3Drn9fvmnEzqwLP37H3Peb5zznveI138chyh0pDVoaOlREEuIYHgIUwQ+ggvCS2Xek94yHadrxRKSAZnaXlE2IXNZYRwk/AieFMTRBRBywNCDf93LNrx0f0GQ7M9cC05hI0x0gSrPhuHDIUwRaXwB58rH79NWFlHqJIt+5bwbLKByNrh8/vWheRYHBN452rGEUMRyhIvQyNpapRjjhayEl0pk3n9XtSN3kWnq3UDWbDw2XtXC9neAfsoWZWKGvr9fr6AUULi0/F6Yfg/UmA8g4qkKlYnCTs5wjImm6Kadbpb4Rz+ja4n/RjusmPhzxImhn7B61kJS9jpbgP7kuwglMtKa+ATXQCn8rXjJ+ZmFmDrm8Knx70Y/myHRhexafrsq0gJE+awxrfJoovWrvaTLK06+Pxw2aaFvjTvwYp3Y20HZ7tVNZtveTtramt45pcDhH4i86340N/+HXpjjCDLrdi/gdCt+JKYZOUFkPjFr6XAjOitUfApkcgRohEw65rDItVUkjamHSFpAzpbC3oDNa2orCUeByszkZxhEmQcoSocYV/bN7jt03D8cAX243TxgVbllAcIafv0OXAujq+mS1Gk56ciNTMBYwNO2Hon19KzzwiI/NKNYt2rz1KPezjCZtby4k5CluR1qUTG6LA7N5nqloEUilgbtfaw1FKwT35cobrdHNLYddTYr8K2CNdw8O0IZSAhLS8FsYYYHDUW4XxStdrYZplHECk3eKcs8Qr2xGaGJYyKjUR2iRUHii2CzEKplideVY+vc2eJuIm0kZZaeuioNt+jh38aEqSwxHxWYCxGlfk+DwfeqiU0hk6bW4QtWjmyqjL5Go7FF+OD+zU1fDf1qFM4xum2iQs4bDjF40v1q1d8ww7Yc7Q8/McBy0RNwZtyqBWlz0PTSrigDFAbYVmBTdnjMyvZNoX6/xVgAM2qJcWwrvYlAAAAAElFTkSuQmCC'
          })
        })
        let czPointShow = new Style({
          image: new Icon({
            scale: 0.8,
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxFJREFUeNqUVF1Ik2EUfr7PbZriunCzZv7RSmsLTNML034MioxMIxXMbvsDDerCKIIgIiJv9cbLIIK00tQCocJ+vNFUTOlHhc2/LbZQDP/m3Drn9fvmnEzqwLP37H3Peb5zznveI138chyh0pDVoaOlREEuIYHgIUwQ+ggvCS2Xek94yHadrxRKSAZnaXlE2IXNZYRwk/AieFMTRBRBywNCDf93LNrx0f0GQ7M9cC05hI0x0gSrPhuHDIUwRaXwB58rH79NWFlHqJIt+5bwbLKByNrh8/vWheRYHBN452rGEUMRyhIvQyNpapRjjhayEl0pk3n9XtSN3kWnq3UDWbDw2XtXC9neAfsoWZWKGvr9fr6AUULi0/F6Yfg/UmA8g4qkKlYnCTs5wjImm6Kadbpb4Rz+ja4n/RjusmPhzxImhn7B61kJS9jpbgP7kuwglMtKa+ATXQCn8rXjJ+ZmFmDrm8Knx70Y/myHRhexafrsq0gJE+awxrfJoovWrvaTLK06+Pxw2aaFvjTvwYp3Y20HZ7tVNZtveTtramt45pcDhH4i86340N/+HXpjjCDLrdi/gdCt+JKYZOUFkPjFr6XAjOitUfApkcgRohEw65rDItVUkjamHSFpAzpbC3oDNa2orCUeByszkZxhEmQcoSocYV/bN7jt03D8cAX243TxgVbllAcIafv0OXAujq+mS1Gk56ciNTMBYwNO2Hon19KzzwiI/NKNYt2rz1KPezjCZtby4k5CluR1qUTG6LA7N5nqloEUilgbtfaw1FKwT35cobrdHNLYddTYr8K2CNdw8O0IZSAhLS8FsYYYHDUW4XxStdrYZplHECk3eKcs8Qr2xGaGJYyKjUR2iRUHii2CzEKplideVY+vc2eJuIm0kZZaeuioNt+jh38aEqSwxHxWYCxGlfk+DwfeqiU0hk6bW4QtWjmyqjL5Go7FF+OD+zU1fDf1qFM4xum2iQs4bDjF40v1q1d8ww7Yc7Q8/McBy0RNwZtyqBWlz0PTSrigDFAbYVmBTdnjMyvZNoX6/xVgAM2qJcWwrvYlAAAAAElFTkSuQmCC'
          })
        })
        if(checked){
          pointshiplock.getSource().getFeatures().forEach((item)=>{
            if(data.id == item.values_.SBF){
              item.setStyle(czPointShow)
            }
          })
        }else{
          pointshiplock.getSource().getFeatures().forEach((item)=>{
            if(data.id == item.values_.SBF){
              item.setStyle(czPoint)
            }
          })
        }
      }else if(this.current == 3){
        let anchorage = new Style({
          fill: new Fill({
            color: 'rgba(255,0,0,0)'
          }),
          stroke: new Stroke({
            color: 'rgba(255,0,0,1)',
            lineDash: [10, 10, 10, 10],
            width: 2
          })
        })
        let anchorageShow = new Style({
          fill: new Fill({
            color: 'rgba(255,0,0,0)'
          }),
          stroke: new Stroke({
            color: 'rgba(255,0,0,0)',
            lineDash: [10, 10, 10, 10],
            width: 2
          })
        })
        if(checked){
          polygonanchorage.getSource().getFeatures().forEach((item)=>{
            if(data.id == item.values_.SBF){
              item.setStyle(anchorageShow)
            }
          })
        }else{
          polygonanchorage.getSource().getFeatures().forEach((item)=>{
            if(data.id == item.values_.SBF){
              item.setStyle(anchorage)
            }
          })
        }
      }else if(this.current == 4 || this.current == 4 && this.sonmueIndex == 0){
        let bridge = new Style({
          image: new Icon({
            scale: 0,
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAphJREFUeNqUVFtLVFEU/s7M6ISUqWFkWZZa0O2ppprnCoKJMro8CQpFdJmICrLTD2gq6fKgFNFD71rZBTHoPexCEBhRFgaWldGDotZMM6dv7b3PnDMzFTMLvn32WXutb6+99trLcs6gUBJOOccWgyixkEgSo8RL4i5xD7aVpG2Oq1VAmHB2cbxINOP/Mkx0EHf8ypCPKMjxHHFa/X97DTy7CbwdAH580DY1jcCKbUDkADB/lWx422x+lkjnRphwLiiy1AzQfwp4egPIpP8eW4B7bzwMxC4BQcmOIu3wCBPOHo49SDNNt2I8zGMUJcu3Am0PXdK9RK/lOOoC3hP1uH8MeNKFkiR6FNihfD4RjQHDXI+vQ8DgNZQsg9ehfIFFxL6QKQ19ASZn/Yx3OgWUcTvLYsos7ZthhUiRJGlWUcYUNkH7iO/2K2LSIoQRZf3uUXbThrnA50mgMkwCMgQDWp/OSNb1ZnWzfVFKJUARrhfCBUrplgZlgBF+nGAUXP2Z1hGJlAc1fpN4SSWwcp5x8HzrQuYFhFUoRr5MaaeJpD7ymlqtH/rukY9O+iLUt5wt7DFijira8TdKGaZ2iseqrQDi6/RXZHwa6Hqhv7NCPsLqBnc2Jtl5pabyAtwTzOhv+1qPTETmovPbKGne4s6eC2Gfmkb26xcg3DXAYuZoWVVhlYhO1sQm+2rkKWrpyyvsOAu7u7Q63HQE2NntFnZTQLUg4KRajF2manPxZPL0dP2JnCB+6QqzrR6Oneq22h7w4R/i9Qb+TSRr0bj/HXeqXpDXbSSBV4l4tn1Jx3HblzhWL9UXsOGgtC+XXs57vLB9eX1xN8fzRTZYWzpMTmcrMLMtaZqriVbTQEeIlMGI0bUqG9vqzXf/I8AAVynJagNCPsoAAAAASUVORK5CYII=',
            anchor: [0.48, 0.52]
          })
        })
        let bridgeShow = new Style({
          image: new Icon({
            scale: 0.8,
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAphJREFUeNqUVFtLVFEU/s7M6ISUqWFkWZZa0O2ppprnCoKJMro8CQpFdJmICrLTD2gq6fKgFNFD71rZBTHoPexCEBhRFgaWldGDotZMM6dv7b3PnDMzFTMLvn32WXutb6+99trLcs6gUBJOOccWgyixkEgSo8RL4i5xD7aVpG2Oq1VAmHB2cbxINOP/Mkx0EHf8ypCPKMjxHHFa/X97DTy7CbwdAH580DY1jcCKbUDkADB/lWx422x+lkjnRphwLiiy1AzQfwp4egPIpP8eW4B7bzwMxC4BQcmOIu3wCBPOHo49SDNNt2I8zGMUJcu3Am0PXdK9RK/lOOoC3hP1uH8MeNKFkiR6FNihfD4RjQHDXI+vQ8DgNZQsg9ehfIFFxL6QKQ19ASZn/Yx3OgWUcTvLYsos7ZthhUiRJGlWUcYUNkH7iO/2K2LSIoQRZf3uUXbThrnA50mgMkwCMgQDWp/OSNb1ZnWzfVFKJUARrhfCBUrplgZlgBF+nGAUXP2Z1hGJlAc1fpN4SSWwcp5x8HzrQuYFhFUoRr5MaaeJpD7ymlqtH/rukY9O+iLUt5wt7DFijira8TdKGaZ2iseqrQDi6/RXZHwa6Hqhv7NCPsLqBnc2Jtl5pabyAtwTzOhv+1qPTETmovPbKGne4s6eC2Gfmkb26xcg3DXAYuZoWVVhlYhO1sQm+2rkKWrpyyvsOAu7u7Q63HQE2NntFnZTQLUg4KRajF2manPxZPL0dP2JnCB+6QqzrR6Oneq22h7w4R/i9Qb+TSRr0bj/HXeqXpDXbSSBV4l4tn1Jx3HblzhWL9UXsOGgtC+XXs57vLB9eX1xN8fzRTZYWzpMTmcrMLMtaZqriVbTQEeIlMGI0bUqG9vqzXf/I8AAVynJagNCPsoAAAAASUVORK5CYII=',
            anchor: [0.48, 0.52]
          })
        })
        if(checked){
          pointbridge.getSource().getFeatures().forEach((item)=>{
            if(data.id == item.values_.SBF){
              item.setStyle(bridgeShow)
            }
          })
        }else{
          pointbridge.getSource().getFeatures().forEach((item)=>{
            if(data.id == item.values_.SBF){
              item.setStyle(bridge)
            }
          })
        }
      }else if(this.current == 5 && this.portOrShorelineIndex !== 1 || this.current == 5 && this.portOrShorelineIndex == 0){
        let workzone = new Style({
          fill: new Fill({
            color: 'rgba(0,0,255,0)'
          })
        })
        let workzoneShow = new Style({
          fill: new Fill({
            color: 'rgba(0,0,255,0.7)'
          })
        })
        if(checked){
          tzpolygonworkzone.getSource().getFeatures().forEach((item)=>{
            if(data.id == item.values_.SBF){
              item.setStyle(workzoneShow)
            }
          })
          polygonworkzone.getSource().getFeatures().forEach((item)=>{
            if(data.id == item.values_.SBF){
              item.setStyle(workzoneShow)
            }
          })
        }else{
          polygonworkzone.getSource().getFeatures().forEach((item)=>{
            if(data.id == item.values_.SBF){
              item.setStyle(workzone)
            }
          })
          tzpolygonworkzone.getSource().getFeatures().forEach((item)=>{
            if(data.id == item.values_.SBF){
              item.setStyle(workzone)
            }
          })
        }
      }else if(this.current == 5 && this.portOrShorelineIndex == 1){

        let coastline = new Style({
          stroke: new Stroke({
            color: 'rgba(0,0,0,0)',
            width: 4
          })
        })
        let coastlineSHow = new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 4
          })
        })
        if(checked){
          linecoastline.getSource().getFeatures().forEach((item)=>{
            if(data.id == item.values_.SBF){
              console.log(item);
              item.setStyle(coastlineSHow)
            }
          })
          yclinecoastline.getSource().getFeatures().forEach((item)=>{
            if(data.id == item.values_.SBF){
              item.setStyle(coastlineSHow)
            }
          })
        }else{
          linecoastline.getSource().getFeatures().forEach((item)=>{
            if(data.id == item.values_.SBF){
              item.setStyle(coastline)
            }
          })
          yclinecoastline.getSource().getFeatures().forEach((item)=>{
            if(data.id == item.values_.SBF){
              item.setStyle(coastline)
            }
          })
        }
      }
      if(checked){
        this.loading = false
      }
    },
    // 国土规划下拉框选中的值
    portPlanCityChange(val) {
      this.regionCheckList = [
        '城镇开发边界',
        '生态保护红线',
        '生态空间管控区',
        '永久基本农田'
      ],
      console.log(this.portPlanCitySelectValue)
      if(this.portPlanCitySelectValue == '全省'){
        this.ycshow()
        this.zjshow()
      }else if (this.portPlanCitySelectValue == '镇江市' ) {
        this.zjshow()
        this.ycisshow()
      } else if(this.portPlanCitySelectValue == '盐城市' ){
        this.zjisshow()
        this.ycshow()
      } else {
        this.zjisshow()
        this.ycisshow()
      }
    },
    // 镇江市国土规划显示
    zjshow(){
      polygonyjjbnt.setVisible(true)
      polygonecologicalRedLines.setVisible(true)
      polygonecospace.setVisible(true)
      polygondevelopment.setVisible(true)
    },
    // 镇江市国土规划隐藏
    zjisshow(){
      polygonyjjbnt.setVisible(false)
      polygonecologicalRedLines.setVisible(false)
      polygonecospace.setVisible(false)
      polygondevelopment.setVisible(false)
    },
    // 盐城市国土规划显示
    ycshow(){
      ycpolygondevelopment.setVisible(true)
      ycpolygonecospace.setVisible(true)
      ycpolygonecospace1.setVisible(true)
    },
    // 盐城市国土规划隐藏
    ycisshow(){
      ycpolygondevelopment.setVisible(false)
      ycpolygonecospace.setVisible(false)
      ycpolygonecospace1.setVisible(false)
    },
    hideRight() {
      if (this.rightHideFlag) {
        console.log(this.rightHideFlag)
        this.rightHide = true
        this.rightHideFlag = false
      } else {
        this.rightHide = false
        this.rightHideFlag = true
      }
      // map.updateSize()
      setTimeout(() => {
        map.updateSize()
      }, 1000)
    },
    hideleft() {
      if (this.leftHideFlag) {
        this.leftHide = true
        this.leftHideFlag = false
      } else {
        this.leftHide = false
        this.leftHideFlag = true
      }
      if (this.current === 4) {
        this.rightHide = true
      }

      // map.updateSize()
      setTimeout(() => {
        map.updateSize()
      }, 1000)
    },
    highStyleFunction() {
      return
    },
    // 树节点过滤
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
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
    // // 更改选中行背景色
    rowStyle({ row }) {
      if (this.name === row.name) {
        return { 'background-color': '#009bf9', cursor: 'pointer' }
      }
    },
    //点击左侧菜单
    addClass(index) {
      this.loading = true
      this.current = index
      this.sonmenuShow = false
      this.total = 0 //分页
      this.pagesize = 18 //分页
      this.pageno = 1 //分页
      this.tableData = []
      this.lefttulie = true
      this.tablequery = ''
      this.sonmueIndex = 0
      this.gisCityShow = false
      this.gisAdministrativeShow = false
      this.gisChannelNameShow = false
      if (this.totalMileageCharts) this.totalMileageCharts.clear()
      if (this.totalModelCharts) this.totalModelCharts.clear()
      if (this.cityModelCharts) this.cityModelCharts.clear()
      this.echartsInit()
      this.treeData = []
      this.portOrShorelineIndex = 0
      this.filterText = ''
      // this.echartsResize();
      setTimeout(() => {
        this.echartsResize()
      }, 500)
      setTimeout(() => {
        map.updateSize()
      }, 3000)
      this.reset()
      this.tableDataAll = []
      this.legendFlag['船闸'] = false
      this.legendFlag['桥梁'] = false
      this.legendFlag['航道'] = false
      this.legendFlag['锚地'] = false
      this.legendFlag['码头'] = false
      this.legendFlag['洗舱站'] = false
      this.legendFlag['服务区'] = false
      this.legendFlag['港口'] = false
      this.legendFlag['空间规划'] = false
      polygonchannelplan.setVisible(false) //航道图层
      linebranchchannelplan.setVisible(false) //支线航道规划图层
      this.channelshowxz = false
      this.channelshowgh = false
      this.ycisshow()
      this.mapcity = '全省'
      this.mapAdministrative = '全省'
      this.mapChannelName = '全省'
      this.checkedList = []
      if (index === 0) {
        //码头
        // this.treeid = 'objectid'
        this.getAllBaseBerth() // 码头树形图全部信息
        this.detailLabel = []
        this.detailLabel = BaseBerth
        this.legendFlag['码头'] = true
        // this.lineLayerWhart.setVisible(true)
        // this.lineLayershoreline.setVisible(false)
        // this.positionLayercab.setVisible(false)
        polygonyjjbnt.setVisible(false) //永久基本农田图层
        polygonecologicalRedLines.setVisible(false) //国家级生态保护红线图层
        polygonecospace.setVisible(false) //生态空间管控区图层
        polygondevelopment.setVisible(false) //城镇开发边界图层
        polygonchannel.setVisible(false) //航道图层
        linebranchchannel.setVisible(false) //航道支线图层
        polygonanchorage.setVisible(false) //锚地图层
        pointbridge.setVisible(false) //桥梁图层
        pointservice.setVisible(false) //服务区图层
        pointshiplock.setVisible(false) //船闸图层
        pointwashing.setVisible(false) //洗舱站图层
        linecoastline.setVisible(false) //姜堰岸线图层
        yclinecoastline.setVisible(false) //盐城岸线图层
        this.WharfJsonShow() //码头图层
        polygonworkzone.setVisible(false) //作业区图层
        tzpolygonworkzone.setVisible(false) //作业区图层
        this.showTree = true
        this.getWharfTree()
        this.getWharfAllCount()
        this.getWharfCount()
        this.getWharfType()
        this.getWharfGrade()
      } else if (index === 1) {
        //航道
        // this.treeid = 'objectid'
        this.channelshowxz = true
        this.detailLabel = []
        this.detailLabel = situationchannel
        this.showTree = true
        this.legendFlag['航道'] = true
        // this.lineLayerWhart.setVisible(false)
        // this.lineLayershoreline.setVisible(false)
        // this.positionLayercab.setVisible(false)
        polygonyjjbnt.setVisible(false) //永久基本农田图层
        polygonecologicalRedLines.setVisible(false) //国家级生态保护红线图层
        polygonecospace.setVisible(false) //生态空间管控区图层
        polygondevelopment.setVisible(false) //城镇开发边界图层
        polygonchannel.setVisible(true) //航道图层
        linebranchchannel.setVisible(true) //航道支线图层
        polygonanchorage.setVisible(false) //锚地图层
        pointbridge.setVisible(false) //桥梁图层
        pointwashing.setVisible(false) //洗舱站图层
        linecoastline.setVisible(false) //姜堰岸线图层
        yclinecoastline.setVisible(false) //盐城岸线图层
        pointshiplock.setVisible(false) //船闸图层
        this.WharfJsonHide() //码头图层
        pointservice.setVisible(false) //服务区图层
        polygonworkzone.setVisible(false) //作业区图层
        tzpolygonworkzone.setVisible(false) //作业区图层
        this.getChannelTable()
        this.getChannelAllCount()
        this.getChannelLine()
        this.getChannelCircular()
        this.getChannelColumn()
        this.getAllChannelTable() // 航道所有数据
      } else if (index === 2) {
        //船闸
        // this.treeid = 'id'
        this.detailLabel = []
        this.detailLabel = situationlock
        this.legendFlag['船闸'] = true
        // this.lineLayerWhart.setVisible(false)
        // this.lineLayershoreline.setVisible(false)
        // this.positionLayercab.setVisible(false)
        polygonyjjbnt.setVisible(false) //永久基本农田图层
        polygonecologicalRedLines.setVisible(false) //国家级生态保护红线图层
        polygonecospace.setVisible(false) //生态空间管控区图层
        polygondevelopment.setVisible(false) //城镇开发边界图层
        polygonchannel.setVisible(false) //航道图层
        linebranchchannel.setVisible(false) //航道支线图层
        polygonanchorage.setVisible(false) //锚地图层
        pointbridge.setVisible(false) //桥梁图层
        pointwashing.setVisible(false) //洗舱站图层
        linecoastline.setVisible(false) //姜堰岸线图层
        yclinecoastline.setVisible(false) //盐城岸线图层
        pointservice.setVisible(false) //服务区图层
        pointshiplock.setVisible(true) //船闸图层
        this.WharfJsonHide() //码头图层
        polygonworkzone.setVisible(false) //作业区图层
        tzpolygonworkzone.setVisible(false) //作业区图层
        this.showTree = true
        
        this.getShipLockAllCount()
        this.getShipLockLine()
        this.getShipLockCircular()
        this.getShipLockColumn()
        this.getShipLockTreeAll() // 船闸所有数据
        this.getShipLockTree()
      } else if (index === 3) {
        //锚地
        this.detailLabel = []
        this.detailLabel = situationanchorage
        this.showTree = true
        this.legendFlag['锚地'] = true
        // this.lineLayerWhart.setVisible(false)
        // this.lineLayershoreline.setVisible(false)
        // this.positionLayercab.setVisible(false)
        polygonyjjbnt.setVisible(false) //永久基本农田图层
        polygonecologicalRedLines.setVisible(false) //国家级生态保护红线图层
        polygonecospace.setVisible(false) //生态空间管控区图层
        polygondevelopment.setVisible(false) //城镇开发边界图层
        polygonchannel.setVisible(false) //航道图层
        linebranchchannel.setVisible(false) //航道支线图层
        polygonanchorage.setVisible(true) //锚地图层
        pointbridge.setVisible(false) //桥梁图层
        pointwashing.setVisible(false) //洗舱站图层
        linecoastline.setVisible(false) //姜堰岸线图层
        yclinecoastline.setVisible(false) //盐城岸线图层
        pointservice.setVisible(false) //服务区图层
        pointshiplock.setVisible(false) //船闸图层
        this.WharfJsonHide() //码头图层
        polygonworkzone.setVisible(false) //作业区图层
        tzpolygonworkzone.setVisible(false) //作业区图层
        this.getAnchorageAllCount()
        this.getAllAnchorage()
        this.getAnchorageType()
        this.getAnchorageCategory()
        this.getAnchoragePlan()
        this.getAllAnchorageTable()
      } else if (index === 4) {
        //其他
        this.gisCityShow = true
        this.gisAdministrativeShow = true
        this.gisChannelNameShow = true
        this.detailLabel = []
        this.detailLabel = infrastructurebridge
        this.legendFlag['桥梁'] = true
        // this.positionLayercab.setVisible(false)
        // this.lineLayerWhart.setVisible(false)
        // this.lineLayershoreline.setVisible(false)
        this.sonmenuShow = true
        this.showTree = true
        this.getBridgeTree()
        this.getBaseBridge() // 桥梁树形图所有数据
        polygonyjjbnt.setVisible(false) //永久基本农田图层
        polygonecologicalRedLines.setVisible(false) //国家级生态保护红线图层
        polygonecospace.setVisible(false) //生态空间管控区图层
        polygondevelopment.setVisible(false) //城镇开发边界图层
        polygonchannel.setVisible(false) //航道图层
        linebranchchannel.setVisible(false) //航道支线图层
        polygonanchorage.setVisible(false) //锚地图层
        pointbridge.setVisible(true) //桥梁图层
        pointwashing.setVisible(false) //洗舱站图层
        linecoastline.setVisible(false) //姜堰岸线图层
        yclinecoastline.setVisible(false) //盐城岸线图层
        pointservice.setVisible(false) //服务区图层
        pointshiplock.setVisible(false) //船闸图层
        this.WharfJsonHide() //码头图层
        polygonworkzone.setVisible(false) //作业区图层
        tzpolygonworkzone.setVisible(false) //作业区图层
        // this.getBaseWaterservice()
      } else if (index === 5) {
        //港口
        this.showTree = true
        this.detailLabel = []
        this.detailLabel = portoperationarea
        this.legendFlag['港口'] = true
        // this.getBasePortplanning()
        // this.showTree = true
        this.getPortTree()
        this.getAllPortTree()
        // this.getwork()
        this.getGkAllCount()
        this.getGknum()
        this.getIsuse()
        this.getGqmun()
        polygonyjjbnt.setVisible(false) //永久基本农田图层
        polygonecologicalRedLines.setVisible(false) //国家级生态保护红线图层
        polygonecospace.setVisible(false) //生态空间管控区图层
        polygondevelopment.setVisible(false) //城镇开发边界图层
        // this.positionLayercab.setVisible(false)
        // this.lineLayerWhart.setVisible(false)
        // this.lineLayershoreline.setVisible(false)
        polygonchannel.setVisible(false) //航道图层
        linebranchchannel.setVisible(false) //航道支线图层
        polygonanchorage.setVisible(false) //锚地图层
        pointbridge.setVisible(false) //桥梁图层
        pointwashing.setVisible(false) //洗舱站图层
        linecoastline.setVisible(false) //姜堰岸线图层
        yclinecoastline.setVisible(false) //盐城岸线图层
        pointservice.setVisible(false) //服务区图层
        pointshiplock.setVisible(false) //船闸图层
        this.WharfJsonHide() //码头图层
        polygonworkzone.setVisible(true) //作业区图层
        tzpolygonworkzone.setVisible(true) //作业区图层
      } else if (index === 6) {
        //国土
        this.loading = false
        console.log(this.detailLabel)
        this.legendFlag['空间规划'] = true
        // this.positionLayercab.setVisible(false)
        // this.lineLayerWhart.setVisible(false)
        // this.lineLayershoreline.setVisible(false)
        polygonyjjbnt.setVisible(true) //永久基本农田图层
        polygonecologicalRedLines.setVisible(true) //国家级生态保护红线图层
        polygonecospace.setVisible(true) //生态空间管控区图层
        polygondevelopment.setVisible(true) //城镇开发边界图层
        polygonchannel.setVisible(false) //航道图层
        linebranchchannel.setVisible(false) //航道支线图层
        polygonanchorage.setVisible(false) //锚地图层
        pointbridge.setVisible(false) //桥梁图层
        pointwashing.setVisible(false) //洗舱站图层
        linecoastline.setVisible(false) //姜堰岸线图层
        yclinecoastline.setVisible(false) //盐城岸线图层
        pointservice.setVisible(false) //服务区图层
        pointshiplock.setVisible(false) //船闸图层
        this.WharfJsonHide() //码头图层
        // this.positionLayercab.setVisible(false)
        // this.lineLayerWhart.setVisible(false)
        // this.lineLayershoreline.setVisible(false)
        polygonworkzone.setVisible(false) //作业区图层
        tzpolygonworkzone.setVisible(false) //作业区图层
        ycpolygondevelopment.setVisible(true) //城镇开发边界图层(盐城)
        ycpolygonecospace.setVisible(true) // 生态空间管控区图层(盐城市-国家)
        ycpolygonecospace1.setVisible(true) // 生态空间管控区图层(盐城市-省级)
      }
    },
    //其他子菜单高亮
    addSomeClass(index) {
      console.log(index)
      this.sonmueIndex = index
      this.fourindex = this.sonmueIndex
      this.total = 0 //分页
      this.pagesize = 18 //分页
      this.pageno = 1 //分页
      this.tableData = []
      this.tablequery = ''
      this.reset()
      this.legendFlag['船闸'] = false
      this.legendFlag['桥梁'] = false
      this.legendFlag['航道'] = false
      this.legendFlag['锚地'] = false
      this.legendFlag['码头'] = false
      this.legendFlag['洗舱站'] = false
      this.legendFlag['服务区'] = false
      this.legendFlag['港口'] = false
      this.legendFlag['空间规划'] = false
      polygonchannelplan.setVisible(false) //航道图层
      linebranchchannelplan.setVisible(false) //支线航道规划图层
      this.gisCityShow = false
      this.gisAdministrativeShow = false
      this.gisChannelNameShow = false
      if (index == 1) {
        // 服务区
        ;(this.sonmenuShow = false), (this.detailLabel = [])
        this.detailLabel = BaseWaterservice
        this.legendFlag['服务区'] = true
        this.showTree = false
        this.getWaterserviceTable()
        this.getAllBaseWaterservice()
        // this.getBaseWaterservice()
        polygonchannel.setVisible(false) //航道图层
        linebranchchannel.setVisible(false) //航道支线图层
        polygonanchorage.setVisible(false) //码头图层
        pointbridge.setVisible(false) //桥梁图层
        pointwashing.setVisible(false) //洗舱站图层
        linecoastline.setVisible(false) //姜堰岸线图层
        yclinecoastline.setVisible(false) //盐城岸线图层
        pointservice.setVisible(true) //服务区图层
        pointshiplock.setVisible(false) //船闸图层
        this.WharfJsonHide() //码头图层
      } else if (index == 2) {
        // 洗舱站
        ;(this.sonmenuShow = false), (this.detailLabel = [])
        this.detailLabel = BaseCabinwashing
        this.legendFlag['洗舱站'] = true
        // this.positionLayercab.setVisible(true)
        // this.lineLayerWhart.setVisible(false)
        // this.lineLayershoreline.setVisible(false)
        polygonchannel.setVisible(false) //航道图层
        linebranchchannel.setVisible(false) //航道支线图层
        polygonanchorage.setVisible(false) //码头图层
        pointbridge.setVisible(false) //桥梁图层
        pointwashing.setVisible(true) //洗舱站图层
        linecoastline.setVisible(false) //姜堰岸线图层
        yclinecoastline.setVisible(false) //盐城岸线图层
        pointservice.setVisible(false) //服务区图层
        pointshiplock.setVisible(false) //船闸图层
        this.WharfJsonHide() //码头图层
        this.showTree = false
        this.getCabinwashingTable()
        // this.getBaseCabinwashing()
      } else {
        // 桥梁
        this.gisCityShow = true
        this.gisAdministrativeShow = true
        this.gisChannelNameShow = true
        ;(this.sonmenuShow = false), (this.detailLabel = [])
        this.detailLabel = infrastructurebridge
        this.legendFlag['桥梁'] = true
        // this.positionLayercab.setVisible(false)
        // this.lineLayerWhart.setVisible(false)
        // this.lineLayershoreline.setVisible(false)
        polygonchannel.setVisible(false) //航道图层
        linebranchchannel.setVisible(false) //航道支线图层
        polygonanchorage.setVisible(false) //码头图层
        pointbridge.setVisible(true) //桥梁图层
        pointwashing.setVisible(false) //洗舱站图层
        linecoastline.setVisible(false) //姜堰岸线图层
        yclinecoastline.setVisible(false) //盐城岸线图层
        pointshiplock.setVisible(false) //船闸图层
        this.WharfJsonHide() //码头图层
        pointservice.setVisible(false) //服务区图层
        this.showTree = true
        this.getBridgeTree()
        this.getBaseBridge() // 桥梁树形图所有数据
      }
    },
    // 锚地翻页
    handlePageNoChange(count) {
      this.pageno = count
      // this.getAllAnchorage()
      // if (this.current === 1) {
      //   this.getChannelTable()
      // } else {
      //   this.getAllAnchorage()
      // }
    },
    // echarts Init
    echartsInit() {
      // 第一个折线图
      this.totalMileageCharts = echarts.init(
        document.getElementById('echarts-total-mileage')
      )
      let xAxisData = []
      let seriesData = []
      let totalMileageOption = {
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
          width: '90%',
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
      // 第二个饼图
      this.totalModelCharts = echarts.init(
        document.getElementById('echarts-total-model')
      )
      let totalModelOption = {
        title: {
          text: '',
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
        legend: [
          // {
          //   orient: 'horizontal',
          //   icon: 'circle',
          //   itemWidth: 10, // 设置宽度class
          //   itemHeight: 10, // 设置高度im
          //   itemGap: 40, // 设置间距
          //   x: '220',
          //   right: 100,
          //   data: [],
          //   bottom: 135,
          //   textStyle: {
          //     fontSize: '12',
          //     color: '#666666'
          //   }
          // },
          // {
          //   orient: 'horizontal',
          //   icon: 'circle',
          //   x: '220',
          //   bottom: 90,
          //   right: 100,
          //   itemWidth: 10, // 设置宽度class
          //   itemHeight: 10, // 设置高度im
          //   itemGap: 40, // 设置间距
          //   data: [],
          //   textStyle: {
          //     fontSize: '12',
          //     color: '#666666'
          //   }
          // },
          // {
          //   orient: 'horizontal',
          //   icon: 'circle',
          //   x: '220',
          //   bottom: 45,
          //   right: 100,
          //   itemWidth: 10, // 设置宽度class
          //   itemHeight: 10, // 设置高度im
          //   itemGap: 40, // 设置间距
          //   data: [],
          //   textStyle: {
          //     fontSize: '12',
          //     color: '#666666'
          //   }
          // }
        ],
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['25%', '55%'],
            avoidLabelOverlap: false,
            itemStyle: {
              // borderRadius: 10,
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
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: []
          }
        ]
      }
      this.totalModelCharts.setOption(totalModelOption)
      // 第三个柱状
      this.cityModelCharts = echarts.init(
        document.getElementById('echarts-city-model')
      )
      let xAxisData2 = []
      let seriesData2 = []
      let cityModelOption = {
        title: {
          text: '',
          textStyle: {
            color: '#000',
            fontSize: this.fontSize(0.16)
          },
          top: '3%'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '2%',
          bottom: '4%',
          width: '90%',
          height: '68%',
          containLabel: true
        },
        legend: {
          top: '3%',
          data: []
        },
        xAxis: [
          {
            name: '地级市',
            nameTextStyle: {
              color: '#999'
            },
            data: xAxisData2,
            axisLabel: {
              interval: 0,
              rotate: 0,
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
      this.cityModelCharts.setOption(cityModelOption)
    },
    // 港口规划
    selectPortOrShoreline(item, index) {
      console.log(item)
      this.portOrShorelineIndex = index
      this.reset()
      polygonchannelplan.setVisible(false) //航道图层
      linebranchchannelplan.setVisible(false) //支线航道规划图层
      console.log(this.portOrShorelineIndex)
      if (this.portOrShorelineIndex == 1) {
        // 岸线
        this.showTree = true
        this.detailLabel = []
        this.detailLabel = tBaseShoreline
        // this.lineLayershoreline.setVisible(true)
        // this.lineLayerWhart.setVisible(false)
        // this.positionLayercab.setVisible(false)
        polygonchannel.setVisible(false) //航道图层
        linebranchchannel.setVisible(false) //航道支线图层
        polygonanchorage.setVisible(false) //锚地图层
        pointbridge.setVisible(false) //桥梁图层
        pointwashing.setVisible(false) //洗舱站图层
        linecoastline.setVisible(true) //姜堰岸线图层
        yclinecoastline.setVisible(true) //盐城岸线图层
        pointservice.setVisible(false) //服务区图层
        pointshiplock.setVisible(false) //船闸图层
        polygonworkzone.setVisible(false) //作业区图层
        tzpolygonworkzone.setVisible(false) //作业区图层
        this.WharfJsonHide() //码头图层
        this.getShorelineTree()

        this.gettBaseShoreline() // 岸线所有数据
      } else {
        // 作业区
        this.detailLabel = []
        // this.detailLabel = BasePortplanning
        this.detailLabel = portoperationarea
        this.getPortTree()
        this.getAllPortTree()
        // this.getwork()
        // this.showTree = false;
        polygonworkzone.setVisible(true) //作业区图层
        tzpolygonworkzone.setVisible(true) //作业区图层
        linecoastline.setVisible(false) //姜堰岸线图层
        yclinecoastline.setVisible(false) //盐城岸线图层
        // this.lineLayershoreline.setVisible(false)
        // this.lineLayerWhart.setVisible(false)
        // this.positionLayercab.setVisible(false)
        polygonchannel.setVisible(false) //航道图层
        linebranchchannel.setVisible(false) //航道支线图层
        polygonanchorage.setVisible(false) //锚地图层
        pointbridge.setVisible(false) //桥梁图层
        pointwashing.setVisible(false) //洗舱站图层
        pointservice.setVisible(false) //服务区图层
        pointshiplock.setVisible(false) //船闸图层
        this.WharfJsonHide() //码头图层
      }
    },
    // 港口作业区左侧table
    async getwork() {
      let { res, status } = await infrastructure.getworkTable({
        pageno: this.pageno,
        pagesize: this.pagesize,
        name: this.tablequery
      })
      console.log(this.tablequery)
      if (status === 200) {
        let data = res.data
        this.total = data.totalcount
        this.tableData = data.results
        // data.results.forEach(r=>{
        //   console.log(r);
        //   this.alldatas = r
        //   console.log(this.alldatas);
        // })
      } else {
        this.total = data.totalcount
        this.tableData = []
      }
    },
    // 获取港口树状图
    async getPortTree() {
      // console.log(infrastructure)
      let { res, status } = await infrastructure.getPortTree()
      if (status === 200) {
        this.treeData = res.data
      } else {
        this.treeData = []
      }
    },
    // 获取岸线树状图
    async getShorelineTree() {
      // console.log(infrastructure)
      let { res, status } = await infrastructure.getShorelineTree()
      if (status === 200) {
        this.treeData = res.data
      } else {
        this.treeData = []
      }
    },
    //港口统计数量
    async getGkAllCount() {
      let { res, status } = await infrastructure.getGkAllCount()
      if (status === 200) {
        this.allCount = res.data
      } else {
        this.allCount = []
      }
    },
    //港口第一个图表
    async getGknum() {
      let { res, status } = await infrastructure.getGknum()
      if (status === 200) {
        let name = []
        let forward = []
        let recent = []
        let legendData = ['远期', '近期']
        let data = res.data
        data.forEach((r) => {
          name.push(r.cityName)
          forward.push(r.forward)
          recent.push(r.recent)
        })
        if (this.totalMileageCharts) {
          this.totalMileageCharts.setOption({
            legend: {
              data: legendData
            },
            title: {
              text: '分市作业区数量'
            },
            xAxis: [
              {
                // name: "地级市",
                data: name,
                axisLabel: {
                  rotate: 40
                }
              }
            ],
            series: [
              {
                name: '远期',
                type: 'bar',
                stack: 'total',
                label: {
                  show: false
                },
                emphasis: {
                  focus: 'series'
                },
                data: forward,
                barWidth: 15
              },
              {
                name: '近期',
                type: 'bar',
                stack: 'total',
                label: {
                  show: false
                },
                emphasis: {
                  focus: 'series'
                },
                data: recent,
                barWidth: 15
              }
            ]
          })
        }
      } else {
        if (this.totalMileageCharts) {
          this.totalMileageCharts.setOption({
            title: {
              text: '分市作业区数量'
            },
            xAxis: [
              {
                name: '地级市',
                data: []
              }
            ],
            series: []
          })
        }
      }
    },
    //港口第二个图表
    async getIsuse() {
      let { res, status } = await infrastructure.getIsuse()
      let xData = []
      let yData = []
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
          if (r[0] == 'order') {
            r.splice(0, 2)
          } else {
            name.push(r[0])
            numbers.push({ name: r[0], value: r[1] })
          }
        })
        let legendData = name.map((r) => {
          return {
            icon: 'circle',
            itemWidth: 10, // 设置宽度class
            itemHeight: 10, // 设置高度im
            itemGap: 40, // 设置间距
            itemGap: 20, // 设置间距
            top: '20%',
            x: '50%',
            right: '10%',
            bottom: 135,
            data:name
          }
        })
        if (this.totalModelCharts) {
          this.totalModelCharts.setOption({
            title: {
              text: '作业区数量结构'
            },
            legend: legendData,
            // legend: {
            //   // type: 'scroll',
            //   // orient: 'vertical',
            //   icon: 'circle',
            //   itemWidth: 10, // 设置宽度class
            //   itemHeight: 10, // 设置高度im
            //   itemGap: 20, // 设置间距
            //   top: '10%',
            //   x: '50%',
            //   right: '10%',
            //   bottom: 135,
            //   data:nmaes,
            //   // formatter: function (name) {
            //   //   // 获取legend显示内容
            //   //   let data = name //你的数据
            //   //   let total = 0
            //   //   let tarValue = 0
            //   //   let value = 0
            //   //   for (let i = 0, l = data.length; i < l; i++) {
            //   //     total += data[i].value
            //   //     if (data[i].name == name) {
            //   //       tarValue = data[i].value
            //   //       value = data[i].value
            //   //     }
            //   //   }
            //   //   return [
            //   //     '{a|' +
            //   //       echarts.format.truncateText(
            //   //         name,
            //   //         150,
            //   //         '14px Microsoft Yahei',
            //   //         '…'
            //   //       ) +
            //   //       '}'
            //   //   ].join(' ')
            //   // },
            //   // tooltip: {
            //   //   show: true
            //   // },
            //   // textStyle: {
            //   //   rich: {
            //   //     a: {
            //   //       color: 'rgb(51,51,51)',
            //   //       width: 80,
            //   //       align: 'left'
            //   //     },
            //   //     b: {
            //   //       width: 50,
            //   //       align: 'left',
            //   //       color: 'rgb(51,51,51)'
            //   //     },
            //   //     x: {
            //   //       width: 30,
            //   //       align: 'left',
            //   //       color: 'rgb(51,51,51)'
            //   //     }
            //   //   }
            //   // }
            // },
            series: [
              {
                data: numbers
              }
            ]
          })
        }
      }
    },
    //港口第三个图表
    async getGqmun() {
      let { res, status } = await infrastructure.getGqmun()
      if (status === 200) {
        let name = []
        let coastalAndAlongRiver = []
        let inlandRiver = []
        let legendData = ['沿海沿江', '内河']
        let data = res.data
        data.forEach((r) => {
          name.push(r.cityName)
          coastalAndAlongRiver.push(r.coastalAndAlongRiver)
          inlandRiver.push(r.inlandRiver)
        })
        // let legendData = Object.keys(data.num[0])
        // console.log(data);
        // let yData = []
        // legendData.forEach((r) => {
        //   var obj = {
        //     name: r,
        //     type: 'bar',
        //     stack: 'total',
        //     // label: {
        //     //   show: true
        //     // },
        //     emphasis: {
        //       focus: 'series'
        //     },
        //     data: data.num[0][r]
        //   }
        //   yData.push(obj)
        // })
        if (this.cityModelCharts) {
          this.cityModelCharts.setOption({
            title: {
              text: '分市作业区面积'
            },
            legend: {
              data: legendData
            },
            xAxis: [
              {
                name: '',
                data: name,
                axisLabel: {
                  rotate: 40
                }
              }
            ],
            series: [
              {
                name: '沿海沿江',
                type: 'bar',
                stack: 'total',
                label: {
                  show: false
                },
                emphasis: {
                  focus: 'series'
                },
                data: coastalAndAlongRiver,
                barWidth: 15
              },
              {
                name: '内河',
                type: 'bar',
                stack: 'total',
                label: {
                  show: false
                },
                emphasis: {
                  focus: 'series'
                },
                data: inlandRiver,
                barWidth: 15
              }
            ]
          })
        }
      } else {
        if (this.cityModelCharts) {
          this.cityModelCharts.setOption({
            title: {
              text: '分市作业区面积'
            },
            xAxis: [
              {
                data: [],
                axisLabel: {
                  rotate: 40
                }
              }
            ],
            series: []
          })
        }
      }
    },
    //获取码头树状图
    async getWharfTree() {
      let data = {
        keyword:this.filterText
      }
      let { res, status } = await infrastructure.getWharfTree(data)
      if (status === 200) {
        this.treeData = res.data
      } else {
        this.treeData = []
      }
    },
    //码头统计数据
    async getWharfAllCount() {
      let { res, status } = await infrastructure.getWharfAllCount()
      if (status === 200) {
        this.allCount = res.data
      } else {
        allCount = []
      }
    },
    //码头第一个图表
    async getWharfCount() {
      let { res, status } = await infrastructure.getWharfCount()
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
          if (r[0] == 'order') {
            r.splice(0, 2)
          } else {
            name.push(r[0])
            numbers.push(r[1])
          }
        })
        if (this.totalMileageCharts) {
          this.totalMileageCharts.setOption({
            title: {
              text: '分市泊位数量(个)',
              textStyle: {
                fontSize: this.fontSize(0.16)
              }
            },
            xAxis: [
              {
                data: name,
                axisLabel: {
                  rotate: 40
                }
              }
            ],
            series: [
              {
                type: 'bar',
                label: {
                  show: true,
                  position: 'top'
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(123, 176, 255, 0.5)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(123, 176, 255, 0.8)'
                        }
                      ],
                      false
                    ),
                    shadowColor: 'rgba(123, 176, 255, 0.1)',
                    shadowBlur: 10
                  }
                },
                data: numbers
              }
            ]
          })
        }
      }
    },
    //码头第二个图表
    async getWharfType() {
      let { res, status } = await infrastructure.getWharfType()
      let xData = []
      let yData = []
      let xDatas = []
      if (status === 200) {
        let data = res.data
        xData = Object.keys(data)
        console.log(xDatas)
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
        yData.forEach((r) => {
          if (r.name == 'inlandRiverBerthCount') {
            r.name = '内河'
          } else if (r.name == 'coastalBerthCount') {
            r.name = '沿海'
          } else if (r.name == 'alongRiverBerthCount') {
            r.name = '沿江'
          }
        })
        console.log(yData)
        let legendData = result.map((r) => {
          console.log(r)
          if (r[0] == 'inlandRiverBerthCount') {
            r[0] = '内河'
          }
          if (r[1] == 'coastalBerthCount') {
            r[1] = '沿海'
          }
          if (r[2] == 'alongRiverBerthCount') {
            r[2] = '沿江'
          }
          console.log(r)
          return {
            orient: 'vertical',
            icon: 'circle',
            itemWidth: 10, // 设置宽度class
            itemHeight: 10, // 设置高度im
            itemGap: 40, // 设置间距
            itemGap: 20, // 设置间距
            top: '20%',
            // x: '220',
            right: '30%',
            bottom: 135,

            data: r ? r : []
          }
        })
        if (this.totalModelCharts) {
          this.totalModelCharts.setOption({
            title: {
              text: '分类别泊数量(个)',
              textStyle: {
                fontSize: this.fontSize(0.16)
              }
            },
            legend: legendData,
            series: [
              {
                data: yData
              }
            ]
          })
        }
      }
    },
    //码头第三个图表
    async getWharfGrade() {
      let { res, status } = await infrastructure.getWharfGrade()
      if (status === 200) {
        let data = res.data
        // let all = []
        // let aaa = []
        // let bbb = []
        let name = Object.keys(data)
        // for(let i in data){
        //   console.log(i);
        //   console.log(data);
        //   console.log(data[i]);
        //   if(i == "万吨级以下"){
        //     aaa.push(i)
        //     bbb.push(data[i])
        //   }else if(i == "一万至五万吨级"){
        //     aaa.push(i)
        //     bbb.push(data[i])
        //   }else if(i == "五万吨级以上"){
        //     aaa.push(i)
        //     bbb.push(data[i])
        //   }
        // }
        let num = Object.values(data)
        if (this.cityModelCharts) {
          this.cityModelCharts.setOption({
            title: {
              text: '分等级泊位数量(个)',
              textStyle: {
                fontSize: this.fontSize(0.16)
              }
            },
            xAxis: [
              {
                name: '',
                data: name,
                axisLabel: {
                  rotate: 0
                }
              }
            ],
            series: [
              {
                type: 'bar',
                label: {
                  show: true,
                  position: 'top'
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(123, 176, 255, 0.5)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(123, 176, 255, 0.8)'
                        }
                      ],
                      false
                    ),
                    shadowColor: 'rgba(123, 176, 255, 0.1)',
                    shadowBlur: 10
                  }
                },
                data: num
              }
            ]
          })
        }
      }
    },
    //锚地表格
    async getAllAnchorage() {
      let { res, status } = await infrastructure.getAllAnchorage({
        pageno: this.pageno,
        pagesize: this.pagesize,
        name: this.tablequery,
        keyword:this.filterText
      })
      if (status === 200) {
        let data = res.data
        console.log(data.totalcount)
        this.total = data.totalcount
        this.treeData = data.results
        // console.log(this.tableData)
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    //锚地总量
    async getAnchorageAllCount() {
      let { res, status } = await infrastructure.getAnchorageAllCount()
      if (status === 200) {
        console.log(res)
        this.allCount = res.data
      } else {
        this.allCount = []
      }
    },
    //锚地第一个图表
    async getAnchorageType() {
      let { res, status } = await infrastructure.getAnchorageCategory()
      if (status === 200) {
        let data = res.data
        console.log(data)
        let aa = []
        let name = []
        let num1 = []
        let num2 = []
        data.forEach((r) => {
          aa.push(Object.values(r))
        })
        aa.forEach((r) => {
          name.push(r[2])
          num1.push(r[0])
          num2.push(r[1])
        })
        if (this.totalMileageCharts) {
          this.totalMileageCharts.setOption({
            title: {
              text: '分市锚地及锚位数量'
            },
            xAxis: [
              {
                name: '',
                data: name,
                axisLabel: {
                  rotate: 40
                }
              }
            ],
            yAxis: [
              {
                name: '锚地数量'
              },
              {
                name: '锚位数量'
              }
            ],
            legend: {
              padding: [25, 0, 0, 0],
              data: ['锚地数量', '锚位数量']
            },
            series: [
              {
                name: '锚地数量',
                data: num1,
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
                      color: 'rgba(71, 255, 153,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(71, 255, 153,0)'
                    }
                  ])
                }
              },
              {
                name: '锚位数量',
                yAxisIndex: 1,
                type: 'bar',
                label: {
                  show: false,
                  position: 'top'
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(123, 176, 255, 0.5)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(123, 176, 255, 0.8)'
                        }
                      ],
                      false
                    ),
                    shadowColor: 'rgba(123, 176, 255, 0.1)',
                    shadowBlur: 10
                  }
                },
                data: num2
              }
            ]
          })
        }
      } else {
        if (this.totalMileageCharts) {
          this.totalMileageCharts.setOption({
            title: {
              text: '分市锚地及锚位数量'
            },
            xAxis: [
              {
                name: '',
                data: []
              }
            ],
            series: [
              {
                data: []
              }
            ]
          })
        }
      }
    },
    //锚地第二个图表
    async getAnchorageCategory() {
      let { res, status } = await infrastructure.getAnchorageCategory()
      let xData = []
      let yData = []
      if (status === 200) {
        let data = res.data
        let name = []
        let number = []
        let numbers = []
        let all = []
        let names = []

        for (let i in data) {
          console.log(data[i]);
          names.push(data[i].city)
          numbers.push({ name: data[i].city, value: data[i].anchorageGroundCount })
        }
        console.log(names,numbers);
        if (this.totalModelCharts) {
          this.totalModelCharts.setOption({
            title: {
              text: '分市锚地数量-饼图'
            },
            // legend: legendData,
            legend: {
              // type: 'scroll',
              // orient: 'vertical',
              icon: 'circle',
              itemWidth: 10, // 设置宽度class
              itemHeight: 10, // 设置高度im
              itemGap: 20, // 设置间距
              top: '20%',
              x: '50%',
              right: '5%',
              bottom: 135,
              data:numbers,
              // formatter: function (name) {
              //   // 获取legend显示内容
              //   let data = names //你的数据
              //   let total = 0
              //   let tarValue = 0
              //   let value = 0
              //   for (let i = 0, l = data.length; i < l; i++) {
              //     total += data[i].value
              //     if (data[i].name == name) {
              //       tarValue = data[i].value
              //       value = data[i].value
              //     }
              //   }
              //   return [
              //     '{a|' +
              //       echarts.format.truncateText(
              //         name,
              //         150,
              //         '14px Microsoft Yahei',
              //         '…'
              //       ) +
              //       '}'
              //   ].join(' ')
              // },
              // tooltip: {
              //   show: true
              // },
              // textStyle: {
              //   rich: {
              //     a: {
              //       color: 'rgb(51,51,51)',
              //       width: 80,
              //       align: 'left'
              //     },
              //     b: {
              //       width: 50,
              //       align: 'left',
              //       color: 'rgb(51,51,51)'
              //     },
              //     x: {
              //       width: 30,
              //       align: 'left',
              //       color: 'rgb(51,51,51)'
              //     }
              //   }
              // }
            },
            series: [
              {
                data: numbers
              }
            ]
          })
        }
      }
    },
    //锚地第三个图表
    async getAnchoragePlan() {
      let { res, status } = await infrastructure.getAnchoragePlan()
      if (status === 200) {
        let data = res.data
        if (this.cityModelCharts) {
          this.cityModelCharts.setOption({
            title: {
              text: '分类别船闸数量'
            },
            xAxis: [
              {
                name: '',
                data: data.name,
                axisLabel: {
                  rotate: 0
                }
              }
            ],
            yAxis: [],
            series: [
              {
                type: 'bar',
                label: {
                  show: true,
                  position: 'top'
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(123, 176, 255, 0.5)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(123, 176, 255, 0.8)'
                        }
                      ],
                      false
                    ),
                    shadowColor: 'rgba(123, 176, 255, 0.1)',
                    shadowBlur: 10
                  }
                },
                data: data.num
              }
            ]
          })
        }
      } else {
        if (this.cityModelCharts) {
          this.cityModelCharts.setOption({
            title: {
              text: '锚地数量'
            },
            xAxis: [
              {
                name: '锚地规划',
                data: [],
                axisLabel: {
                  rotate: 0
                }
              }
            ],
            series: [
              {
                data: []
              }
            ]
          })
        }
      }
    },
    //航道
    //航道总量
    async getChannelAllCount() {
      let { res, status } = await infrastructure.getChannelAllCount()
      if (status === 200) {
        this.allCount = res.data
      } else {
        this.allCount = []
      }
    },
    // 航道树形图
    async getChannelTable() {
      let { res, status } = await infrastructure.getChannelTable({keyword:this.filterText})
      if (status === 200) {
        // let data = res.data
        // this.total = data.totalcount
        // this.tableData = data.results
        this.treeData = res.data
      } else {
        // this.total = data.totalcount
        // this.tableData = []
        this.treeData = []
      }
    },
    //现状规划切换
    selectcurrentTwo(val) {
      this.situationOrPlan = val
      if (this.situationOrPlan == '现状') {
        this.channelshowxz = true
        this.channelshowgh = false
        polygonchannel.setVisible(true)
        linebranchchannel.setVisible(true) //航道支线图层
        polygonchannelplan.setVisible(false)
        linebranchchannelplan.setVisible(false) //支线航道规划图层
      } else if (this.situationOrPlan == '规划') {
        this.channelshowxz = false
        this.channelshowgh = true
        polygonchannelplan.setVisible(true)
        linebranchchannelplan.setVisible(true) //支线航道规划图层
        polygonchannel.setVisible(false)
        linebranchchannel.setVisible(false) //航道支线图层
      }
      console.log(this.situationOrPlan)
    },
    // table模糊查询
    queryTableData(val) {
      // if (this.current == 3) {
      //   this.getAllAnchorage()
      // }
      if (this.current == 4 && this.sonmueIndex == 1) {
        this.getWaterserviceTable()
      } else if (this.current == 4 && this.sonmueIndex == 2) {
        this.getCabinwashingTable()
      } 
      // else if (this.current == 1) {
      //   this.getChannelTable()
      // }
    },
    //查询市域航道里程
    async getChannelLine() {
      let { res, status } = await infrastructure.getChannelLine()
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
          if (r[0] == 'order') {
            r.splice(0, 2)
          } else {
            name.push(r[0])
            numbers.push(r[1])
          }
        })
        if (this.totalMileageCharts) {
          this.totalMileageCharts.setOption({
            title: {
              text: '分市航道里程(公里)',
              textStyle: {
                fontSize: this.fontSize(0.16)
              }
            },
            xAxis: [
              {
                name: '',
                data: name,
                axisLabel: {
                  rotate: 40
                }
              }
            ],
            series: [
              {
                type: 'bar',
                label: {
                  show: true,
                  position: 'top',
                  fontSize: 12,
                  distance: 15,
                  formatter: function (data) {
                    return data.value.toFixed(0)
                  }
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(123, 176, 255, 0.5)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(123, 176, 255, 1)'
                        }
                      ],
                      false
                    ),
                    shadowColor: 'rgba(123, 176, 255, 0.1)',
                    shadowBlur: 10
                  }
                },
                data: numbers
              }
            ]
          })
        }
      } else {
        if (this.totalMileageCharts) {
          this.totalMileageCharts.setOption({
            title: {
              text: '市航道里程'
            },
            xAxis: [
              {
                name: '',
                data: []
              }
            ],
            series: [
              {
                data: []
              }
            ]
          })
        }
      }
    },
    //查询等级航道里程饼图
    async getChannelCircular() {
      let { res, status } = await infrastructure.getChannelCircular()
      let xData = []
      let yData = []
      if (status === 200) {
        let data = res.data
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

        // let legendData = result.map((r) => {
        //   return {
        //     icon: 'circle',
        //     itemWidth: 10, // 设置宽度class
        //     itemHeight: 10, // 设置高度im
        //     itemGap: 40, // 设置间距
        //     itemGap: 20, // 设置间距
        //     top: '30%',
        //     // x: '220',
        //     right: "30%",
        //     bottom: 135,
        //     data: r ? r : []
        //   }
        // })
        // console.log(legendData);
        // console.log(yData);
        if (this.totalModelCharts) {
          this.totalModelCharts.setOption({
            title: {
              text: '航道等级结构',
              textStyle: {
                fontSize: this.fontSize(0.16)
              }
            },
            // legend: legendData,
            legend: {
              // type: 'scroll',
              // orient: 'vertical',
              icon: 'circle',
              itemWidth: 10, // 设置宽度class
              itemHeight: 10, // 设置高度im
              itemGap: 20, // 设置间距
              top: '20%',
              x: '50%',
              right: '10%',
              bottom: '135',
              // formatter: function (name) {
              //   // 获取legend显示内容
              //   let data = result //你的数据
              //   let total = 0
              //   let tarValue = 0
              //   let value = 0
              //   for (let i = 0, l = data.length; i < l; i++) {
              //     total += data[i].value
              //     if (data[i].name == name) {
              //       tarValue = data[i].value
              //       value = data[i].value
              //     }
              //   }
              //   return [
              //     '{a|' +
              //       echarts.format.truncateText(
              //         name,
              //         150,
              //         '14px Microsoft Yahei',
              //         '…'
              //       ) +
              //       '}'
              //   ].join(' ')
              // },
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
            // [
            //   {
            //     itemGap: 20, // 设置间距
            //     x: '220',
            //     right: 50,
            //     data: result[0] ? result[0] : []
            //   },
            //   {
            //     itemGap: 20, // 设置间距
            //     x: '220',
            //     right: 50,
            //     data: result[1] ? result[1] : []
            //   },
            //   {
            //     itemGap: 20, // 设置间距
            //     x: '220',
            //     right: 50,
            //     data: result[2] ? result[2] : []
            //   }
            // ],
            series: [
              {
                data: yData
              }
            ]
          })
        }
      } else {
        if (this.totalModelCharts) {
          this.totalModelCharts.setOption({
            title: {
              text: '分等级航道里程'
            },
            legend: [
              {
                itemGap: 20, // 设置间距
                x: '220',
                right: 50,
                data: []
              },
              {
                itemGap: 20, // 设置间距
                x: '220',
                right: 50,
                data: []
              },
              {
                itemGap: 20, // 设置间距
                x: '220',
                right: 50,
                data: []
              }
            ],
            series: [
              {
                data: []
              }
            ]
          })
        }
      }
    },
    //查询等级航道里程柱状图
    async getChannelColumn() {
      let { res, status } = await infrastructure.getChannelColumn()
      if (status === 200) {
        let data = res.data
        if (this.cityModelCharts) {
          this.cityModelCharts.setOption({
            title: {
              text: '分等级航道里程(公里)',
              textStyle: {
                fontSize: this.fontSize(0.16)
              }
            },
            xAxis: [
              {
                name: '',
                data: data.level,
                axisLabel: {
                  rotate: 0
                }
              }
            ],
            series: [
              {
                type: 'bar',
                label: {
                  show: true,
                  position: 'top',
                  formatter: function (data) {
                    var datas = parseFloat(data.value)
                    return datas.toFixed(0)
                  }
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(123, 176, 255, 0.5)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(123, 176, 255, 0.8)'
                        }
                      ],
                      false
                    ),
                    shadowColor: 'rgba(123, 176, 255, 0.1)',
                    shadowBlur: 10
                  }
                },
                data: data.mileage
              }
            ]
          })
        }
      } else {
        if (this.cityModelCharts) {
          this.cityModelCharts.setOption({
            title: {
              text: '等级航道里程'
            },
            xAxis: [
              {
                name: '',
                data: [],
                axisLabel: {
                  rotate: 0
                }
              }
            ],
            series: [
              {
                data: []
              }
            ]
          })
        }
      }
    },
    //船闸
    //船闸总量
    async getShipLockAllCount() {
      let { res, status } = await infrastructure.getShipLockAllCount()
      if (status === 200) {
        this.allCount = res.data
      } else {
        this.allCount = []
      }
    },
    //船闸树状图
    async getShipLockTree() {
      let { res, status } = await infrastructure.getShipLockTree({keyword:this.filterText})
      if (status === 200) {
        this.treeData = res.data
      } else {
        this.treeData = []
      }
    },
    //查询船闸折线图
    async getShipLockLine() {
      let { res, status } = await infrastructure.getShipLockLine()
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
          if (r[0] == 'order') {
            r.splice(0, 2)
          } else {
            name.push(r[0])
            numbers.push(r[1])
          }
        })
        if (this.totalMileageCharts) {
          this.totalMileageCharts.setOption({
            title: {
              text: '分市船闸数量(个)',
              textStyle: {
                fontSize: this.fontSize(0.16)
              }
            },
            xAxis: [
              {
                name: '',
                data: name,
                axisLabel: {
                  rotate: 40
                }
              }
            ],
            series: [
              {
                type: 'bar',
                label: {
                  show: true,
                  position: 'top'
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(123, 176, 255, 0.5)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(123, 176, 255, 0.8)'
                        }
                      ],
                      false
                    ),
                    shadowColor: 'rgba(123, 176, 255, 0.1)',
                    shadowBlur: 10
                  }
                },
                data: numbers
              }
            ]
          })
        }
      } else {
        if (this.totalMileageCharts) {
          this.totalMileageCharts.setOption({
            title: {
              text: '市船闸数量'
            },
            xAxis: [
              {
                name: '地级市',
                data: []
              }
            ],
            series: [
              {
                data: []
              }
            ]
          })
        }
      }
    },
    //查询船闸饼图
    async getShipLockCircular() {
      let { res, status } = await infrastructure.getShipLockCircular()
      let xData = []
      let yData = []
      if (status === 200) {
        let data = res.data
        let names = []
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
          if (r[0] == 'order') {
            r.splice(0, 2)
          } else {
            names.push(r[0])
            numbers.push({ name: r[0], value: r[1] })
          }
        })
        let legendData = names.map((r) => {
          return {
            // type: 'scroll',
            // orient: 'vertical',
            icon: 'circle',
            itemWidth: 10, // 设置宽度class
            itemHeight: 10, // 设置高度im
            itemGap: 40, // 设置间距
            itemGap: 20, // 设置间距
            top: '20%',
            x: '50%',
            right: '10%',
            bottom: 135,
            data: names
          }
        })
        if (this.totalModelCharts) {
          this.totalModelCharts.setOption({
            title: {
              text: '分市船闸结构'
            },
            legend: legendData,
            // legend: {
            //  type: 'scroll',
            //  orient: 'vertical',
            //   icon: 'circle',
            //   itemWidth: 10, // 设置宽度class
            //   itemHeight: 10, // 设置高度im
            //   itemGap: 20, // 设置间距
            //   top: '10%',
            //   x: '50%',
            //   right: '10%',
            //   bottom: '135',
            //   formatter: function (name) {
            //     // 获取legend显示内容
            //     let data = names //你的数据
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
            series: [
              {
                data: numbers
              }
            ]
          })
        }
      } else {
        if (this.totalModelCharts) {
          this.totalModelCharts.setOption({
            title: {
              text: '通过能力'
            },
            legend: [
              {
                itemGap: 20, // 设置间距
                x: '220',
                right: 50,
                data: []
              },
              {
                itemGap: 20, // 设置间距
                x: '220',
                right: 50,
                data: []
              },
              {
                itemGap: 20, // 设置间距
                x: '220',
                right: 50,
                data: []
              }
            ],
            series: [
              {
                data: []
              }
            ]
          })
        }
      }
    },
    //查询等级航道里程柱状图
    async getShipLockColumn() {
      let { res, status } = await infrastructure.getShipLockColumn()
      if (status === 200) {
        let data = res.data
        console.log(data)
        if (this.cityModelCharts) {
          this.cityModelCharts.setOption({
            title: {
              text: '分通道船闸数量(个)'
            },
            xAxis: [
              {
                name: '',
                data: data.name,
                axisLabel: {
                  rotate: 40
                }
              }
            ],
            series: [
              {
                type: 'bar',
                label: {
                  show: true,
                  position: 'top'
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(123, 176, 255, 0.5)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(123, 176, 255, 0.8)'
                        }
                      ],
                      false
                    ),
                    shadowColor: 'rgba(123, 176, 255, 0.1)',
                    shadowBlur: 10
                  }
                },
                data: data.num
              }
            ]
          })
        }
      } else {
        if (this.cityModelCharts) {
          this.cityModelCharts.setOption({
            title: {
              text: '航道船闸数量'
            },
            xAxis: [
              {
                name: '航道',
                data: [],
                axisLabel: {
                  rotate: 0
                }
              }
            ],
            series: [
              {
                data: []
              }
            ]
          })
        }
      }
    },
    //其他
    //获取桥梁树状图
    async getBridgeTree() {
      let data = {
        keyword:this.filterText,
        city:this.mapcity,
        administrativeregion:this.mapAdministrative,
        channelname:this.mapChannelName,
      }
      if(data.city == "全省"){
        data.city = ''
      }
      if(data.administrativeregion == "全省"){
        data.administrativeregion = ''
      }
      if(data.channelname == "全省"){
        data.channelname = ''
      }
      let { res, status } = await infrastructure.getBridgeTree(data)
      if (status === 200) {
        this.treeData = res.data
      } else {
        this.treeData = []
      }
    },
    async getWaterserviceTable() {
      let { res, status } = await infrastructure.getWaterserviceTable({
        pageno: this.pageno,
        pagesize: this.pagesize,
        name: this.tablequery
      })
      if (status === 200) {
        let data = res.data
        this.total = data.totalcount
        this.tableData = data.results
      } else {
        this.total = data.totalcount
        this.tableData = []
      }
    },
    async getCabinwashingTable() {
      let { res, status } = await infrastructure.getCabinwashingTable({
        pageno: this.pageno,
        pagesize: this.pagesize,
        name: this.tablequery
      })
      if (status === 200) {
        let data = res.data
        this.total = data.totalcount
        this.tableData = data.results
        this.tableDataAll = data.results
      } else {
        this.total = data.totalcount
        this.tableData = []
      }
    },
    // window Resize
    windowResize() {
      window.onresize = () => {
        this.echartsResize()
      }
    },
    // echarts Resize
    echartsResize() {
      if (this.totalMileageCharts) this.totalMileageCharts.resize()
      if (this.totalModelCharts) this.totalModelCharts.resize()
      if (this.cityModelCharts) this.cityModelCharts.resize()
    }
    //右上角总数量
    // async allCount() {
    //   let { res, status } = await infrastructure.allCount()
    //   if (status === 200) {
    //     let data = res.data
    //     this.portNum = data.gk
    //     this.channelNum = data.hd
    //     this.navigationNum = data.cz
    //   }
    // },
    // handleCurrentChange(val) {
    //   this.currentRow = val
    //   console.log(this.currentRow)
    // }
    //
    // renderContent(h, { node, data, store }) {
    //   return (
    //     <span class="custom-tree-node">
    //       <span style="color: #ffffff;">{node.label}</span>
    //     </span>
    //   )
    // }
  }
}
</script>
<style lang="scss" scoped>
$informationWidth: 100px;
.view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.information-retrieval {
  width: 100px;
  height: 100%; // background-color: #fff;
  box-shadow: 0px 2px 16px 0px rgba(4, 23, 37, 0.3);
  z-index: 20;
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
      position: relative;
      .sonmenu {
        position: absolute; // width: 74px;
        // height: 68px;
        right: -80px;
        top: 0;
        width: 73px;
        height: 86px;
        background-color: #4d799c;
        border-radius: 6px;
        overflow: hidden;
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
      }
      > p {
        font-size: 14px;
        color: #ffffff;
      }
    }
    .active {
      background-color: rgba(41, 237, 252, 0.7);
    }
  }
}
.hide-right {
  .gis-container {
    right: 20px;
    width: 83.3%;
    transition: right 0.28s;
  }
  .statistics-container {
    right: -26.7%;
    transition: right 0.28s;
    box-shadow: none;
    .right-show {
      left: -4%;
    }
  }
}
.Water-right {
  .gis-container {
    right: 20px;
    width: 83.6%;
    transition: width 0.28s;
  }
  .statistics-container {
    display: none; // right: -26.7%;
    // transition: right 0.28s;
    // box-shadow: none;
    // .right-show {
    //   left: -4%;
    // }
  }
}
.land-planning-right {
  .gis-container {
    width: 98%;
    left: 1%;
    right: 1%;
    transition: width 0.28s;
  }
  .statistics-container {
    display: none;
  }
  .tree-container,
  .table-container {
    display: none;
  }
}
.hide-left {
  .gis-container {
    left: 20px;
    width: 72%;
    transition: width 0.28s;
  }
  .tree-container,
  .table-container {
    left: -14.8%;
    transition: left 0.28s;
    box-shadow: none;
    .left-show {
      right: -6%;
    }
  }
}
.fullscreen {
  .gis-container {
    left: 20px;
    right: 20px;
    width: 98%;
    transition: width 0.28s;
  }
  .tree-container,
  .table-container {
    left: -14.8%;
    transition: left 0.28s;
    box-shadow: none;
    .left-show {
      right: -6%;
    }
  }
  .statistics-container {
    right: -26.7%;
    transition: right 0.28s;
    box-shadow: none;
    .right-show {
      left: -4%;
    }
  }
}
.r-panel {
  position: absolute; // top: 0;
  left: $informationWidth;
  right: 0; // bottom: 0;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center; // padding: 0px 15px;
}
.tree-container,
.table-container {
  width: 14.8%;
  padding: 10px 5px; // padding-right: 20px;
  position: absolute;
  left: 0; // top: 0;
  height: 100%;
  background-color: #264b68;
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.09);
  transition: left 0.28s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

  .left-show {
    width: 15px;
    height: 63px;
    background: #c6dce5;
    border-radius: 4px 0px 0px 4px;
    position: absolute;
    top: 50%;
    right: 0%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
  }
  .tree-search,
  .table-search {
    min-height: 35px;
    height: 4.5%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .search-input {
      width: 60%;
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
  .tree-switch {
    min-height: 35px;
    height: 4.5%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-color: rgba(96, 139, 173, 0.5);
    align-items: center;
    border-radius: 4px;
    > div {
      width: 50%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #fff; // background-color: #0f7bbf;
      border-radius: 4px;
    }
    .active {
      background-color: #0f7bbf;
    }
  }
  .tree-content,
  .anchorage-content {
    height: 94%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    justify-content: space-between;
    padding-right: 20px;
  }
  .anchorage-content {
    width: 100%;
    padding-right: 0px;
    .table-content {
      width: 100%;
      height: 95%; // padding-right: 2px;
      // border: solid 1px #3c77a5;
    }
    .pagination-container {
      display: flex;
      justify-content: flex-end;
    }
  }
  .show-ellipsis {
    display: block;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.gis-container {
  width: 57.9%;
  padding: 5px;
  height: 98%;
  position: absolute;
  right: 27%; // transition: right 0.28s;
  //   transition: left 0.28s;
  background: #fff;
  box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.1);
}
.statistics-container {
  width: 26.5%;
  height: 98%;
  background-color: #fff;
  box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.1);
  position: absolute;
  right: 0;
  transition: right 0.28s; //
  .right-show {
    width: 15px;
    height: 63px;
    background: #c6dce5;
    border-radius: 0px 4px 4px 0px;
    position: absolute;
    top: 50%;
    left: 0%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .statistics-title {
    // height: 7%;
    min-height: 45px;
    padding: 0 4%;
    display: flex;
    align-items: center;
    color: #2a95e8;
    width: 100%;
    span {
      padding-left: 10px;
      position: relative;
      left: 0;
      top: 0;
      font-size: 18px;
      font-weight: 500;
      &::before {
        content: '';
        width: 3px;
        height: 15px;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -7.5px;
        background-color: #2a8df0;
      }
    }
  }
  .statistics-content {
    height: 93%;
    padding: 5px 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: auto;
  }
  .statistics-block {
    height: 10.5%;
    padding: 0 5px;
    min-height: 82px;
    // min-width:444px;
    overflow: auto;
    display: flex;
    justify-content: center;
    background-color: rgba(247, 248, 249, 0.5);
    box-shadow: 0px 1px 5px 1px rgba(132, 132, 132, 0.27);
    border-radius: 10px;
    align-items: center;
    > div {
      width: 33%;
      height: 60%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      border-right: solid 1px rgba(83, 83, 83, 0.2);
      > p:first-child {
        > span:first-child {
          color: #3daaff;
          // font-size: 22px;
          font-size: calc(100vw * 22 / 1920);
        }
        > span:last-child {
          color: #3daaff;
          // font-size: 14px;
          font-size: calc(100vw * 14 / 1920);
        }
      }
      > p:last-child {
        // font-size: 16px;
        font-size: calc(100vw * 16 / 1920);
        color: #333333;
      }
    }
    .block-width {
      width: 50%;
    }
    > div:last-child {
      border: none;
    }
    .block-widths{
      justify-content: center;
    }
    .color-block{
      p{
        color: #3daaff !important;
      }
    }
  }
  #echarts-total-mileage {
    width: 100%;
    padding: 5px;
    height: 28%;
    // min-height: 215px; // box-shadow: 0px 1px 5px 1px rgba(132, 132, 132, 0.27);
    border-radius: 10px;
    // min-width:444px;
  }
  #echarts-total-model {
    width: 100%;
    height: 28%;
    // min-height: 215px; // box-shadow: 0px 1px 5px 1px rgba(132, 132, 132, 0.27);
    border-radius: 10px;
    // min-width:444px;
  }
  #echarts-city-model {
    width: 100%;
    height: 29%;
    // min-height: 215px; // box-shadow: 0px 1px 5px 1px rgba(132, 132, 132, 0.27);
    border-radius: 10px;
    // min-width:444px;
  }
}
#container,
#container-2D,
#container-3D {
  width: 100%;
  height: 100%;
  overflow: hidden;
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
  .cesium-viewer-bottom {
    display: none;
  }
}
.tools-box {
  display: flex;
  width: 234px;
  height: 50px;
  position: absolute;
  z-index: 100;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  background-color: #486a85;
  .tool {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 46px;
    height: 50px;
    color: white;
    .icon {
      width: 18px;
      height: 18px;
      margin: 6px;
    }
    span {
      font-size: 12px;
      margin-bottom: 2px;
    }
  }
  .tool.selected {
    background-color: #354a59;
    color: #11e0ff;
  }
}
.legend-box {
  transition: all 0.25s linear;
  width: 300px;
  height: 200px;
  position: absolute;
  left: 15px;
  bottom: 15px;
  z-index: 100;
  background-color: rgba(47, 99, 139, 0.8);
  overflow: hidden;
  .legend-title {
    height: 35px;
    padding-left: 20px;
    padding-right: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: #36698f;
  }
  .legend-content {
    height: calc(100% - 35px);
    display: flex;
    flex-wrap: wrap;
    > div {
      width: 97px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #fff; // span {
      //   display: none;
      // }
      .legend-channel {
        width: 45px;
        margin-right: 10px;
        display: inline-block;
        position: relative;
        left: 0;
        top: 0;
        &::before {
          content: '';
          width: 100%;
          height: 5px;
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: -2.5px;
        }
      }
      .legend-channel—1::before {
        background-color: #00e4ff;
      }
      .legend-channel—2::before {
        background-color: #16b568;
      }
      .legend-channel—3::before {
        // background-color: #9d77e5;
        background-color: #ff0000;
      }
      .legend-channel—4::before {
        background-color: #184fa2;
      }
      .legendChannelGrey::before {
        background-color: #ccc;
      }
      > div {
        display: flex;
        align-items: center;
        margin-left: 12px;
        margin-right: 6px;
      }
      .legend-text {
        text-align: center;
      }
    }
  }
}
.legendFold {
  transition: all 0.25s linear;
  width: 25px;
  height: 25px;
  .legend-title {
    width: 100%;
    height: 100%;
    padding: 0;
    justify-content: center;
    span {
      display: none;
    }
  }
  .legend-content {
    display: none;
  }
}
.city-select,.gisCity{
  width: 161px;
  height: 37px;
  position: absolute;
  top: 15px;
  left: 43px;
}
.gisAdministrative{
  width: 161px;
  height: 37px;
  position: absolute;
  top: 15px;
  left: 215px;
}
.gisChannelName{
  width: 161px;
  height: 37px;
  position: absolute;
  top: 15px;
  left: 385px;
}
.region-box {
  width: 195px;
  height: 102px;
  padding: 12px 15px;
  background-color: white;
  border-radius: 2px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 15px;
  left: 213px;
  .el_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .color_block {
      float: left;
      margin-right: 5px;
      width: 25px;
      height: 20px;
      border-radius: 3px;
      // background-color: red;
      margin-left: 5px;
      height: 10px;
      // margin-top: -5px;
    }
  }
}
.project-list-container {
  width: 250px; // height: 240px;
  position: absolute;
  right: 18px;
  top: 12px;
  z-index: 100;
  border: 1px solid #e7ecf2;
  border-radius: 4px;
  background-color: #fff;
  .project-list-title {
    height: 35px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e9e9e9;
    background-color: #f6f6f6;
    span {
      font-size: 16px;
      color: #2a8df0;
    }
    i {
      transition: all 0.25s linear;
    }
  }
  .project-list-content {
    transition: all 0.25s linear;
    height: 255px;
    overflow: hidden;
  }
  .project-list-box {
    width: 218px;
    height: 235px;
    margin: 10px 15px;
    border: 1px solid #c5d6e3;
    overflow-y: auto;
  }
  .project-list {
    cursor: pointer;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    border-bottom: 1px solid #dee7ed;
    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
    }
    .el-button {
      flex: none;
      // margin-left: 5px;
    }
    .control_btn {
      flex: none;
    }
    &:nth-of-type(odd) {
      background-color: rgba(202, 233, 255, 0.3);
    }
    &:last-child {
      border-bottom: 0;
    }
  }
  .projectListNow {
    color: #fff;
    background-color: #2892e6 !important;
    /deep/.control_btn {
      color: #fff;
    }
  }
  .listFold {
    height: 0;
    padding: 0;
    overflow: hidden;
  }
}
.el-table {
  border: 1px solid #2a5e87;
}
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

.change-btn {
  position: absolute;
  top: 10px;
  right: 1%;
  border: 1px solid #2e9bef;
  border-radius: 4px;
  .el-button + .el-button {
    margin: 0;
    margin-left: -1px;
  }
  .btn_selected {
    background-color: #2e9bef !important;
  }
  /deep/ .control_btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background-color: rgba(69, 118, 158, 0.8);
    border: 1px solid rgb(46, 155, 239);
    color: #ffffff;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    // margin: 0 5px;
    transition: 0.1s;
    font-weight: 500;
    padding: 8px 20px;
    font-size: 14px;
    // border-radius: 4px;
  }
  /deep/ .el-button:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
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
      .sceneImgBox{
        width:100%;
        height:200px;
        overflow:hidden;
        .sceneImgTitle{
          padding:10px 15px;
        }
        .sceneImg{
            width:100%;
            height:165px;
            img{
              width:100%;
              height: 100%;
            }
          }
      }
      .lookPDF{
        margin:5px 10px;
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

#toolbar {
  display: flex;
  position: absolute;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: url('../../assets/img/3Dgis/toolbar_bg.png') no-repeat;
  background-size: 100% 100%;
  .tool-btn {
    cursor: pointer;
    width: 58px;
    height: 58px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #96d5ff;
    &:hover {
      background: url('../../assets/img/3Dgis/toolbar_now.png') no-repeat;
      background-size: 100% 100%;
    }
  }
  .toolActive {
    background: url('../../assets/img/3Dgis/toolbar_now.png') no-repeat;
    background-size: 100% 100%;
    i {
      color: #3dfff8;
    }
    span {
      color: #fff;
    }
  }
  i {
    margin-bottom: 5px;
    margin-left: 2.8px;
    font-size: 18px;
  }
  i,
  span {
    display: block;
  }
  span {
    font-size: 12px;
  }
}
@media all and (max-width: 1920px) {
  #toolbar {
    left: 50%;
  }
}
@media all and (max-width: 1650px) {
  #toolbar {
    left: 65%;
  }
}
@media all and (max-width: 1500px) {
  #toolbar {
    left: 65%;
  }
}
@media all and (max-width: 1280px) and (max-width: 1334px) {
  #toolbar {
    left: 73%;
  }
}
#tag-popup {
  position: absolute;
  z-index: 900;
  width: 300px;
  border: 1px solid rgb(153, 153, 153);
  background-color: rgb(255, 255, 255);
  left: 740px;
  top: 75px;
  #tag-popup-title {
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
    color: rgb(77, 77, 77);
    background-color: rgb(249, 249, 249);
    #tag-popup-close {
      width: 10px;
      height: 10px;
      position: absolute;
      top: 0px;
      right: 10px;
      cursor: pointer;
    }
  }
  #tag-popup-content-box {
    padding: 7px 10px 0px;
    > div:first-child {
      display: flex;
      margin-bottom: 10px;
      align-items: center;
      span {
        flex: 0 0 auto;
        width: 30px;
        font-size: 12px;
      }
      input {
        flex: 1 1 0%;
        height: 25px;
        border: 1px solid rgb(181, 181, 181);
      }
    }
    > div:last-child {
      display: flex;
      align-items: flex-start;
      span {
        flex: 0 0 auto;
        width: 30px;
        font-size: 12px;
      }
      #tag-popup-content {
        flex: 1 1 0%;
        height: 72px;
        padding: 2px;
        border: 1px solid rgb(181, 181, 181);
      }
    }
  }
  > div:last-child {
    height: 40px;
    padding: 10px 10px;
    text-align: right;
    button {
      margin-right: 5px;
    }
  }
  img {
    position: absolute;
    bottom: -31px;
    left: 120px;
  }
}
.channelColor {
  width: 120px;
  height: 120px;
  // border:2px solid #fff;
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 5px 5px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  background: rgba(47, 99, 139, 0.8);
  color: #fff;
  .channeldiv {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .twochannel {
      width: 15px;
      height: 7px;
      background: rgb(2, 114, 47);
    }
    .threechannel {
      width: 15px;
      height: 7px;
      background: rgb(254, 0, 0);
    }
    .fourchannel {
      width: 15px;
      height: 7px;
      background: rgb(255, 0, 198);
    }
    .fivechannel {
      width: 15px;
      height: 7px;
      background: rgb(0, 91, 231);
    }
    .sixchannel {
      width: 15px;
      height: 7px;
      background: rgb(56, 167, 0);
    }
    .sevenchannel {
      width: 15px;
      height: 7px;
      background: rgb(255, 170, 1);
    }
  }
}
.channelColorgh {
  width: 120px;
  height: 125px;
  // border: 2px solid #fff;
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 5px 5px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  background: rgba(47, 99, 139, 0.8);
  color: #fff;
  .channeldivgh {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .twochannelgh {
      width: 15px;
      height: 7px;
      background: rgb(2, 114, 47);
    }
    .threechannelgh {
      width: 15px;
      height: 7px;
      background: rgb(254, 0, 0);
    }
    .fourchannelgh {
      width: 15px;
      height: 7px;
      background: rgb(255, 0, 198);
    }
    .fivechannelgh {
      width: 15px;
      height: 7px;
      background: rgb(0,77,228);
    }
    .sixchannelgh {
      width: 15px;
      height: 7px;
      background: rgb(47,164,0);
    }
    .sevenchannelgh {
      width: 15px;
      height: 7px;
      background: rgb(255,162,0);
    }
    .eightchannelgh {
      width: 15px;
      height: 7px;
      background: rgb(0,255,255);
    }

  }
}
</style>
