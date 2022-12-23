<template>
  <el-dialog
    title="在线预览"
    :visible="visible"
    width="950px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :append-to-body="previewObj.appendToBody"
    @close="handleClose"
  >
    <iframe :src="previewUrl" frameborder="0"></iframe>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 控制弹框显隐
    visible: {
      type: Boolean,
      default: false
    },
    previewObj: {
      type: Object,
      default: () => {
        return {
          type: '',
          url: '',
          appendToBody: false
        }
      }
    }
  },
  computed: {
    previewUrl() {
      return '/NHHD/pdf/web/viewer.html?file=' + this.previewObj.url
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('update:previewObj', { type: '', url: '' })
    }
  }
}
</script>

<style lang="scss" scoped>
iframe {
  width: 100%;
  height: 700px;
}
/deep/.el-dialog__body {
  padding: 0;
}
</style>
