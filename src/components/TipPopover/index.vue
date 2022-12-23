<template>
  <el-popover
    placement="top-end"
    title=""
    :width="options.width"
    :trigger="options.trigger"
    popper-class="tip"
    :content="content"
  >
    <el-button
      slot="reference"
      type="text"
      icon="el-icon-warning"
      class="tip"
      :style="{ color: options.color }"
    ></el-button>
  </el-popover>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => {
        return {
          //   width: '830',
          color: '#f56c6c',
          trigger: 'click'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tip {
  padding: 0 7px;
}
</style>
