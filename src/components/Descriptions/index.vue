<template>
  <el-descriptions
    class="margin-top"
    :title="title"
    :column="options.column"
    :labelStyle="options.labelStyle"
    :contentStyle="options.contentStyle"
    :size="options.size"
    border
  >
    <template slot="extra">
      <!-- <el-button type="primary" size="mini">操作</el-button> -->
      <slot name="preview"></slot>
    </template>
    <el-descriptions-item
      v-for="(item, index) in descriptionsData"
      :key="index"
    >
      <template slot="label">
        <!-- <i class="el-icon-user"></i> -->
        {{ item.label }}
      </template>
      <span v-if="item.label === '3dtiles文件大小'">{{
        item.value | formatbytes
      }}</span>
      <span v-else>{{ item.value }}</span>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => {
        return {
          column: 2,
          labelStyle: {
            width: '100px'
          },
          contentStyle: {
            minWidth: '120px'
          },
          size: 'small'
        }
      }
    },
    // 展示信息
    descriptionsData: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
