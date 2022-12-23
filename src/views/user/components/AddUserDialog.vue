<template>
  <el-dialog
    :title="title"
    :visible="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="750px"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="userForm">
      <!-- <el-form-item label="身份证号" prop="icard" :label-width="formLabelWidth">
        <el-input v-model="form.icard" autocomplete="off"></el-input>
      </el-form-item> -->
      <el-form-item
        label="注册账号"
        prop="name"
        :label-width="formLabelWidth"
        class="is-required"
      >
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="用户类别"
        prop="roleid"
        :label-width="formLabelWidth"
        class="select-form-item"
      >
        <el-select v-model="form.roleid" placeholder="请选择用户角色">
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="注册密码"
        prop="pwsd"
        :label-width="formLabelWidth"
        :class="{ 'is-required': isAdd }"
      >
        <el-input
          type="password"
          v-model="form.pwsd"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="pwsd2"
        :label-width="formLabelWidth"
        :class="{ 'is-required': isAdd }"
      >
        <el-input
          type="password"
          v-model="form.pwsd2"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="用户单位"
        prop="company"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.company" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="负责人"
        prop="realname"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.realname" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="用户性别"
        prop="gender"
        :label-width="formLabelWidth"
        class="select-form-item"
      >
        <el-select v-model="form.gender" placeholder="请选择性别">
          <el-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="所属部门"
        prop="department"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.department" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone" :label-width="formLabelWidth">
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="所在城市"
        prop="city"
        :label-width="formLabelWidth"
        class="select-form-item"
        v-if="Number(this.form.roleid) === 2"
      >
        <el-select v-model="form.city" placeholder="请选择所在城市">
          <el-option
            v-for="item in cityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="单位地址"
        prop="addr"
        :label-width="formLabelWidth"
        class="addr-form-item"
      >
        <el-input v-model="form.addr" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div class="upload-form-item">
      <span :style="{ width: formLabelWidth }">用户头像</span>
      <el-upload
        class="avatar-uploader"
        action=""
        :show-file-list="false"
        :auto-upload="false"
        :on-change="uploadChange"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <i
          v-if="imageUrl && isAdd"
          class="el-icon-error delete-avatar"
          @click.stop="deleteAvatar"
        ></i>
      </el-upload>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitUserInfo('userForm')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { city, role, gender } from '@/assets/js/localData.js'
import { regExp } from '@/utils/regExp.js'
import { userManage, common } from '@/api'
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
    editForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    editForm(val) {
      console.log(val);
      Object.assign(this.form, val)
      if (this.form.imgurl) this.download(this.form.imgurl)
      if (this.form.id) this.isAdd = false
      else this.isAdd = true
    }
  },
  data() {
    // 注册账号
    const checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('注册账号不能为空'))
      }
      if (!regExp.account.test(value)) {
        callback(new Error('请输入4~16位数字、英文'))
      } else {
        callback()
      }
    }
    // 注册密码
    const checkPassword = (rule, value, callback) => {
      if (this.isAdd) {
        if (!value) {
          return callback(new Error('注册密码不能为空'))
        }
        if (!regExp.account.test(value)) {
          callback(new Error('请输入4~16位数字、英文'))
        } else {
          callback()
        }
      } else {
        if (value && !regExp.account.test(value)) {
          callback(new Error('请输入4~16位数字、英文'))
        } else {
          callback()
        }
      }
    }
    // 联系电话(手机、固话)
    const checkPhone = (rule, value, callback) => {
      if (value) {
        if (!regExp.phone.test(value) && !regExp.telephone.test(value))
          return callback(new Error('请输入正确的固话(区号-固话)或手机格式'))
        else callback()
      } else callback()
    }
    // 确认密码
    const confirmPassword = (rule, value, callback) => {
      if (this.isAdd) {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.pwsd) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      } else {
        if (this.form.pwsd && value !== this.form.pwsd) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
    }
    // 身份证
    const checkIDCard = (rule, value, callback) => {
      if (value) {
        if (!regExp.idCard.test(value))
          return callback(new Error('请输入正确的身份证号'))
        else callback()
      } else callback()
    }
    // 邮箱
    const checkEmail = (rule, value, callback) => {
      if (value) {
        if (!regExp.email.test(value))
          return callback(new Error('请输入正确的邮箱'))
        else callback()
      } else callback()
    }
    return {
      uploadUrl: process.env.VUE_APP_BASE_API,
      imageUrl: '',
      imageFile: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      isAdd: true,
      form: {
        realname: '',
        gender: '',
        department: '',
        // liable: '',
        // icard: '',
        name: '',
        pwsd: '',
        pwsd2: '',
        roleid: '',
        phone: '',
        email: '',
        city: '',
        company: '',
        addr: ''
      },
      rules: {
        realname: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入用户单位', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入所属部门', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择用户性别', trigger: 'change' }
        ],
        icard: [{ validator: checkIDCard, trigger: 'blur' }],
        name: [{ validator: checkAccount, trigger: 'blur' }],
        pwsd: [{ validator: checkPassword, trigger: 'blur' }],
        pwsd2: [{ validator: confirmPassword, trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        roleid: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ],
        city: [
          { required: true, message: '请选择所在城市', trigger: 'change' }
        ],
        phone: [{ validator: checkPhone, trigger: 'blur' }]
      },
      roleOptions: role,
      cityOptions: city,
      genderOptions: gender,
      formLabelWidth: '100px'
    }
  },
  methods: {
    
    // 提交表单
    submitUserInfo(formName) {
      console.log(formName)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addOrEditUser()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async addOrEditUser() {
      const publicKey = await this.$store.dispatch('user/getPublicKey')
      let formData = new FormData()
      let finalForm = copy(this.form)
      if(Number(finalForm.roleid) === 1) finalForm.city = ''
      const encryptionField = ['name', 'pwsd']
      for (let i in finalForm) {
        if (
          encryptionField.includes(i) &&
          !regExp.emptyStr.test(finalForm[i])
        ) {
          finalForm[i] = encryption(finalForm[i], publicKey)
        }
      }
      delete finalForm.pwsd2
      formData.append('userinfo', JSON.stringify(finalForm))
      if (this.imageFile) {
        formData.append('img', this.imageFile)
      }
      const result = await userManage.addOrEditUser(formData)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
      } else this.$message.error('操作失败!')
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 上传照片
    uploadChange(file, fileList) {
      const format = ['image/jpeg', 'image/jpg', 'image/png']
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!format.includes(file.raw.type)) {
        this.$message.error('上传头像图片只能是 JPG/JPEG/PNG 格式!')
        return
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return
      }
      this.imageFile = file.raw
      // 预览用
      this.getBase64(file.raw).then(res => {
        this.imageUrl = res
      })
    },
    // 图片转换base64
    getBase64(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = () => {
          imgResult = reader.result
        }
        reader.onerror = error => {
          reject(error)
        }
        reader.onloadend = () => {
          resolve(imgResult)
        }
      })
    },
    // 删除照片
    deleteAvatar() {
      this.imageUrl = ''
      this.imageFile = null
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
          let blob = new Blob([res.data])
          this.imageUrl = window.URL.createObjectURL(blob)
        })
    },
    handleClose() {
      this.imageFile = null
      this.imageUrl = ''
      this.isAdd = true
      this.form = {
        realname: '',
        gender: '',
        department: '',
        // liable: '',
        // icard: '',
        name: '',
        pwsd: '',
        pwsd2: '',
        roleid: '',
        phone: '',
        email: '',
        city: '',
        company: '',
        addr: ''
      }
      this.resetForm('userForm')
      this.$emit('update:visible', false)
      this.$emit('update:editForm', {})
    }
  }
}
</script>

<style lang="scss" scoped>
.delete-avatar {
  color: #ff0000;
  position: absolute;
  top: 10px;
  right: 5px;
  &:hover {
    color: rgba(255, 0, 0, 0.7);
  }
}
.avatar-uploader /deep/.el-upload {
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
}
.select-form-item div {
  width: 100%;
}
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
