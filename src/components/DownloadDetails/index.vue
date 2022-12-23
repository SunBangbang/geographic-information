<template>
  <el-dialog
    width="950px"
    :title="title"
    :visible="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <descriptions
      :title="descriptionsTitle"
      :descriptionsData="info.descriptions"
    />
    <p class="sub-title">申请附件列表</p>
    <file-list
      :styleObj="styleObj"
      :listData="info.docmateriallist"
      @preview="preview"
      @download="download"
    />
    <p class="sub-title">下载申请列表</p>
    <div class="check-button">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        >全选</el-checkbox
      >
      <el-button
        type="primary"
        size="mini"
        @click="confirmDownload"
        v-if="Number(this.info.status) === 4"
        :disabled="isDisabled"
        >下载</el-button
      >
    </div>

    <div class="list-container" :style="styleObj">
      <el-checkbox-group
        v-model="checkedFiles"
        @change="handleCheckedFilesChange"
      >
        <div v-for="(item, index) in info.downlist" :key="index" class="list">
          <div class="info-box">
            <el-checkbox :label="item.downid" :key="item.downid">{{
              item.docname
            }}</el-checkbox>
            <span class="size">{{ item.docsize }}KB</span>
          </div>
          <div class="button-box">
            <el-button type="text" @click="preview(item)">预览</el-button>
            <!-- <el-button type="text" @click="download(item)">下载</el-button> -->
          </div>
        </div>
      </el-checkbox-group>
    </div>
    <!-- <file-list
      :styleObj="styleObj"
      :listData="info.downlist"
      @preview="preview"
      @download="download"
    /> -->
    <preview-dialog
      :visible.sync="previewDialogVisible"
      :previewObj.sync="previewObj"
    />
    <viewer :imgUrls.sync="viewerUrls" />
  </el-dialog>
</template>

<script>
import { common } from '@/api'
import Descriptions from '@/components/Descriptions'
import FileList from '@/components/FileList'
import PreviewDialog from '@/components/PreviewDialog'
import Viewer from '@/components/Viewer'
const filesOptions = []
export default {
  components: {
    Descriptions,
    FileList,
    PreviewDialog,
    Viewer
  },
  props: {
    // 弹框标题
    title: {
      type: String,
      default: '下载申请详情'
    },
    // 控制弹框显隐
    visible: {
      type: Boolean,
      default: false
    },
    // 文本信息
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    'info.downlist': {
      handler(newVal, oldVal) {
        // alert()
        if (newVal && newVal.length > 0)
          newVal.forEach(item => {
            filesOptions.push(item.downid)
          })
      },
      deep: true, //true 深度监听
      immediate: true
    }
  },
  computed: {
    isDisabled() {
      if (this.checkedFiles.length < 1) return true
      return false
    }
  },
  data() {
    return {
      descriptionsTitle: '申请文本信息',
      styleObj: {
        // 文件列表样式
        'background-color': '#fafafa',
        border: '1px solid #EBEEF5'
      },
      checkAll: false,
      checkedFiles: [],
      files: filesOptions,
      isIndeterminate: false,
      viewerUrls: [],
      previewDialogVisible: false,
      previewObj: {
        type: '',
        url: '',
        appendToBody: true
      }
    }
  },
  mounted() {},
  methods: {
    handleClose() {
      this.checkAll = false
      this.isIndeterminate = false
      this.checkedFiles = []
      this.$emit('update:visible', false)
      this.$emit('update:info', {})
    },
    handleCheckAllChange(val) {
      this.checkedFiles = val ? filesOptions : []
      this.isIndeterminate = false
    },
    handleCheckedFilesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.files.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.files.length
    },
    // 获取流文件名
    getBlobFileName(response) {
      // 需要响应设置此header暴露给外部，才能获取到
      let fileName = ''
      let contentDisposition = response.headers['content-disposition']
      if (contentDisposition) {
        // 正则获取filename的值
        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        let matches = filenameRegex.exec(contentDisposition)
        if (matches != null && matches[1]) {
          fileName = matches[1].replace(/['"]/g, '')
        }
        // 通过 URLEncoder.encode(pFileName, StandardCharsets.UTF_8.name()) 加密编码的, 使用decodeURI(fileName) 解密
        return (fileName = decodeURI(fileName))
        // 通过 new String(pFileName.getBytes(), StandardCharsets.ISO_8859_1) 加密编码的, 使用decodeURI(escape(fileName)) 解密
        // fileName = decodeURI(escape(fileName))
      }
    },
    async confirmDownload() {
      if (this.checkedFiles.length <= 0) {
        return
      }
      common
        .downloadComplexFiles(
          {
            downids: this.checkedFiles.join(',')
          },
          {
            responseType: 'blob'
          }
        )
        .then(res => {
          if (res.type === 'text/json') {
            this.$message.error('下载失败!')
            return
          }
          const fileName = this.getBlobFileName(res)
          let blob = new Blob([res.data])
          let downloadElement = document.createElement('a')
          let href = window.URL.createObjectURL(blob) //创建下载的链接
          downloadElement.download = fileName //下载后文件名
          downloadElement.href = href
          document.body.appendChild(downloadElement)
          downloadElement.click() //点击下载
          document.body.removeChild(downloadElement) //下载完成移除元素
          window.URL.revokeObjectURL(href) //释放掉blob对象
        })
    },
    // 预览
    preview(file) {
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
                url: href,
                appendToBody: true
              }
            }
          }
        })
    },
    download(downid) {
      common
        .downloadSingleFiles(
          {
            downid
          },
          {
            responseType: 'blob'
          }
        )
        .then(res => {
          const fileName = res.headers['content-disposition'].split('=')[1]
          let blob = new Blob([res.data])
          let downloadElement = document.createElement('a')
          let href = window.URL.createObjectURL(blob) //创建下载的链接
          downloadElement.download = fileName //下载后文件名
          downloadElement.href = href
          document.body.appendChild(downloadElement)
          downloadElement.click() //点击下载
          document.body.removeChild(downloadElement) //下载完成移除元素
          window.URL.revokeObjectURL(href) //释放掉blob对象
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-title {
  height: 40px;
  line-height: 40px;
  font-weight: bold;
}
.list-container {
  width: 100%;
}
.list {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:nth-of-type(even) {
    background-color: #ebeef5;
  }
}
.info-box {
  flex: 1;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
.button-box {
  flex: none;
  width: 80px;
  text-align: center;
}
.check-button {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
/deep/ .el-list-enter-active,
/deep/ .el-list-leave-active {
  transition: none;
}

/deep/ .el-list-enter,
/deep/ .el-list-leave-active {
  opacity: 0;
}
/deep/ .el-upload-list {
  max-width: 470px;
  overflow-y: auto;
}
</style>
