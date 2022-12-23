<template>
  <el-dialog
    :title="title"
    :visible="visible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form
      :model="reasonForm"
      :rules="rules"
      ref="reasonForm"
      label-width="100px"
    >
      <el-form-item label="" prop="reason">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          prop="reason"
          v-model="reasonForm.reason"
        >
        </el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="confirm">确认提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 弹框标题
    title: {
      type: String,
      default: '请填写删除原因'
    },
    visible: {
      // 控制弹框显隐
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formName: 'reasonForm',
      reasonForm: {
        reason: ''
      },
      rules: {
        reason: [{ required: true, message: '请输入删除原因', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 确认提交
    confirm() {
      this.$refs['reasonForm'].validate(valid => {
        if (valid) {
          this.$emit('fillInReason', this.reasonForm.reason)
          this.handleClose()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消/关闭
    handleClose() {
      this.reasonForm.reason = ''
      this.$refs[this.formName].resetFields()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-textarea__inner {
  resize: none;
}
/deep/.el-form-item__content {
  margin-left: 0 !important;
}
/deep/.el-dialog__body {
  padding-bottom: 0;
}
</style>
