<template>
  <el-dialog
    width="870px"
    title="geoJson预览"
    :visible="visible"
    @close="handleClose"
    append-to-body
  >
    <div
      class="gis-container"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div id="container"></div>
    </div>
  </el-dialog>
</template>

<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import GeoJSON from 'ol/format/GeoJSON'
import WMTS from 'ol/source/WMTS'
import TileWMS from 'ol/source/TileWMS'
import TileImage from 'ol/source/TileImage'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import View from 'ol/View'
import { getWidth, getTopLeft } from 'ol/extent'
import { get as getProjection, Projection } from 'ol/proj'
import { register } from 'ol/proj/proj4'
import { Style, Fill, Icon, Stroke, Text, Circle } from 'ol/style'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import Polygon from 'ol/geom/Polygon'
import { common } from '@/api/index'

let map = null
let view = null
let vectorSource = null
let vectorLayer = null
let locationGeometry = null
export default {
  name: 'openlayers',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    jsonFiles: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: true,
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
        三级航道: '#9d77e5',
        四级航道: '#184fa2'
      }
    }
  },
  destroyed() {
    if (map) {
      if (vectorSource) vectorSource.clear()
      if (vectorLayer) map.removeLayer(vectorLayer)
    }
    map = null
    view = null
    vectorSource = null
    vectorLayer = null
    locationGeometry = null
  },
  mounted() {
    setTimeout(() => {
      this.initMap()
      this.getProjectJsonFiles(this.jsonFiles)
      this.loading = false
    }, 1000)
  },
  computed: {
    isFold() {
      if (!this.legendFold)
        // 折叠
        return require('@/assets/img/overview/icon_fold.png')
      if (this.legendFold)
        // 展开
        return require('@/assets/img/overview/icon_open.png')
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    // 获取项目JSON文件
    getProjectJsonFiles(arr) {
      let promiseCollection = []
      arr.forEach(i => {
        promiseCollection.push(this.loadGeoJson(i.docsource, i.epsg))
      })
      const promiseAll = Promise.allSettled(promiseCollection)
      promiseAll
        .then(res => {
          if (!res.length) return
          let featureCollection = []
          res.forEach(i => {
            if (i.status === 'fulfilled')
              featureCollection = [...featureCollection, ...i.value]
          })
          vectorSource.addFeatures(featureCollection)
          this.locationGeoJson(featureCollection)
        })
        .catch(err => {})
    },
    // geoJson定位
    locationGeoJson(features) {
      let locationFeature = null // 定位用feature
      let pointArr = []
      features.forEach(i => {
        let type = ''
        if (i.getProperties()) type = i.getProperties().Type
        if (
          i.getGeometry().getType() === 'LineString' &&
          type.indexOf('航道') > -1
        ) {
          // 判断是否存在航道线geoJson
          locationFeature = i.getGeometry()
        } else if (i.getGeometry().getType() === 'Point') {
          const getCoordinates = i.getGeometry().getCoordinates()
          pointArr.push([getCoordinates[0], getCoordinates[1]])
        }
      })
      if (!locationFeature && pointArr.length > 0) {
        // 判断是否存在航道线图层，若不存在则通过单体点位集合生成多边形进行定位
        locationFeature = this.createPolygon(pointArr)
      }
      view.fit(locationFeature, { padding: [50, 50, 50, 50] })
    },
    // 生成多边形
    createPolygon(coordinates) {
      return new Polygon([coordinates])
    },
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
      register(proj4)
    },
    // 地图初始化
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
      // geoserver 发布图层
      // const tunnelCenter = this.loadGeoServerLayer(
      //   'shantou',
      //   'TunnelCenter_PolyLine',
      //   true,
      //   0.000010728836059570312
      // )
      // const tunnelCabin = this.loadGeoServerLayer(
      //   'shantou',
      //   'TunnelCabin_Polygon1',
      //   true,
      //   undefined,
      //   0.000010728836059570312
      // )
      view = new View({
        projection: projection,
        center: [119.489064142175, 32.9653877905019],
        zoom: 7.5
      })
      // 市级名称标识
      const identification = this.loadGeoServerLayer('snhd', 's_name', true)
      map = new Map({
        layers: [tdLayer, identification],
        target: 'container',
        view
      })
      console.log('init finished')
      // 定义坐标且注册
      this.proj4Register()

      vectorSource = new VectorSource({})
      vectorLayer = new VectorLayer({
        title: 'vector Layer',
        source: vectorSource,
        style: this.styleFunction
      })
      map.addLayer(vectorLayer)

      this.loadBoundaryGeoJson('/geoJson/江苏省边界.json')
    },
    // geoJson样式
    styleFunction(feature, resolution) {
      let geometryType = feature.getGeometry().getType()
      let type = feature.getProperties().Type
      if (geometryType === 'Point') {
        let url = null
        if (type != undefined) {
          url = require(`@/assets/img/gisIcon/${this.iconImgs[type]}.png`)
        } else {
          url = require(`@/assets/img/gisIcon/navigationLock.png`)
        }
        return new Style({
          image: new Icon({
            // anchor: [0.5, 0.96],
            src: url
          }),
          text: this.styleTextFunction(feature, resolution)
        })
      }
      if (geometryType === 'LineString')
        if (type != undefined)
          return new Style({
            stroke: new Stroke({
              color: this.iconImgs[type],
              width: 4
            })
          })
        else
          return new Style({
            stroke: new Stroke({
              color: '#ccc',
              width: 1
            })
          })
      if (geometryType === 'Polygon')
        return new Style({
          stroke: new Stroke({
            color: 'rgba(49, 150, 255, .5)',
            width: 1
          }),
          fill: new Fill({
            color: 'rgba(194, 219, 245, 0)'
          })
        })
    },
    getText(feature, resolution) {
      const maxResolution = 0.00018371349558822203
      let text = feature.getProperties().NAME
      if (resolution > maxResolution) {
        text = ''
      }
      return text
    },
    // geoJson text样式
    styleTextFunction(feature, resolution) {
      return new Text({
        font: '12px sans-serif',
        text: this.getText(feature, resolution),
        fill: new Fill({ color: '#000' }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
        offsetX: 0,
        offsetY: 20
      })
    },
    // 加载省市边界geoJson
    loadBoundaryGeoJson(url) {
      common.loadGeoJson(url).then(res => {
        let features = new GeoJSON().readFeatures(res)
        vectorSource.addFeatures(features)
      })
    },
    // 加载geoJson
    loadGeoJson(url, epsg = 4548) {
      return new Promise((resolve, reject) => {
        common
          .loadGeoJson(url)
          .then(res => {
            let features = new GeoJSON().readFeatures(res)
            for (var i = 0; i < features.length; i++) {
              features[i]
                .getGeometry()
                .transform(
                  new Projection({ code: `EPSG:${epsg}` }),
                  new Projection({ code: 'EPSG:4326' })
                )
            }
            resolve(features)
            // vectorSource.addFeatures(features)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 加载天地图
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
    }
  }
}
</script>

<style lang="scss" scoped>
.gis-container {
  width: 100%;
  height: 500px;
  padding: 5px;
  position: relative;
  left: 0;
  top: 0;
  background: #fff;
  box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.1);
}
#container {
  width: 100%;
  height: 100%;
}
</style>
