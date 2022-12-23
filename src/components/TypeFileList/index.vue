<template>
  <div class="list-container" :style="styleObj">
    <div v-for="(item, index) in listData" :key="index" class="list-block">
      <div class="type-name">{{ item.name }}</div>
      <div class="file-box">
        <template v-for="(item1, index1) in item.children">
          <div class="file-list" :key="index1">
            <div class="info-box">
              <span class="name">{{ item1.docname }}</span
              ><span class="size">{{ item1.docsize | formatbytes }}</span>
            </div>
            <div class="button-box">
              <el-button type="text" @click="preview(item1)">预览</el-button>
              <el-button
                type="text"
                @click="download(item1.docsource)"
                v-if="Number(userInfo.roleid) !== 3"
                >下载</el-button
              >
            </div>
          </div>
        </template>
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
import { common } from '@/api'
import { mapGetters } from 'vuex'
import PreviewDialog from '@/components/PreviewDialog'
import Viewer from '@/components/Viewer'
export default {
  components: {
    PreviewDialog,
    Viewer
  },
  props: {
    styleObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    listData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      viewerUrls: [],
      previewDialogVisible: false,
      previewObj: {
        type: '',
        url: '',
        appendToBody: true
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
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
    // 下载
    download(docurl) {
      common
        .downloadSingleFiles(
          {
            docurl
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
      // this.$emit('download', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.list-container {
  width: 100%;
}
.list-block {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ebeef5;
  &:last-child {
    border-bottom: none;
  }
  .file-box {
    flex: 1;
    //   display: flex;
  }
  .type-name {
    flex: none;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #ebeef5;
  }
  .file-list {
    flex: 1;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:nth-of-type(even) {
      background-color: #ebeef5;
    }
    .info-box {
      flex: 1;
      padding-left: 5px;
      display: flex;
      justify-content: space-between;
    }
    .button-box {
      flex: none;
      width: 100px;
      text-align: center;
    }
  }
}
</style>
