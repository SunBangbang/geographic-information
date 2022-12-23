<template>
  <el-dialog
    title="用户信息"
    :visible="visible"
    width="750px"
    @close="handleClose"
  >
    <div class="user-info">
      <descriptions :descriptionsData="info" />
      <div class="user-img">
        <span>用户头像</span>
        <img :src="imgUrl" alt="" class="img" v-if="imgUrl" />
        <div class="empty-img" v-if="!imgUrl">
          <i class="el-icon-user"></i>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Descriptions from '@/components/Descriptions'
export default {
  components: {
    Descriptions
  },
  props: {
    // 弹框显隐
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Array,
      default: () => {
        return []
      }
    },
    imgUrl: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('update:info', [])
      this.$emit('update:imgUrl', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.user-img {
  display: flex;
  align-items: flex-start;
  border: 1px solid #ebeef5;
  border-top: none;
  span {
    width: 100px;
    height: 148px;
    padding: 15px 10px;
    display: inline-block;
    color: rgb(144, 147, 153);
    background-color: rgb(250, 250, 250);
    border-right: 1px solid #ebeef5;
  }
}
.img {
  width: 148px;
  height: 148px;
  margin-left: 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.empty-img {
  width: 148px;
  height: 148px;
  margin-left: 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  line-height: 158px;
  text-align: center;
  i {
    font-size: 48px;
    color: #8c939d;
  }
}
/deep/.el-descriptions--small.is-bordered .el-descriptions-item__cell {
  padding: 15px 10px;
}
</style>
