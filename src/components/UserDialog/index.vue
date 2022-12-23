<template>
  <el-dialog
    title=""
    :visible.sync="dialogUserVisible"
    :before-close="closeUserDialog"
    class="dialogForm1"
  >
    <div>
      <p class="user-title">{{ Ptitle }}用户：</p>
      <el-form :model="form" label-width="80px" ref="ruleForm" :rules="rules">
        <div class="container top-container">
          <div class="info-box">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="form.realName"></el-input>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-input v-model="form.age"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender" placeholder="请选择性别">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in genderOptions"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="roleidlist">
              <el-select v-model="form.roleidlist" placeholder="请选择角色">
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="item in roleOptions"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份选择" prop="identtype">
              <el-select v-model="form.identtype" placeholder="请选择身份">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in identityOptions"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="upload-avatar">
            <el-upload
              class="avatar-uploader"
              action="string"
              :show-file-list="false"
              :http-request="uploadImg"
              :on-success="handleAvatarSuccess"
              :on-change="imgChange"
              :before-upload="beforeAvatarUpload"
              :on-remove="handleRemoveImg"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>
        <div class="container middle-container">
          <el-form-item label="联系电话" class="row_2" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="身份证" class="row_2" prop="icard">
            <el-input v-model="form.icard"></el-input>
          </el-form-item>
          <el-form-item label="住址" class="row_4">
            <el-input v-model="form.addr"></el-input>
          </el-form-item>
          <el-form-item label="账号" class="row_4" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" class="row_4" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" class="row_4" prop="pwsd">
            <el-input v-model="form.pwsd" type="password"></el-input>
          </el-form-item>
        </div>
        <div class="container">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="string"
            :on-preview="handlePreview"
            :on-remove="handleRemoveFile"
            :file-list="fileList"
            :auto-upload="false"
            multiple="multiple"
            :http-request="uploadFile"
            :on-change="handleChange"
            :before-upload="beforeFileUpload"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传xls文件，且不超过2Mb
            </div>
          </el-upload>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeUserDialog">取 消</el-button>
      <el-button type="primary" @click="confirmUserDialog('ruleForm')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { userInfo } from '../../api'
import upload from '../../utils/upload'
import { reg, baseRegConst } from '../../utils/regular'
export default {
  name: 'details-dialog',
  props: {
    // 是否可以进行审核、退回操作
    controVisible: {
      type: Boolean,
      default: false
    },
    // 弹框显隐
    dialogUserVisible: {
      type: Boolean,
      default: false
    },
    // 编辑数据
    dialogUserInfo: {
      type: Object,
      default: null
    }
  },
  created() {
    this.getBOXList()
    console.log(this.dialogUserInfo)
    if (this.dialogUserInfo && this.dialogUserInfo.id) {
      this.Ptitle = '编辑'
      userInfo.getUserDetail({ id: this.dialogUserInfo.id }).then((res) => {
        //文件回显
        if (res.res.res.files != null) {
          res.res.res.files.map((item) => {
            item.url = upload.uploadUrl + item.url
          })
          this.fileList = res.res.res.files
        }
        //图片回显
        if (res.res.res.img != null) {
          this.imageUrl =upload.uploadUrl + res.res.res.img.url
          console.log(this.imageUrl);
        }

        this.form = res.res.res
        delete this.form['pwsd']
        this.form.roleidlist = Number(this.form.roleidlist)
        console.log(this.form)
      })
    } else {
      this.Ptitle = '新增'
      this.form = {
        realName: '', //姓名
        age: '', //年龄
        gender: '', //性别
        roleidlist: '', //权限编码
        identtype: '', //身份
        phone: '', //电话
        icard: '', //身份证号码
        addr: '', //地址
        name: '', //账号
        pwsd: '' //密码
      }
    }
  },

  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      Ptitle: '',
      fileList: [],
      delFile: [], //存放删除文件的数组
      delImg: '', //删除图片
      imgs: '',
      imageUrl: '',
      pictureType: ['image/jpeg', 'image/jpg', 'image/png'],
      roleOptions: [],
      identityOptions: [
        {
          value: 1,
          label: '自然人'
        },
        {
          value: 2,
          label: '法人'
        }
      ],
      genderOptions: [
        {
          value: 0,
          label: '女'
        },
        {
          value: 1,
          label: '男'
        }
      ],
      form: {
        realName: '', //姓名
        age: '', //年龄
        gender: '', //性别
        roleidlist: '', //权限编码
        identtype: '', //身份
        phone: '', //电话
        icard: '', //身份证号码
        addr: '', //地址
        name: '', //账号
        pwsd: '' //密码
      },
      rules: {
        realName: [{ required: true, message: '请填写姓名', trigger: 'blur' }],
        name: [{ required: true, message: '请填写账号', trigger: 'blur' }],
        age: [
          { required: true, message: '请填写年龄', trigger: 'blur' },
          {
            validator: reg(baseRegConst.ageNumber, '年龄不能超过120'),
            trigger: 'blur'
          }
        ],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        roleidlist: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        identtype: [
          { required: true, message: '请选择身份', trigger: 'change' }
        ],
        phone: [
          { required: false, message: '请输入联系电话', trigger: 'blur' },
          {
            validator: reg(baseRegConst.phoneNum, '联系电话格式不正确')
          }
        ],
        icard: [
          { required: false, message: '请输入身份证号码', trigger: 'blur' },
          {
            validator: reg(baseRegConst.idCard, '身份证号码格式不正确')
          }
        ],
        password: [
          { required: false, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ],
        pwsd: [
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          },
          { validator: validatePass2, trigger: 'blur', required: false }
        ]
      }
    }
  },
  methods: {
    //表单提交
    confirmUserDialog(formName) {
      let userFormData = new FormData()
      if (this.fileList.length != 0) {
        this.fileList.forEach((el) => {
          if (!el.id) {
            userFormData.append('files', el.raw)
          }
        })
      }
      if (this.imgs != null) {
        if (!this.imgs.id) {
          userFormData.append('img', this.imgs)
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            delete this.form['img']
            delete this.form['files']
            userFormData.append('ids', this.delFile.toString())
            userFormData.append('userinfo', JSON.stringify(this.form))
            userInfo
              .addUserInfo(userFormData)
              .then((res) => {
                if (res.status == 100) {
                  this.$message({
                    type: 'success',
                    offset: 350,
                    message: '编辑成功'
                  })
                  this.$emit('dialogUserHide')
                }
              })
              .catch((err) => {
                console.dir(err)
              })
          } else {
            console.log(this.form)
            delete this.form['password']
            userFormData.append('userinfo', JSON.stringify(this.form))
            userInfo
              .addUserInfo(userFormData)
              .then((res) => {
                if (res.status == 100) {
                  this.$message({
                    type: 'success',
                    offset: 350,
                    message: '新增成功'
                  })
                  this.$emit('dialogUserHide')
                }
              })
              .catch((err) => {
                console.dir(err)
              })
          }
        } else {
          return false
        }
      })
    },
    //获取角色下拉列表
    getBOXList() {
      userInfo.getBoxList().then((res) => {
        if (res.status == 200) {
          this.roleOptions = res.res.res
        } else {
          this.roleOptions = []
        }
      })
    },
    handleRemoveFile(file, fileList) {
      if (file.id) {
        this.delFile.push(file.id)
      }
      console.log(file, fileList)
    },
    handleRemoveImg(file) {
      if (file.id) {
        this.delImg = file.id
      }
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    onSubmit() {
      console.log('submit!')
    },
    closeUserDialog() {
      // this.imageUrl = ''
      this.$emit('dialogUserHide')
    },
    uploadFile(file) {
      console.log(file)
      // this.formData.append('file', file.file)
    },
    uploadImg(file) {
      console.log(file)
      // this.formData.append('file', file.file)
    },
    imgChange(file) {
      console.log(file)
      this.imgs = file.raw
      console.log(this.imgs)
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    handleChange(file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    handleAvatarSuccess(res, file) {
      console.log(file)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    beforeFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message({
          type: 'error',
          message: '上传文件大小不能超过2Mb',
          offset: 350
        })
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  width: 615px;
}

/deep/ .el-dialog__header {
  display: none;
}

/deep/ .el-dialog__body {
  padding: 25px 35px;
  padding-bottom: 0;
}

.user-title {
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #dcdcdc;
  color: #2a8df0;
}

.top-container {
  display: flex;
}

.middle-container {
  display: flex;
  flex-wrap: wrap;
}
.row_2 {
  width: 50%;
}

.row_4 {
  width: 100%;
}

.upload-avatar {
  width: 295px;
  height: 288px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style>
