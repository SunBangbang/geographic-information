<template>
  <el-dialog
    title="详情"
    width="950px"
    :visible="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <preview-cesium
      :visible.sync="innerVisibleCesium"
      :tileObj="tileObj"
      v-if="innerVisibleCesium"
    />
    <preview-openlayers
      :visible.sync="innerVisibleOpenlayers"
      :jsonFiles="jsonFiles"
      v-if="innerVisibleOpenlayers"
    />
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item :title="'项目信息-' + projectData.projectname" name="1">
        <descriptions
          :title="projectData.projectname"
          :descriptionsData="projectData.textInfo"
          :options="descriptionsOptions"
        >
          <template v-slot:preview>
            <el-button
              type="primary"
              size="mini"
              @click="jsonPreview(projectData)"
              >geoJson预览</el-button
            >
          </template>
        </descriptions>
        <div class="project-files-container">
          <div>
            <p class="sub-title">geoJson文件</p>
            <file-list
              :styleObj="styleObj"
              :listData="projectData.jsonFiles"
              @preview="preview"
              @download="download"
            />
          </div>
          <div>
            <p class="sub-title">项目文件</p>
            <type-file-list
              :styleObj="styleObj"
              :listData="projectData.otherFiles"
              @preview="preview"
              @download="download"
            />
          </div>
        </div>
      </el-collapse-item>
      <!-- <el-collapse-item title="项目文件" name="2"> </el-collapse-item> -->
      <el-collapse-item
        v-for="(item, index) in monomerData"
        :key="index"
        :title="'单体信息-' + item.buildingname"
        :name="3 + index"
      >
        <descriptions
          :title="item.buildingname"
          :descriptionsData="item.textInfo"
          :options="descriptionsOptions"
        >
          <template v-slot:preview>
            <el-button type="primary" size="mini" @click="tilesPreview(item)"
              >3dtiles预览</el-button
            >
          </template>
        </descriptions>
        <p class="sub-title">单体文件</p>
        <type-file-list
          :styleObj="styleObj"
          :listData="item.buildingdoc"
          @preview="preview"
          @download="download"
        />
      </el-collapse-item>
    </el-collapse>
  </el-dialog>
</template>

<script>
import Descriptions from '@/components/Descriptions'
import FileList from '@/components/FileList'
import TypeFileList from '@/components/TypeFileList'
import PreviewCesium from '@/components/PreviewCesium'
import PreviewOpenlayers from '@/components/PreviewOpenlayers'
export default {
  name: 'details-dialog',
  components: {
    Descriptions,
    FileList,
    TypeFileList,
    PreviewCesium,
    PreviewOpenlayers
  },
  props: {
    // 弹框显隐
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    projectData() {
      return this.info.projectinfo
    },
    monomerData() {
      return this.info.buildinginfo
    }
  },
  data() {
    return {
      innerVisibleCesium: false, // 3dtiles预览弹框
      innerVisibleOpenlayers: false, // geoJson预览弹框
      activeNames: ['1'],
      styleObj: {
        // 文件列表样式
        'background-color': '#fafafa',
        border: '1px solid #EBEEF5'
      },
      descriptionsOptions: {
        column: 2,
        labelStyle: {
          width: '120px'
        },
        contentStyle: {
          minWidth: '120px'
        },
        size: 'small'
      },
      tileObj: {
        url: null,
        lng: null,
        lat: null,
        rotateZ: null
      },
      jsonFiles: [],
      size: 'small'
    }
  },
  mounted() {},
  methods: {
    handleChange(val) {
      console.log(val)
    },
    // 弹窗关闭
    handleClose() {
      this.tileObj = {
        url: null,
        lng: null,
        lat: null,
        rotateZ: null
      }
      this.jsonFiles = []
      this.activeNames = ['1']
      this.$emit('update:visible', false)
      this.$emit('update:info', null)
    },
    // geoJson预览
    jsonPreview(e) {
      console.log(e)
      this.innerVisibleOpenlayers = true
      this.jsonFiles = e.jsonFiles
      this.$emit('jsonPreview', e)
    },
    // 3dtiles预览
    tilesPreview(e) {
      console.log(e)
      this.innerVisibleCesium = true
      this.tileObj = {
        url: e.tiles,
        lng: e.longitude,
        lat: e.latitude,
        rotateZ: e.rotatez
      }
      this.$emit('tilesPreview', e)
      // alert(JSON.stringify(e))
    },
    // 文件预览
    preview(e) {
      this.$emit('filesPreview', e)
      alert(JSON.stringify(e))
    },
    // 文件下载
    download(e) {
      this.$emit('filesDownload', e)
      alert(JSON.stringify(e))
    }
  }
}
</script>

<style lang="scss" scoped>
.project-files-container {
  width: 100%;
  // display: flex;
  // justify-content: space-around;
  // > div {
  //   width: 49%;
  // }
}
.sub-title {
  height: 40px;
  line-height: 40px;
  font-weight: bold;
}
/deep/.el-dialog__body {
  padding: 20px;
}
/deep/.el-collapse-item__wrap {
  padding: 10px 20px;
}
/deep/.el-collapse-item__header {
  padding-left: 10px;
}
/deep/.el-collapse-item__header.is-active {
  color: #fff;
  background-color: #1b85d7;
}
</style>
