<template>
  <el-dialog
    :title="title"
    :visible="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="750px"
    class="form-box"
    @close="handleClose"
  >
    <el-form :model="form" ref="addForm">
      <div class="form-div" v-for="(item, index) in tableHeaders" :key="index">
        <el-form-item
          :prop="item.prop"
          :label="item.label"
          class="form-label"
          v-if="item.type == 2"
          :rules="{
            required: true,
            message: '请选择' + item.label,
            trigger: 'change'
          }"
        >
          <el-select
            v-model="form[item.prop]"
            placeholder="请选择港口类型"
            size="mini"
          >
            <el-option label="沿江" value="沿江"></el-option>
            <el-option label="沿海" value="沿海"></el-option>
            <el-option label="内河" value="内河"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-else
          :prop="item.prop"
          :label="item.label"
          class="form-label"
          :rules="{
            required: true,
            message: '请输入' + item.label,
            trigger: 'blur'
          }"
        >
          <el-input
            v-model="form[item.prop]"
            autocomplete="off"
            class="form-input"
            @input="change($event)"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="dialog-upload" v-if="this.title == '编辑数据'">
      <el-upload
        class="upload-demo"
        accept=".png,.jpg"
        :action="uploadUrl"
        :on-success="uploadchange"
        :data="{ id: uploadId }"
        :file-list="fileList"
      >
        <el-button
          type="primary"
          size="mini"
          @click="uploadingBtn"
          >上传图片</el-button
        >
      </el-upload>
      <el-upload
        class="upload-demo"
        accept=".pdf"
        :action="uploadUrlPDF"
        :on-success="uploadchangePDF"
        :data="{ id: uploadIdPDF }"
        :file-list="fileListPDF"
      >
        <el-button
          type="primary"
          size="mini"
          @click="uploadingBtnPDF"
          v-if="this.rightvalue == 'BasePortplanning'"
          >上传PDF</el-button
        >
      </el-upload>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitAdd('addForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { city, role, gender } from '@/assets/js/localData.js'
import { regExp } from '@/utils/regExp.js'
import { dataManagement, common } from '@/api'
import { encryption, copy } from '@/utils/utils'
export default {
  props: {
    tableHeaders: {
      type: Array,
      default: []
    },
    rightvalue: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    rowdata: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 弹框标题
    title: {
      // tilte = dialogTitle
      type: String,
      default: ''
    },
    // 控制弹框显隐
    visible: {
      //visible = dialogVisible
      type: Boolean,
      default: false
    },
    editForm: {
      // editForm = detailFrom
      type: Object,
      default: () => {
        return {}
      }
    },
    // 新增还是编辑
    isaddUpdate: {
      type: Boolean
    }
  },
  watch: {
    editForm(val) {
      Object.assign(this.form, val)
      // if (this.form.imgurl) this.download(this.form.imgurl)
      // if (this.form.id) this.isAdd = false
      // else this.isAdd = true
    }
  },

  created() {
    this.tableHeaders.forEach((item) => {
      if (this.title == '编辑数据') {
        this.form[item.prop] = this.rowdata[item.prop]
        // this.form[item.prop] = JSON.parse(JSON.stringify(this.rowdata[item.prop]))
      } else {
        // this.form[item.prop] = ''
      }
    })
  },

  mounted() {
    // let _self=this;
    // console.log(this.tableHeaders)
    // for(i=1;i<this.tableHeaders;i++)
    // }
  },

  data() {
    return {
      // tableHeaders:[],
      form: {},
      rules: {
        // prop: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
      },
      uploadId:'',
      uploadUrl:'',
      fileList:[],
      uploadIdPDF:'',
      uploadUrlPDF:'',
      fileListPDF:[],
    }
  },

  // change(){
  //   this.$forceUpdate();
  // },

  methods: {
    change(e) {
      this.$forceUpdate()
    },
    // 上传图片
    uploadingBtn(){
      this.uploadId = this.rowdata.objectid
      if(this.rightvalue == 'BaseAnchorage' || "锚地基本信息"){
        this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseAnchorage/attached'
      }else if(this.rightvalue == 'BaseBerth'){
        this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseBerth/attached'
      }else if(this.rightvalue == 'BaseBridge'){
        this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseBridge/attached'
      }else if(this.rightvalue == 'BaseCabinwashing'){
        this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseCabinwashing/attached'
      }else if(this.rightvalue == 'BaseChannel'){
        this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseChannel/attached'
      }else if(this.rightvalue == 'BasePortplanning'){
        this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BasePortplanning/attached'
      }else if(this.rightvalue == 'BaseShiplock'){
        this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseShiplock/attached'
      }else if(this.rightvalue == 'tBaseShoreline'){
        this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/tBaseShoreline/attached'
      }else if(this.rightvalue == 'BaseWaterservice'){
        this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseWaterservice/attached'
      }else if(this.rightvalue == 'BaseWorkarea'){
        this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseWorkarea/attached'
      }
    },
    // 上传的回调
    uploadchange(file){
      if(file.code == 200){
        this.$message.success('上传成功!')
      }else{
        this.$message.error('上传失败!')
      }
    },
    // 上传PDF
    uploadingBtnPDF(){
      this.uploadIdPDF = this.rowdata.objectid
      if(this.rightvalue == 'BasePortplanning'){
        this.uploadUrlPDF = 'http://192.168.2.63:8082/PSGIS/BasePortplanning/attached-pdf'
      }
    },
    // 上传PDF的回调
    uploadchangePDF(file){
      if(file.code == 200){
        this.$message.success('上传成功!')
      }else{
        this.$message.error('上传失败!')
      }
    },
    // 点击确定提交表单
    submitAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 新增
          if (
            (this.rightvalue == 'BaseAnchorage' && this.isaddUpdate) ||
            (this.rightvalue == '锚地基本信息' && this.isaddUpdate)
          ) {
            // 锚地
            this.BaseAnChorageetAdd()
          } else if (this.rightvalue == 'BaseBerth' && this.isaddUpdate) {
            // 码头
            this.BaseBerthAdd()
          } else if (this.rightvalue == 'BaseBridge' && this.isaddUpdate) {
            // 桥梁
            this.BaseBridgeAdd()
          } else if (
            this.rightvalue == 'BaseCabinwashing' &&
            this.isaddUpdate
          ) {
            // 洗舱站
            this.BaseCabinwashingAdd()
          } else if (this.rightvalue == 'BaseChannel' && this.isaddUpdate) {
            // 航道
            this.BaseChannelAdd()
          } else if (
            this.rightvalue == 'BasePortplanning' &&
            this.isaddUpdate
          ) {
            // 基本设施-港口规划-作业区
            this.BasePortplanningAdd()
          } else if (this.rightvalue == 'BaseShiplock' && this.isaddUpdate) {
            // 船闸
            this.BaseShiplockAdd()
          } else if (this.rightvalue == 'tBaseShoreline' && this.isaddUpdate) {
            // 基本设施-港口规划-岸线
            this.tBaseShorelineAdd()
          } else if (
            this.rightvalue == 'BaseWaterservice' &&
            this.isaddUpdate
          ) {
            // 水上服务区
            this.BaseWaterserviceAdd()
          } else if (this.rightvalue == 'BaseWorkarea' && this.isaddUpdate) {
            // 作业区
            this.BaseWorkareaAdd()
          }

          // 编辑
          if (
            (this.rightvalue == 'BaseAnchorage' && this.isaddUpdate == false) ||
            (this.rightvalue == '锚地基本信息' && this.isaddUpdate == false)
          ) {
            // 锚地
            this.BaseAnChorageetUpdate()
          } else if (
            this.rightvalue == 'BaseBerth' &&
            this.isaddUpdate == false
          ) {
            // 码头
            this.BaseBerthUpdate()
          } else if (
            this.rightvalue == 'BaseBridge' &&
            this.isaddUpdate == false
          ) {
            // 桥梁
            this.BaseBridgeUpdate()
          } else if (
            this.rightvalue == 'BaseCabinwashing' &&
            this.isaddUpdate == false
          ) {
            // 洗舱站
            this.BaseCabinwashingUpdate()
          } else if (
            this.rightvalue == 'BaseChannel' &&
            this.isaddUpdate == false
          ) {
            // 航道
            this.BaseChannelUpdate()
          } else if (
            this.rightvalue == 'BasePortplanning' &&
            this.isaddUpdate == false
          ) {
            // 基本设施-港口规划-作业区
            this.BasePortplanningUpdate()
          } else if (
            this.rightvalue == 'BaseShiplock' &&
            this.isaddUpdate == false
          ) {
            // 船闸
            this.BaseShiplockUpdate()
          } else if (
            this.rightvalue == 'tBaseShoreline' &&
            this.isaddUpdate == false
          ) {
            // 基本设施-港口规划-岸线
            this.tBaseShorelineUpdate()
          } else if (
            this.rightvalue == 'BaseWaterservice' &&
            this.isaddUpdate == false
          ) {
            // 水上服务区
            this.BaseWaterserviceUpdate()
          } else if (
            this.rightvalue == 'BaseWorkarea' &&
            this.isaddUpdate == false
          ) {
            // 作业区
            this.BaseWorkareaUpdate()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 新增
    // 锚地
    async BaseAnChorageetAdd() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseAnChorageetAdd(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseAnchorage()
      } else this.$message.error('新增失败!')
    },
    // 码头
    async BaseBerthAdd() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseBerthAdd(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseBerth()
      } else this.$message.error('新增失败!')
    },
    // 桥梁
    async BaseBridgeAdd() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseBridgeAdd(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseBridge()
      } else this.$message.error('新增失败!')
    },
    // 洗舱站
    async BaseCabinwashingAdd() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseCabinwashingAdd(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseCabinwashing()
      } else this.$message.error('新增失败!')
    },
    // 航道
    async BaseChannelAdd() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseChannelAdd(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseChannel()
      } else this.$message.error('新增失败!')
    },
    // 基本设施-港口规划-作业区
    async BasePortplanningAdd() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BasePortplanningAdd(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBasePortplanning()
      } else this.$message.error('新增失败!')
    },
    // 船闸
    async BaseShiplockAdd() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseShiplockAdd(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseShiplock()
      } else this.$message.error('新增失败!')
    },
    // 基本设施-港口规划-岸线
    async tBaseShorelineAdd() {
      let finalForm = copy(this.form)
      var result = await dataManagement.tBaseShorelineAdd(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.gettBaseShoreline()
      } else this.$message.error('新增失败!')
    },
    // 水上服务区
    async BaseWaterserviceAdd() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseWaterserviceAdd(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseWaterservice()
      } else this.$message.error('新增失败!')
    },
    // 作业区
    async BaseWorkareaAdd() {
      console.log(111)
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseWorkareaAdd(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseWorkarea()
      } else this.$message.error('新增失败!')
    },

    // 编辑
    // 锚地
    async BaseAnChorageetUpdate() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseAnChorageetUpdate(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseAnchorage()
        console.log(1111)
      } else this.$message.error('编辑失败!')
    },
    // 码头
    async BaseBerthUpdate() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseBerthUpdate(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseBerth()
      } else this.$message.error('编辑失败!')
    },
    // 桥梁
    async BaseBridgeUpdate() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseBridgeUpdate(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseBridge()
      } else this.$message.error('编辑失败!')
    },
    // 洗舱站
    async BaseCabinwashingUpdate() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseCabinwashingUpdate(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseCabinwashing()
      } else this.$message.error('编辑失败!')
    },
    // 航道
    async BaseChannelUpdate() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseChannelUpdate(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseChannel()
      } else this.$message.error('编辑失败!')
    },
    // 基本设施-港口规划-作业区
    async BasePortplanningUpdate() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BasePortplanningUpdate(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBasePortplanning()
      } else this.$message.error('编辑失败!')
    },
    // 船闸
    async BaseShiplockUpdate() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseShiplockUpdate(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseShiplock()
      } else this.$message.error('编辑失败!')
    },
    // 基本设施-港口规划-岸线
    async tBaseShorelineUpdate() {
      let finalForm = copy(this.form)
      var result = await dataManagement.tBaseShorelineUpdate(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.gettBaseShoreline()
      } else this.$message.error('编辑失败!')
    },
    // 水上服务区
    async BaseWaterserviceUpdate() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseWaterserviceUpdate(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseWaterservice()
      } else this.$message.error('编辑失败!')
    },
    // 作业区
    async BaseWorkareaUpdate() {
      let finalForm = copy(this.form)
      var result = await dataManagement.BaseWorkareaUpdate(finalForm)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
        this.$parent.getBaseWorkarea()
      } else this.$message.error('编辑失败!')
    },

    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('update:editForm', {})
    },

    addbtn() {
      console.log(this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
}

.el-form-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.form-div {
  width: 50%;
  > div {
    width: 100%;
  }
}
.dialog-upload {
  padding-left: 75px;
  display: flex;
}
.upload-demo{
  padding:0;
  height: 40px;
  width: 100px;
  /deep/.el-upload-list{
    height:0px !important;
  }
}
// .form-box{
//   height: 800px;
//   overflow-y: auto;
//   box-sizing: border-box;
// }
// .form {
//   // display: flex;

// }
// .form-label {
//   display: flex;
// }
// .form-input{
//   display: flex;
// }
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
.upload-form-item {
  display: flex;
  > span {
    flex: none;
    padding-right: 12px;
    text-align: right;
  }
}
/deep/.el-form {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
/deep/.el-form-item {
  width: 49%;
}
.addr-form-item {
  width: 100%;
}
</style>
