<template>
  <div class="view">
    <div class="tree-container">
      <div class="tree-title">
        <span>项目及单体列表</span>
      </div>
      <div class="tree-content">
        <el-tree
          :load="loadNode"
          :props="defaultProps"
          lazy
          @node-click="handleNodeClick"
          :render-content="renderContent"
        >
        </el-tree>
      </div>
    </div>
    <div class="gis-container" id="gis-container">
      <div id="container"></div>
      <div class="component-tree" v-show="componentVisible">
        <div class="component-tree-title">
          <span>模型结构树</span>
          <i class="iconfont icon-cha" @click="closeComponentTree"></i>
        </div>
        <div class="component-tree-content">
          <div>
            <el-tree
              :props="defaultProps"
              :data="componentTree"
              @node-click="handleNodeClick2"
            >
            </el-tree>
          </div>
        </div>
      </div>
      <div id="toolbar">
        <div
          class="tool-btn"
          :class="{ toolActive: toolIndex === 0 ? true : false }"
          @click="distinguish"
        >
          <div>
            <i class="iconfont icon-saomiaoshibie380"></i>
            <span>属性</span>
          </div>
        </div>
        <div
          class="tool-btn"
          :class="{ toolActive: toolIndex === 1 ? true : false }"
          @click="measure('distance')"
        >
          <div>
            <i class="iconfont icon-ceju"></i>
            <span>测距</span>
          </div>
        </div>
        <div
          class="tool-btn"
          :class="{ toolActive: toolIndex === 2 ? true : false }"
          @click="measure('area')"
        >
          <div>
            <i class="iconfont icon-mianji"></i>
            <span>测面</span>
          </div>
        </div>
        <div
          class="tool-btn"
          :class="{ toolActive: toolIndex === 3 ? true : false }"
          @click="measure('height')"
        >
          <div>
            <i class="iconfont icon-cegaodu"></i>
            <span>测高</span>
          </div>
        </div>
        <div
          class="tool-btn"
          :class="{ toolActive: toolIndex === 4 ? true : false }"
          @click="tag"
        >
          <div>
            <i class="iconfont icon-biaoji"></i>
            <span>标记</span>
          </div>
        </div>
        <div
          class="tool-btn"
          :class="{ toolActive: toolIndex === 5 ? true : false }"
          @click="underground"
        >
          <div>
            <i class="iconfont icon-dixiamoshi"></i>
            <span>地下</span>
          </div>
        </div>
        <!-- <div
          class="tool-btn"
          :class="{ toolActive: toolIndex === 4 ? true : false }"
          @click="roam"
        >
          <div>
            <i class="iconfont icon-manyou"></i>
            <span>漫游</span>
          </div>
        </div> -->
        <div class="tool-btn" @click="reset">
          <div>
            <i class="iconfont icon-Reset"></i>
            <span>重置</span>
          </div>
        </div>
      </div>
      <div class="doc-list-container" v-if="listFold">
        <div class="doc-list-title">
          <span>{{ docTitle }}</span>
          <i class="iconfont icon-cha" @click="foldList"></i>
        </div>
        <div class="doc-list-content">
          <div class="doc-list-box">
            <div v-for="(item, index) in docList" :key="index">
              <div class="doc-type">{{ item.type }}</div>
              <div>
                <div class="doc-list" v-for="i in item.files" :key="i.docid">
                  <span>{{ i.docname }}</span>
                  <el-button
                    type="text"
                    size="mini"
                    title="预览"
                    class="el-icon-view"
                    @click="previewFile(i)"
                  ></el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="componentPopup" :style="styleObject">
        <div class="title">
          <span>构件基本信息</span
          ><i class="iconfont icon-cha" @click="closePopup"></i>
        </div>
        <div class="content">
          <ul class="info-list">
            <li v-for="(val, key) in popupField" :key="key">
              <span class="label">{{ key }}</span
              ><span class="value">{{ val }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <preview-dialog
      :visible.sync="previewDialogVisible"
      :previewObj.sync="previewObj"
    />
    <viewer :imgUrls.sync="viewerUrls" />
  </div>
</template>

<script>
import { NewMeasure } from '@/utils/measure-new'
import { Tag } from '@/utils/tag'
import PreviewDialog from '@/components/PreviewDialog'
import Viewer from '@/components/Viewer'
import { Distinguish } from '@/utils/distinguish'
import { common, tag } from '@/api/index'
import { mononerTypeOrder, fileTypeOrder } from '@/assets/js/localData.js'

let viewer = null
let tilesetGL = null
let highTile = null // 当前高亮3dtiles
let tileVisibleFn = null
let Measure = null
let Mark = null
let Distinguishing = null
let componentPopupPosition = null
let anonymous = null
export default {
  name: 'gis',
  components: {
    PreviewDialog,
    Viewer
  },
  data() {
    return {
      viewerUrls: [],
      previewDialogVisible: false,
      previewObj: {
        type: '',
        url: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      count: 1,
      orginMatrixInverse: null,
      toolIndex: null,
      toolLastIndex: null,
      styleObject: {
        // left: 0,
        // top: 0,
        display: 'none'
      },
      popupField: {},
      listFold: false, // 文档列表窗口折叠开关
      componentVisible: false, // 单体构件树显隐
      docList: [], // 附属文档列表
      componentTree: [],
      iconImgs: {
        补水站: 'waterStation',
        船闸: 'navigationLock',
        地涵: 'culvert',
        锚地: 'anchorage',
        桥梁: 'bridge',
        水闸: 'sluice',
        泵站: 'pumpingStation',
        一级航道: '#00e4ff',
        二级航道: '#16b568',
        // 三级航道: '#9d77e5',
        三级航道: '#ff0000',
        四级航道: '#184fa2'
      }
    }
  },
  destroyed() {
    if (viewer) {
      viewer.dataSources.removeAll(true)
      viewer.destroy()
    }
    viewer = null
    highTile = null
    tilesetGL = null
    tileVisibleFn = null
    componentPopupPosition = null
    anonymous = null
  },
  mounted() {
    this.proj4Register()
    this.mapInit()
    // this.updatePosition()
  },
  methods: {
    // 坐标系自定义且注册
    proj4Register() {
      proj4.defs('EPSG:4490', '+proj=longlat +ellps=GRS80 +no_defs')
      // 大地2000投影坐标 CGCS2000 / 3-degree Gauss-Kruger CM 102E
      proj4.defs(
        'EPSG:4543',
        '+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
      )
      // 大地2000投影坐标 CGCS2000 / 3-degree Gauss-Kruger CM 105E
      proj4.defs(
        'EPSG:4544',
        '+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
      )
      // 大地2000投影坐标 CGCS2000 / 3-degree Gauss-Kruger CM 108E
      proj4.defs(
        'EPSG:4545',
        '+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
      )
      // 大地2000投影坐标 CGCS2000 / 3-degree Gauss-Kruger CM 111E
      proj4.defs(
        'EPSG:4546',
        '+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
      )
      // 大地2000投影坐标 CGCS2000 / 3-degree Gauss-Kruger CM 114E
      proj4.defs(
        'EPSG:4547',
        '+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
      )
      // 大地2000投影坐标 CGCS2000 / 3-degree Gauss-Kruger CM 117E
      proj4.defs(
        'EPSG:4548',
        '+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
      )
      // 大地2000投影坐标 CGCS2000 / 3-degree Gauss-Kruger CM 120E
      proj4.defs(
        'EPSG:4549',
        '+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
      )
      // 大地2000投影坐标 CGCS2000 / 3-degree Gauss-Kruger CM 123E
      proj4.defs(
        'EPSG:4550',
        '+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
      )
      // 大地2000投影坐标 CGCS2000 / 3-degree Gauss-Kruger CM 126E
      proj4.defs(
        'EPSG:4551',
        '+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
      )
      // 大地2000投影坐标 CGCS2000 / 3-degree Gauss-Kruger CM 129E
      proj4.defs(
        'EPSG:4552',
        '+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
      )
      // 大地2000投影坐标 CGCS2000 / 3-degree Gauss-Kruger CM 132E
      proj4.defs(
        'EPSG:4553',
        '+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
      )
      // 大地2000投影坐标 CGCS2000 / 3-degree Gauss-Kruger CM 135E
      proj4.defs(
        'EPSG:4554',
        '+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
      )
      // 自定义大地2000投影坐标 中央经线118.5 EPSG编码以及中央经线lon_0可自定义
      proj4.defs(
        'EPSG:7000',
        '+proj=tmerc +lat_0=0 +lon_0=118.5 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
      )
      // register(proj4)
    },
    renderContent(h, { node, data, store }) {
      if (data.buildingid && node.level === 2)
        // 判断是否是单体 若是 展示查看构件按钮
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
                size="mini"
                type="text"
                on-click={$event => this.seeComponent($event, data)}
              >
                模型结构树
              </el-button>
            </span>
          </span>
        )
      else
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>
        )
    },
    // 查看构件树
    async seeComponent(event, data) {
      // event.stopPropagation()
      const results = await this.loadSceneJson(
        data.buildingid,
        data.tiles
      ).catch(err => {
        this.componentTree = []
      })
      if (results) {
        // resolve(results)
        this.componentVisible = true
        this.componentTree = results
      } else {
        this.componentTree = []
      }
    },
    // 关闭构件树
    closeComponentTree() {
      this.componentVisible = false
      this.componentTree = []
    },
    // 文件预览
    previewFile(file) {
      console.log(file)
      common
        .previewFile(
          { docurl: file.docsource },
          {
            responseType: 'blob'
          }
        )
        .then(res => {
          if (res.status === 200) {
            let blob = new Blob([res.data], { type: 'application/pdf' })
            let href = window.URL.createObjectURL(blob) //创建下载的链接
            if (
              file.docformat === 'png' ||
              file.docformat === 'jpg' ||
              file.docformat === 'jpeg'
            ) {
              this.viewerUrls.push(href)
            } else {
              this.previewDialogVisible = true
              this.previewObj = {
                type: file.docformat,
                url: href
              }
            }
          }
        })
    },
    // 项目列表展开|收起
    foldList() {
      this.listFold = !this.listFold
    },
    // sceneJson读取
    loadSceneJson(buildingId, url) {
      return new Promise((resolve, reject) => {
        common
          .loadGeoJson(url + '/scenetree.json')
          .then(res => {
            if (res.scenes) {
              this.setBuildingId(res.scenes, buildingId)
              resolve(res.scenes)
            } else {
              this.setBuildingId(res.children, buildingId)
              resolve(res.children)
            }
          })
          .catch(err => {
            reject({ status: 404, error: url + '/scenetree.json读取失败' })
          })
      })
    },
    // 获取项目及旗下单体（用以构建项目树父级节点）
    getProjectsInfo() {
      return new Promise(resolve => {
        common
          .getProjectsInfo({
            pageno: 0,
            pagesize: 0
          })
          .then(res => {
            if (res.status === 200) {
              res.res.projectinfos.results.forEach(item => {
                item['name'] = item['projectname']
                item['children'] = item['buildinginfos']
                if (item.children && item.children.length > 0) {
                  item.children.forEach((item1, index) => {
                    item1['name'] = item1['buildingname']
                    // this.loadTiles(
                    //   item1.buildingid,
                    //   'NHHD/' + item1.tiles + '/tileset.json',
                    //   // item1.tiles + '/tileset.json',
                    //   item1.longitude,
                    //   item1.latitude,
                    //   item1.rotatez
                    // )
                  })
                }
              })
              resolve(res.res.projectinfos.results)
            } else {
              resolve([])
            }
          })
      })
    },
    // 获取项目其他文件（用于项目文件列表）
    async getProjectOtherFiles(proids) {
      const result = await common.getProjectOtherFiles({ proids })
      if (result.status === 200) {
        let data = result.res.docinfos.results
        let hashObj = {}
        let hashArr = []
        data.forEach(item => {
          if (!hashObj[item.filetype]) {
            hashObj[item.filetype] = true
            hashArr.push({
              type: item.filetype,
              files: [item]
            })
          } else {
            hashArr.forEach(j => {
              if (j.type === item.filetype) j.files.push(item)
            })
          }
        })
        hashArr.sort((a, b) => {
          return fileTypeOrder.indexOf(a.type) - fileTypeOrder.indexOf(b.type)
        })
        this.docList = hashArr
        this.listFold = true
        this.docTitle = '项目级文件'
      }
    },
    // 获取项目JSON文件（用于项目文件列表）
    // async getProjectJsonFiles(proids) {
    //   const result = await common.getProjectJsonFiles({ proids })
    //   if (result.status === 200) {
    //     this.docList = result.res.docinfos.results
    //     this.listFold = true
    //     this.docTitle = '项目级文件'
    //   }
    // },
    // 获取项目JSON文件（用于地图绘制矢量元素）
    async drawProjectJson(proids) {
      const result = await common.getProjectJsonFiles({ proids })
      if (result.status === 200) {
        const files = result.res.docinfos.results
        files.forEach(i => {
          this.loadGeoJson(i.docsource, i.epsg)
        })
      }
    },
    // 获取单体文档信息
    async getMonomerOtherFiles(monids) {
      const result = await common.getMonomerOtherFiles({ buildingids: monids })
      if (result.status === 200) {
        let data = result.res.docinfos.results
        let hashObj = {}
        let hashArr = []
        data.forEach(item => {
          if (!hashObj[item.filetype]) {
            hashObj[item.filetype] = true
            hashArr.push({
              type: item.filetype,
              files: [item]
            })
          } else {
            hashArr.forEach(j => {
              if (j.type === item.filetype) j.files.push(item)
            })
          }
        })
        hashArr.sort((a, b) => {
          return fileTypeOrder.indexOf(a.type) - fileTypeOrder.indexOf(b.type)
        })
        this.docList = hashArr
        this.listFold = true
        this.docTitle = '单体级文件'
      }
    },
    // 项目树读取节点
    async loadNode(node, resolve) {
      if (node.level === 0) return resolve(await this.getProjectsInfo())
      if (node.level === 1) {
        if (node.data.children && node.data.children.length > 0) {
          node.data.children.forEach(i => {
            if (!i.children) {
              i.leaf = true
            }
          })
          node.data.children.sort((a, b) => {
            return (
              mononerTypeOrder.indexOf(a.buildingtype) -
              mononerTypeOrder.indexOf(b.buildingtype)
            )
          })
          return resolve(node.data.children)
        } else return resolve([])
      }
    },
    // 给子节点设置单体名称
    setBuildingId(arr, buildingId) {
      arr.forEach(i => {
        i['buildingid'] = buildingId
        if (i.children && i.children.length > 0)
          this.setBuildingId(i.children, buildingId)
      })
    },
    rotatePosition(x1, y1, x0, y0, angle) {
      console.log(angle)
      let m = Number(x1) - Number(x0)
      let n = Number(y1) - Number(y0)
      let radian = (Number(angle) * Math.PI) / 180
      let m1 =
        m * Math.floor(Math.cos(radian)) + n * Math.floor(Math.sin(-1 * radian))
      let n1 =
        m * Math.floor(Math.sin(radian)) + n * Math.floor(Math.cos(radian))
      return Cesium.Cartesian3.fromDegrees(Number(x0) + m1, Number(y0) + n1)
    },
    // 投影坐标转经纬度
    transform(cartesian) {
      let ellipsoid = viewer.scene.globe.ellipsoid
      let cartesian3 = new Cesium.Cartesian3(
        cartesian.x,
        cartesian.y,
        cartesian.z
      )
      let cartographic = ellipsoid.cartesianToCartographic(cartesian3)
      let lng = Number(Cesium.Math.toDegrees(cartographic.longitude))
      let lat = Number(Cesium.Math.toDegrees(cartographic.latitude))
      let alt = Number(cartographic.height)
      return { lng: lng, lat: lat, alt: alt }
    },
    // 项目树点击事件
    handleNodeClick(data, node) {
      // 跳转前关闭弹框
      this.closePopup()
      if (node.level === 1) this.getProjectOtherFiles(data.proid)
      if (node.level === 2) {
        this.getMonomerOtherFiles(data.buildingid)
        if (tilesetGL && tilesetGL.tileset) {
          if (tilesetGL.id === data.buildingid) {
            viewer.flyTo(tilesetGL.tileset)
            return
          } else {
            this.closeComponentTree()
            viewer.scene.primitives.remove(tilesetGL.tileset)
          }
        }
        let lng = data.longitude
        let lat = data.latitude
        let rotatez = data.rotatez
        if (data.buildingepsg) {
          const transform = proj4(`EPSG:${data.buildingepsg}`, `EPSG:4326`, [
            lng,
            lat
          ])
          lng = transform[0]
          lat = transform[1]
        }
        this.loadTiles(
          data.buildingid,
          // 'NHHD/' + data.tiles + '/tileset.json',
          data.tiles + '/tileset.json',
          lng,
          lat,
          rotatez
        )
      }
    },
    // 单体构件树点击事件
    handleNodeClick2(data, node) {
      // 跳转前关闭弹框
      this.closePopup()
      // 判断是否为末端构件
      if (!node.isLeaf) return

      let nodesphere = data.sphere
      if (!nodesphere) return
      let center = new Cesium.Cartesian3(
        nodesphere[0],
        nodesphere[1],
        nodesphere[2]
      )
      if (!tilesetGL) {
        this.$message.warning('模型正在加载,请稍后重试!')
        return
      }
      if (tilesetGL.inverseMatrix && tilesetGL.tileset._root.transform) {
        let mat = Cesium.Matrix4.multiply(
          tilesetGL.tileset._root.transform,
          tilesetGL.inverseMatrix,
          new Cesium.Matrix4()
        )
        // 是否改变了模型位置
        if (tilesetGL.lng && tilesetGL.lat && tilesetGL.rotatez)
          center = Cesium.Matrix4.multiplyByPoint(
            mat,
            this.rotatePosition(
              this.transform(center).lng,
              this.transform(center).lat,
              tilesetGL.lng,
              tilesetGL.lat,
              tilesetGL.rotatez
            ),
            new Cesium.Cartesian3()
          )
        // 模型初始位置
        else
          center = Cesium.Matrix4.multiplyByPoint(
            mat,
            center,
            new Cesium.Cartesian3()
          )
      }
      let sphere = new Cesium.BoundingSphere(center, nodesphere[3])

      // 定位至包围盒子
      viewer.camera.flyToBoundingSphere(sphere)

      this.processTile(tilesetGL.tileset, data.id, center)
      // 模型构件高亮
      tilesetGL.tileset.style = new Cesium.Cesium3DTileStyle({
        color: {
          conditions: this.tileHighStyleSet(tilesetGL.tileset, data.id)
        }
      })
      highTile = tilesetGL.tileset
    },
    // 模型高亮效果设置
    tileHighStyleSet(tile, id) {
      // 高亮效果设置 高亮变红且其余构件透明
      let conditions = []
      let condition = []
      let condition2 = []
      condition.push("${id} === '" + id + "'")
      condition.push("color('rgba(255,0,0,1)')")
      condition2.push("${id} !== '" + id + "'")
      condition2.push("color('rgba(255,255,255,0.3)')")
      conditions.push(condition)
      conditions.push(condition2)
      return conditions
    },
    // 获取Cesium3DTile
    processTile(tileset, id) {
      if (tileVisibleFn) {
        tileset.tileVisible.removeEventListener(tileVisibleFn)
      }
      tileVisibleFn = tile => {
        if (!tile.content instanceof Cesium.Batched3DModel3DTileContent) return
        this.processTileFeatures(tile, data => {
          if (data.getProperty('id') === id) {
            this.popupField = this.getFeatureProperty(data)
            this.listFold = false
            this.styleObject = {
              display: 'block'
            }
          }
        })
      }
      tileset.tileVisible.addEventListener(tileVisibleFn)
    },
    // 获取Cesium3DTile content
    processTileFeatures(tile, callback) {
      var content = tile.content
      var innerContents = content.innerContents
      if (Cesium.defined(innerContents)) {
        var length = innerContents.length
        for (var i = 0; i < length; ++i) {
          this.processContentFeatures(innerContents[i], callback)
        }
      } else {
        this.processContentFeatures(content, callback)
      }
    },
    // 获取Cesium3DTileFeature
    processContentFeatures(content, callback) {
      var featuresLength = content.featuresLength
      for (var i = 0; i < featuresLength; ++i) {
        var feature = content.getFeature(i)
        callback(feature)
      }
    },
    // 关闭弹框
    closePopup() {
      if (highTile) {
        if (tileVisibleFn) {
          highTile.tileVisible.removeEventListener(tileVisibleFn)
        }
        highTile.style = new Cesium.Cesium3DTileStyle({
          color: {
            conditions: []
          }
        })
        highTile = null
      }

      // componentPopupPosition = null

      this.styleObject = {
        // left: 0,
        // top: 0,
        display: 'none'
      }
      this.popupField = {}
      console.log(this.styleObject)
      // viewer.scene.postRender.removeEventListener(anonymous)
    },
    // 实时更新构件弹框位置
    // updatePosition() {
    //   anonymous = () => {
    //     if (!componentPopupPosition) return
    //     let popupPosition = componentPopupPosition
    //     let cameraPosition = viewer.camera.position
    //     let height = viewer.scene.globe.ellipsoid.cartesianToCartographic(
    //       cameraPosition
    //     ).height
    //     let mp_position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    //       viewer.scene,
    //       popupPosition
    //     )
    //     if (!mp_position) return
    //     let flag = false
    //     if (
    //       !((height += 1 * viewer.scene.globe.ellipsoid.maximumRadius),
    //       Cesium.Cartesian3.distance(cameraPosition, popupPosition) > height)
    //     ) {
    //       flag = true
    //     }
    //     if (flag) {
    //       this.styleObject = {
    //         left: mp_position.x - 45 + 'px',
    //         top: mp_position.y - 375 + 'px',
    //         display: 'block'
    //       }
    //     } else {
    //       this.styleObject = {
    //         left: 0,
    //         top: 0,
    //         display: 'none'
    //       }
    //     }
    //   }
    //   viewer.scene.postRender.addEventListener(anonymous)
    // },
    // 工具-测量
    measure(type) {
      // console.log(this.toolDefault())
      switch (type) {
        case 'distance':
          this.toolIndex = 1
          break
        case 'area':
          this.toolIndex = 2
          break
        case 'height':
          this.toolIndex = 3
          break
      }
      if (!this.toolDefault()) return
      //  alert(3)
      this.toolLastIndex = this.toolIndex
      // 工具栏-测量
      Measure.startMeasure(type, res => {
        console.log(res)
        this.toolIndex = null
        this.toolLastIndex = null
      })
    },
    // 工具-标记
    tag() {
      this.toolIndex = 4
      if (!this.toolDefault()) return
      this.toolLastIndex = 4
      // 工具栏-标记
      Mark.tagging()
    },
    // 工具-识别
    distinguish() {
      this.toolIndex = 0
      if (!this.toolDefault()) return
      this.toolLastIndex = 0
      Distinguishing.openDistinguish(res => {
        // componentPopupPosition = res.position
        this.popupField = this.getFeatureProperty(res.feature)
        this.listFold = false
        this.styleObject = {
          display: 'block'
        }
      })
    },
    // 工具-地下
    underground() {
      this.toolIndex = 5
      if (!this.toolDefault()) return
      this.toolLastIndex = 5
      this.undergroundChange({
        enableCollisionDetection: false,
        translucencyEnabled: true,
        fadeByDistance: true,
        alpha: 0.5
      })
    },
    undergroundChange(viewModel) {
      viewer.scene.screenSpaceCameraController.enableCollisionDetection =
        viewModel.enableCollisionDetection
      viewer.scene.globe.translucency.enabled = viewModel.translucencyEnabled
      viewer.scene.globe.translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(
        400.0,
        0.0,
        800.0,
        1.0
      )

      var alpha = Number(viewModel.alpha)
      alpha = !isNaN(alpha) ? alpha : 1.0
      alpha = Cesium.Math.clamp(alpha, 0.0, 1.0)

      viewer.scene.globe.translucency.frontFaceAlphaByDistance.nearValue = alpha
      viewer.scene.globe.translucency.frontFaceAlphaByDistance.farValue = viewModel.fadeByDistance
        ? 1.0
        : alpha
    },
    // 工具-重置
    reset() {
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          119.489064142175,
          32.9653877905019,
          650000
        ),
        offset: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-25)
          // range: 5000
        }
      })
      this.toolDefault()
    },
    // 工具初始化
    toolDefault() {
      if (this.toolLastIndex !== null) {
        if (this.toolLastIndex === 0) Distinguishing.closeDistinguish()
        else if (this.toolLastIndex < 4) Measure.reset()
        else if (this.toolLastIndex === 4) Mark.stopTagging()
        else if (this.toolLastIndex === 5) {
          this.undergroundChange({
            enableCollisionDetection: true,
            translucencyEnabled: false,
            fadeByDistance: false,
            alpha: 1.0
          })
        }
      }
      if (
        this.toolLastIndex !== null &&
        this.toolLastIndex === this.toolIndex
      ) {
        this.toolIndex = null
        this.toolLastIndex = null
        return false
      }
      return true
    },
    // 读取feature的property
    getFeatureProperty(feature) {
      let keys = feature.getPropertyNames()
      let hash = {}
      keys.forEach(i => {
        hash[i] = feature.getProperty(i)
      })
      return hash
    },







    // 三维cesium初始化
    mapInit() {
      Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MTIzNzY5OC1hOWM2LTRiMWMtYTc5YS1lNjFmZmJhNDcxZjEiLCJpZCI6MTEzNjIsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyJdLCJpYXQiOjE1NjAxMzMzOTZ9.u3sp8GEkT7NjKeexeoUzMjgND6FHk0iGhdV-YxrJw-o'
      viewer = new Cesium.Viewer('container', {
        // // 官方离线球体影像
        // imageryProvider: new Cesium.TileMapServiceImageryProvider({
        //   url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
        // }),
        // // 天地图影像
        // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        //   url:
        //     'http://t0.tianditu.gov.cn/img_w/wmts?tk=e17b42d8b496f330389aa0ac59c8ad91',
        //   // subdomains: subdomains,
        //   layer: 'img',
        //   style: 'default',
        //   format: 'tiles',
        //   tileMatrixSetID: 'w',
        //   maximumLevel: 18,
        //   show: true
        // }),
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
        creditsDisplay: false
      })
      // 隐藏版权信息
      viewer._cesiumWidget._creditContainer.style.display = 'none'
      // 开启深度检测
      viewer.scene.globe.depthTestAgainstTerrain = true
      // 开启抗锯齿
      viewer.scene.postProcessStages.fxaa.enabled = true
      // 开启HDR
      // viewer.scene.highDynamicRange = true
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

      // 测量类
      Measure = new NewMeasure(Cesium, viewer)
      // 标记类
      Mark = new Tag(Cesium, viewer, 'gis-container')
      // 标记类回调
      Mark.callBackFn(res => {
        this.toolIndex = null
        this.toolLastIndex = null
        let data = res.data
        if (res.status === 200) {
          // 新增
          this.addMark(
            data.code,
            data.name,
            data.content,
            data.lng,
            data.lat,
            data.height
          )
        } else if (res.status === 100) {
          // 删除
          this.deleteMark(data.code)
        } else if (res.status === 205) {
          this.editMark(data.code, data.name, data.content)
        }
      })
      // 获取已有标记点
      this.getMarkList()
      // 识别
      Distinguishing = new Distinguish(Cesium, viewer)

      // viewer单击事件
      viewer.screenSpaceEventHandler.setInputAction(movement => {
        let feature = viewer.scene.pick(movement.position)
        if (!feature) this.closePopup()
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      // 绘制矢量点位
      this.drawProjectJson()
    },


    // 3dtiles旋转 此方法暂时只能用来旋转
    rotateModel(x, y, z, rotation, tileset) {
      var transformMat = Cesium.Matrix4.fromArray(
        Cesium.Matrix4.clone(tileset.modelMatrix)
      )
      var matRotation = Cesium.Matrix4.getMatrix3(
        transformMat,
        new Cesium.Matrix3()
      )
      var inverseMatRotation = Cesium.Matrix3.inverse(
        matRotation,
        new Cesium.Matrix3()
      )
      var matTranslation = Cesium.Matrix4.getTranslation(
        transformMat,
        new Cesium.Cartesian3()
      )

      var transformation = Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(x, y, z)
      )
      // var transformation = Cesium.Transforms.eastNorthUpToFixedFrame(tileset.boundingSphere.center);
      var transformRotation = Cesium.Matrix4.getMatrix3(
        transformation,
        new Cesium.Matrix3()
      )
      var transformTranslation = Cesium.Matrix4.getTranslation(
        transformation,
        new Cesium.Cartesian3()
      )

      var matToTranslation = Cesium.Cartesian3.subtract(
        matTranslation,
        transformTranslation,
        new Cesium.Cartesian3()
      )
      matToTranslation = Cesium.Matrix4.fromTranslation(
        matToTranslation,
        new Cesium.Matrix4()
      )

      var matToTransformation = Cesium.Matrix3.multiply(
        inverseMatRotation,
        transformRotation,
        new Cesium.Matrix3()
      )
      matToTransformation = Cesium.Matrix3.inverse(
        matToTransformation,
        new Cesium.Matrix3()
      )
      matToTransformation = Cesium.Matrix4.fromRotationTranslation(
        matToTransformation
      )

      var rotationTranslation = Cesium.Matrix4.fromRotationTranslation(
        Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotation))
      )

      Cesium.Matrix4.multiply(
        transformation,
        rotationTranslation,
        transformation
      )
      Cesium.Matrix4.multiply(
        transformation,
        matToTransformation,
        transformation
      )
      Cesium.Matrix4.multiply(transformation, matToTranslation, transformation)

      tileset.modelMatrix = transformation
    },
    // 3dtiles模型加载
    loadTiles(id, url, lng, lat, rotatez) {
      const cesium3DTileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: url
          // maximumScreenSpaceError: 2,        //最大的屏幕空间误差
          // maximumNumberOfLoadedTiles: 100, //最大加载瓦片个数
          // name: 'F01',
          // show: true
        })
      )
      cesium3DTileset.readyPromise.then(tileset => {
        let mat = Cesium.Matrix4.fromArray(tileset._root.transform)
        let orginMatrixInverse = Cesium.Matrix4.inverse(
          mat,
          new Cesium.Matrix4()
        )
        tilesetGL = {
          id: id,
          tileset: tileset,
          inverseMatrix: orginMatrixInverse,
          lng: lng,
          lat: lat,
          rotatez: rotatez
        }
        if (lng && lat && rotatez) {
          this.rotateModel(lng, lat, 0, rotatez, tileset)
        }
        viewer.flyTo(tileset)
      })
    },
    // 加载江苏省边界geoJson
    loadBoundaryGeoJson() {
      common.loadGeoJson('/geoJson/江苏省边界.json').then(res => {
        let promise = Cesium.GeoJsonDataSource.load(res, {
          stroke: Cesium.Color.fromBytes(49, 150, 255, 255),
          fill: Cesium.Color.fromBytes(194, 219, 245, 0),
          strokeWidth: 4.0
        })
        promise.then(function(dataSource) {
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
                style: Cesium.LabelStyle.FILL
              })
              // entity.polygon.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(
              //   800
              // )
            }
          }
        })
      })
    },
    // 投影坐标转经纬度
    transform(cartesian) {
      let ellipsoid = viewer.scene.globe.ellipsoid
      let cartesian3 = new Cesium.Cartesian3(
        cartesian.x,
        cartesian.y,
        cartesian.z
      )
      let cartographic = ellipsoid.cartesianToCartographic(cartesian3)
      let lng = Number(Cesium.Math.toDegrees(cartographic.longitude))
      let lat = Number(Cesium.Math.toDegrees(cartographic.latitude))
      let alt = Number(cartographic.height)
      return { lng: lng, lat: lat, alt: alt }
    },
    // 加载项目geoJson
    loadGeoJson(url, epsg = 4548) {
      common.loadGeoJson(url).then(res => {
        let result = res
        result.features.forEach(i => {
          if (i.geometry.type === 'LineString') {
            // 线
            let proj4Arr = []
            i.geometry.coordinates.forEach(j => {
              proj4Arr.push(proj4(`EPSG:${epsg}`, `EPSG:4326`, [j[0], j[1]]))
            })
            i.geometry.coordinates = proj4Arr
          } else if (i.geometry.type === 'Point') {
            // 点
            i.geometry.coordinates = proj4(`EPSG:${epsg}`, `EPSG:4326`, [
              i.geometry.coordinates[0],
              i.geometry.coordinates[1]
            ])
          }
        })
        let promise = Cesium.GeoJsonDataSource.load(result)
        promise.then(dataSource => {
          viewer.dataSources.add(dataSource)
          let entities = dataSource.entities.values
          for (let i = 0; i < entities.length; i++) {
            const type = entities[i].properties.getValue().Type
            if (type === '船闸') {
              let transformPosition = this.transform(
                entities[i].position.getValue()
              )
              entities[i].position.setValue(
                Cesium.Cartesian3.fromDegrees(
                  transformPosition.lng,
                  transformPosition.lat,
                  5
                )
              )
            }
            if (entities[i].billboard) {
              // 点图层
              entities[i].billboard = new Cesium.BillboardGraphics({
                image: require(`@/assets/img/gisIcon/${this.iconImgs[type]}.png`),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                scaleByDistance: new Cesium.NearFarScalar(5000, 1, 1.5e7, 0.1),
                translucencyByDistance: new Cesium.NearFarScalar(
                  5000,
                  1,
                  1.5e7,
                  0.2
                )
              })
            } else if (entities[i].polyline) {
              entities[i].polyline.clampToGround = true
              entities[i].polyline.width = 4
              entities[i].polyline.material = Cesium.Color.fromCssColorString(
                this.iconImgs[type]
              )
            }
          }
        })
      })
    },
    // 获取已有标记
    async getMarkList() {
      const result = await tag.getMarkList()
      if (result.status === 200) {
        result.res.points.results.forEach(i => {
          Mark.createEntities({
            code: i.markid,
            name: i.markName,
            content: i.markNote,
            lng: i.markx,
            lat: i.marky,
            height: i.markz
          })
        })
      }
    },
    // 新增标记
    async addMark(markId, markName, markNote, markx, marky, markz) {
      const result = await tag.addMark({
        markId,
        markName,
        markNote,
        markx,
        marky,
        markz
      })
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: result.msg
        })
      } else this.$message.error(result.msg)
    },
    // 编辑标记
    async editMark(markId, markName, markNote) {
      const result = await tag.editMark({
        markId,
        markName,
        markNote
      })
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: result.msg
        })
      } else this.$message.error(result.msg)
    },
    // 删除标记
    async deleteMark(markId) {
      const result = await tag.deleteMark({ markId })
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: result.msg
        })
      } else this.$message.error(result.msg)
    }
  }
}
</script>

<style lang="scss" scoped>
.view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.tree-container {
  width: 20.4%;
  height: 100%;
  padding: 0 15px 15px 17px;
  position: relative;
  left: 0;
  top: 0;
  background-color: #fff;
  box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.1);
}
.tree-title {
  height: 45px;
  padding-left: 10px;
  display: flex;
  align-items: center;
  position: relative;
  left: 0;
  top: 0;
  color: #2a95e8;
  > span {
    font-size: 16px;
    font-weight: bold;
  }
  &::before {
    content: '';
    width: 3px;
    height: 15px;
    margin-top: -7.5px;
    position: absolute;
    left: 0;
    top: 50%;
    background-color: #2a8df0;
  }
}
.tree-content {
  height: calc(100% - 45px);
  overflow-y: auto;
}
.gis-container {
  width: 78.8%;
  height: 100%;
  padding: 5px;
  position: relative;
  left: 0;
  top: 0;
  background: #fff;
  box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.1);
}
#container {
  position: absolute;
  left: 5px;
  top: 5px;
  right: 5px;
  bottom: 5px;
  overflow: hidden;
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
#componentPopup {
  width: 350px;
  // height: 275px;
  background-color: #fff;
  position: absolute;
  // left: 0;
  // top: 0;
  top: 12px;
  right: 18px;
  z-index: 100;
  border-radius: 4px;
  box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.15);
  .title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 15px;
    padding-right: 20px;
    border-radius: 4px 4px 0 0;
    background-color: #f6f6f6;
    > span {
      font-size: 16px;
      color: #2a8df0;
    }
    i {
      cursor: pointer;
      font-size: 24px;
      color: #333;
    }
  }
  .content {
    height: 325px;
    padding: 10px 20px;
    border: 1px solid #e7ecf2;
    border-radius: 0 0 4px 4px;
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
    }
  }
  // &:after {
  //   top: 100%;
  //   border: solid transparent;
  //   content: ' ';
  //   height: 0;
  //   width: 0;
  //   position: absolute;
  //   pointer-events: none;
  //   border-top-color: white;
  //   border-width: 10px;
  //   left: 48px;
  //   margin-left: -10px;
  // }
}
.doc-list-container {
  width: 300px;
  // height: 240px;
  position: absolute;
  right: 18px;
  top: 12px;
  z-index: 100;
  border: 1px solid #e7ecf2;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.15);
  .doc-list-title {
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
  .doc-list-content {
    transition: all 0.25s linear;
    height: 285px;
    padding: 10px 15px;
  }
  .doc-list-box {
    height: 100%;
    border: 1px solid #c5d6e3;
    overflow-y: auto;
    .doc-type {
      height: 35px;
      line-height: 35px;
      padding-left: 5px;
      background-color: rgba(202, 233, 255, 0.3);
    }
  }
  .doc-list {
    cursor: pointer;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    border-bottom: 1px solid #dee7ed;
    // background-color: #f8f8f8;
    // &:nth-of-type(odd) {
    //   background-color: rgba(202, 233, 255, 0.3);
    // }
    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
    }
    .el-button {
      flex: none;
      margin-left: 5px;
    }
    &:last-child {
      border-bottom: 0;
    }
  }
  .projectListNow {
    color: #fff;
    background-color: #2892e6 !important;
  }
  .listFold {
    height: 0;
    padding: 0;
    overflow: hidden;
  }
}
.component-tree {
  position: absolute;
  z-index: 100;
  left: 18px;
  top: 12px;
  width: 25%;
  min-width: 280px;
  height: 60%;
  border-radius: 4px;
  border: 1px solid #e7ecf2;
  background-color: #fff;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.15);
  .component-tree-title {
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
  .component-tree-content {
    height: calc(100% - 35px);
    padding: 10px 15px;
    > div {
      height: 100%;
      border: 1px solid #c5d6e3;
      overflow: auto;
    }
  }
}
/deep/.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
/deep/.el-tree {
  min-width: 100%;
  display: inline-block;
}
</style>
