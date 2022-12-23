<template>
  <el-dialog
    :title="title"
    :visible="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="400px"
    @close="handleClose"
    :modal="false"
  >
  <div class="popup-content-box">
    

  </div>





  </el-dialog>
</template>

<script>
export default {
  props: {
    // 弹框标题
    title: {
      type: String,
      default: '项目基本信息'
    },
    // 控制弹框显隐
    visible: {
      type: Boolean,
      default: false
    },
    // 显示内容
    popupField: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('update:popupField', [])
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
