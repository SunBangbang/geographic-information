<template>
  <el-dialog
    width="900px"
    title="3dtiles预览"
    :visible="visible"
    @close="handleClose"
    append-to-body
  >
    <div
      class="gis-container"
      id="gis-container"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div id="container"></div>
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
          @click="underground"
        >
          <div>
            <i class="iconfont icon-dixiamoshi"></i>
            <span>地下</span>
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
  </el-dialog>
</template>

<script>
import { NewMeasure } from '@/utils/measure-new'
import { Distinguish } from '@/utils/distinguish'

let viewer = null
let highTile = null // 当前高亮3dtiles
let tileVisibleFn = null
let Measure = null
let Distinguishing = null
export default {
  name: 'gis',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tileObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loading: true,
      orginMatrixInverse: null,
      toolIndex: null,
      toolLastIndex: null,
      popupField: {},
      styleObject: {
        display: 'none'
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
    tileVisibleFn = null
    Measure = null
    Distinguishing = null
  },
  mounted() {
    setTimeout(() => {
      this.mapInit()
      this.loading = false
    }, 1000)
    // this.updatePosition()
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
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
    // cesium初始化
    mapInit() {
      Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MTIzNzY5OC1hOWM2LTRiMWMtYTc5YS1lNjFmZmJhNDcxZjEiLCJpZCI6MTEzNjIsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyJdLCJpYXQiOjE1NjAxMzMzOTZ9.u3sp8GEkT7NjKeexeoUzMjgND6FHk0iGhdV-YxrJw-o'
      viewer = new Cesium.Viewer('container', {
        // 官方离线球体影像
        // imageryProvider: new Cesium.TileMapServiceImageryProvider({
        //   url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
        // }),
        // 天地图影像
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
        // })
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

      // 测量类
      Measure = new NewMeasure(Cesium, viewer)
      // 识别
      Distinguishing = new Distinguish(Cesium, viewer)

      // 加载模型
      if (this.tileObj.url)
        this.loadTiles(
          this.tileObj.url,
          this.tileObj.lng,
          this.tileObj.lat,
          this.tileObj.rotateZ
        )
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
    loadTiles(url, lng, lat, rotatez) {
      const cesium3DTileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          // url: 'NHHD/' + url + '/tileset.json'
          url: url + '/tileset.json'
          // maximumScreenSpaceError: 2,        //最大的屏幕空间误差
          // maximumNumberOfLoadedTiles: 100, //最大加载瓦片个数
          // name: 'F01',
          // show: true
        })
      )
      cesium3DTileset.readyPromise.then(tileset => {
        if (lng && lat && rotatez) {
          this.rotateModel(lng, lat, 0, rotatez, tileset)
        }
        viewer.flyTo(tileset)
      })
    },
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
        this.toolIndex = null
        this.toolLastIndex = null
      })
    },
    // 工具-识别
    distinguish() {
      this.toolIndex = 0
      if (!this.toolDefault()) return
      this.toolLastIndex = 0
      Distinguishing.openDistinguish(res => {
        this.popupField = this.getFeatureProperty(res.feature)
        this.styleObject = {
          display: 'block'
        }
      })
    },
    // 工具-地下
    underground() {
      this.toolIndex = 4
      if (!this.toolDefault()) return
      this.toolLastIndex = 4
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
    // 工具初始化
    toolDefault() {
      if (this.toolLastIndex !== null) {
        if (this.toolLastIndex === 0) Distinguishing.closeDistinguish()
        else if (this.toolLastIndex < 4) Measure.reset()
        else if (this.toolLastIndex === 4) {
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
      this.styleObject = {
        display: 'none'
      }
      this.popupField = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.gis-container {
  width: 100%;
  height: 550px;
  padding: 5px;
  position: relative;
  left: 0;
  top: 0;
  background: #fff;
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
</style>
