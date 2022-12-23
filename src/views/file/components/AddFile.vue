<template>
  <el-dialog
    :title="title"
    :visible="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="652px"
    @close="handleClose"
  >
    <div class="add-box">
      <span>上传到</span>
      <div>
        <el-select v-model="selectValue" placeholder="请选择行为规范" @change="selectBehavior">
          <el-option
            v-for="item in selectOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <el-button
        type="success"
        icon="el-icon-plus"
        size="small"
        plain
        @click="addFile"
        >新增文件</el-button
      >
    </div>
    <div class="file-box" v-show="showFileBox">
      <div
        v-for="(item, index) in fileBoxList"
        :key="item.id"
        :class="{ nothing: item.flag == true }"
      >
        <div class="file-box-header">
          <span>选择文件</span>
          <el-input
            name="aboutText"
            v-model="item.fileName"
            autocomplete="on"
            placeholder=""
            disabled
          ></el-input>
          <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :on-change="handleChange"
            :show-file-list="false"
            :auto-upload="false"
    
            :file-list="fileList"
          >
            <el-button
              class="upload-btn"
              icon="el-icon-folder-add"
              @click="addIndex(index)"
              size="small"
              type="primary"
              plain
              >浏览文件</el-button
            >
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
          <el-button
            size="small"
            icon="el-icon-delete"
            type="danger"
            plain
            @click="delIndex(index)"
            >删除</el-button
          >
        </div>
        <div class="file-box-bottom">
          <span>文件摘要</span>
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 3 }"
            v-model="item.text"
            maxlength="255"
          ></el-input>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitFile">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { city, role, gender } from '@/assets/js/localData.js'
import { regExp } from '@/utils/regExp.js'
import { userManage, common, file } from '@/api'
import { encryption, copy } from '@/utils/utils'
export default {
  props: {
    // 弹框标题
    title: {
      type: String,
      default: '新增用户'
    },
    // 控制弹框显隐
    visible: {
      type: Boolean,
      default: false
    },
    selectOptions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  created() {
    this.selectId = this.selectOptions[0].id
    this.selectValue = this.selectOptions[0].name

  },
 
  data() {
    
    return {
      
      isAdd: true,
      showFileBox: false,
      fileBoxList: [],
      fileIndex: null,
      selectValue:"",
      selectId:null,
      

      fileList: [],
      aboutText: '',
    }
  },
  methods: {
    // 提交表单

    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleClose() {
 
      this.$emit('update:visible', false)
 
    },
    handleChange(file) {
      console.log(file)
      let format = file.name.lastIndexOf(".");
      let lastName = file.name.substring(format, file.name.length);
      if (
        lastName.toLowerCase() !== ".pdf" &&
        lastName.toLowerCase() !== ".doc"&&
        lastName.toLowerCase() !== ".docx"&&
        lastName.toLowerCase() !== ".xls"&&
        lastName.toLowerCase() !== ".xlsx"&&
        lastName.toLowerCase() !== ".mp4"
      ){
        this.$message.error("文件必须为pdf,doc,docx,xls,xlsx,mp4类型");
        return false
      }
      this.fileBoxList[this.fileIndex].fileName = file.name
      this.fileBoxList[this.fileIndex].file = file.raw
      this.fileBoxList[this.fileIndex].format = lastName.toLowerCase()
      this.fileBoxList[this.fileIndex].size = (file.size / 1024 ).toFixed(2)
    },
    selectBehavior(row){
      this.selectId = row
      this.selectOptions.forEach(r=>{
        if(r.id == row){
          this.selectValue = r.name
        }
      })
    },
    addFile() {
      this.showFileBox = true
      let obj = {
        fileName: '',
        flag: false,
        text: ''
      }
      this.fileBoxList.push(obj)
    },
    addIndex(index) {
      this.fileIndex = index
    
    },
    delIndex(index) {
      this.fileBoxList.splice(index,1)
    },
    async submitFile() {
      
      if(this.fileBoxList.length === 0){
        this.$message({
          message: '操作有误，请添加文件',
          type: 'warning'
        })
        return false
      }

      let formData = new FormData()
      let submitFlag = true
      let emergencyfiles = []
     
      this.fileBoxList.forEach(r => {
        if (r.file) {
          formData.append('files', r.file)
          let obj = {
            name: r.fileName,
            type:this.selectId,
            typename:this.selectValue,
            description: r.text,
            keyword :r.format,
            size:r.size
          }
          emergencyfiles.push(obj)
          r.flag = false
        } else {
          r.flag = true
          submitFlag = false
        }
      })
      if (!submitFlag) {
        this.$message({
          message: '请将信息填写完整',
          type: 'warning'
        })
        return false
      }
      formData.append('emergencyfiles', JSON.stringify(emergencyfiles))

      console.log(formData)

      let { res, status } = await file.addFiles(formData)
      if(status === 200){
        this.$message.success('新增成功');
        this.$emit('submitResult', res)
        this.handleClose()
      }else{
        this.$message.error('新增失败');
      }
     
    }
    // if (fileList.length < 0) {
    //   this.$message.error('请上传所需文件')
    // }
    // if (fileList.length >= 2) {
    //   this.hideUploadAdd = true
    // }
  }
}
</script>

<style lang="scss" scoped>
.add-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    width: 70%;
    .el-select {
      width: 100%;
    }
  }
}
.file-box {
  width: 100%;
  max-height: 350px;
  margin-top: 10px;
  overflow-y: auto;
  > div {
    height: 164px;
    padding: 10px;
    background-color: #fafafa;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 10px;
    .file-box-header {
      display: flex;
      height: 36px;
      justify-content: space-between;
      align-items: center;
      .el-input {
        width: 50%;
      }
    }
    .file-box-bottom {
      display: flex;
      height: 90px;
      justify-content: space-between;
      align-items: flex-start;
      .el-textarea {
        width: 87.5%;
        height: 100%;
        /deep/ .el-textarea__inner {
          resize: none;
        }
      }
    }
  }
  .nothing {
    border: 1px solid red;
  }
}
// .delete-avatar {
//   color: #ff0000;
//   position: absolute;
//   top: 10px;
//   right: 5px;
//   &:hover {
//     color: rgba(255, 0, 0, 0.7);
//   }
// }
// .avatar-uploader /deep/.el-upload {
//   border: 1px dashed #d9d9d9;
//   border-radius: 6px;
//   cursor: pointer;
//   position: relative;
//   overflow: hidden;
// }
// .avatar-uploader .el-upload:hover {
//   border-color: #409eff;
// }
// .avatar-uploader-icon {
//   font-size: 28px;
//   color: #8c939d;
//   width: 178px;
//   height: 178px;
//   line-height: 178px;
//   text-align: center;
// }
// .avatar {
//   width: 178px;
//   height: 178px;
//   display: block;
// }
// .select-form-item div {
//   width: 100%;
// }
// .upload-form-item {
//   display: flex;
//   > span {
//     flex: none;
//     padding-right: 12px;
//     text-align: right;
//   }
// }
// /deep/.el-form {
//   display: flex;
//   justify-content: space-between;
//   flex-wrap: wrap;
// }
// /deep/.el-form-item {
//   width: 49%;
// }
// .addr-form-item {
//   width: 100%;
// }
</style>
