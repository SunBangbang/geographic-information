<template>
  <el-dialog
    :title="title"
    :visible="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="380px"
    @close="handleClose"
  >
    <el-form :model="typeBox" ref="typeBox" :rules="rules">
      <el-form-item prop="name" label="类型名称">
        <el-input v-model="typeBox.name" autocomplete="on" placeholder="">
        </el-input>
      </el-form-item>

      <el-form-item label="类型描述" prop="describe">
        <el-input v-model="typeBox.describe" autocomplete="on" placeholder="">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitType('typeBox')">确 定</el-button>
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
      default: '新增类型'
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
    },

    editForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created() {
    this.selectId = this.selectOptions[0].id
    this.selectValue = this.selectOptions[0].name
  },

  data() {
    var checkName = (rule, value, callback) => {
      if ((/[\u4e00-\u9fa5]/).test(value) == false) {
                callback(new Error('请输入中文'))
              } else {
                //校验通过
                callback()
              }
    }
    return {
      typeBox: {
        name: '',
        describe: ''
      },
      rules: {
        name: [
          {validator:checkName, trigger: 'blur' },
        ]
      },

      updateValue: '',

      isAdd: true,
      // showFileBox: false,
      fileBoxList: [],
      fileIndex: null,
      selectValue: '',
      selectId: null,

      fileList: [],
      aboutText: ''
    }
  },
  methods: {
    // 提交表单
    submitType(typeBox) {
      this.$refs[typeBox].validate((valid) => {
        if (valid) {
          this.getUpdateType()
          // alert('submit!');
        } else {
          console.log('error submit!!')
          return false
        }
      })
      // console.log(this.typeBox)
      this.$emit('sendUpdate', this.typeBox)
    },
    async getUpdateType() {
      let data = {
        filetype: JSON.stringify(this.typeBox),
        updatetype: 1
      }
      const result = await file.getUpdateType(data)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.$emit('submitResult', result)
        this.handleClose()
      } else this.$message.error('操作失败!')
    },

    // 确认关闭
    handleClose() {
      this.$emit('update:visible', false)
      // this.$emit('update:editForm', editForm)
    }
  }
}
</script>

<style lang="scss" scoped>
// .type-box {
//   > :first-of-type {
//     margin-bottom: 20px;
//   }
//   .content-box {
//     display: flex;
//     justify-content: space-evenly;
//     align-items: center;
//     flex-direction: row;

//     .el-input {
//       width: 60%;
//     }
//   }
// }

.el-form-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
