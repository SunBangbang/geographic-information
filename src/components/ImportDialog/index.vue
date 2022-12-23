<template>
  <el-dialog
    title="事故信息批量导入"
    :visible.sync="dialogImportVisible"
    :before-close="closeImportDialog"
  >
    <el-upload
      class="upload-demo"
      ref="upload"
      action=""
      accept=".xls,.xlsx"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      :auto-upload="false"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="submitUpload"
        >上传到服务器</el-button
      >
      <div slot="tip" class="el-upload__tip">
        只能上传excel文件，且不超过500kb
      </div>
    </el-upload>
  </el-dialog>
</template>

<script>
import { accidentInput } from '../../api'
export default {
  name: 'import-dialog',
  props: {
    // 控制显隐
    dialogImportVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      files:'',
      fileList: [
      ]
    }
  },
  methods: {
    // 导入弹框关闭
    closeImportDialog() {
      
      this.$emit('dialogImportHide')
    },
    // 上传服务器
    submitUpload() {
      // this.$emit('importComplete', this.fileList)
      const fileFormData = new FormData()
      console.log(this.files)
      fileFormData.append('excel', this.files.raw)
      console.dir(fileFormData)
      accidentInput.batchIntoInfo(fileFormData).then((res) => {
        this.$message({
          message: '导入成功',
          type: 'success'
        })
        this.files = ''
        this.fileList =[]
        this.$emit('dialogImportHide')
      })
    },
    // 文件上传触发
    handleChange(file, fileList) {
      this.files = file
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },
    // 移除
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    // 预览
    handlePreview(file) {
      console.log(file)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-dialog {
  width: 450px;
  height: 200px;
}
/deep/.el-dialog__headerbtn {
  top: 15px;
}
/deep/.el-dialog__header {
  padding: 13px 0 13px 20px;
}
/deep/.el-dialog__title {
  font-size: 16px;
  color: #2a8df0;
}
/deep/.el-dialog__body {
  padding: 0 20px;
}
</style>
