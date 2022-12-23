<template>
  <div class="top-bar">
    <div class="bar">
      <span class="date">{{ date }}</span>
      <div class="userInfo" @click="userManagement">
        <img :src="imgUrl1" alt="" /><span class="avatar-name">{{
          userInfo.realname
        }}</span>
      </div>
      <el-popover
        placement="bottom"
        width="350"
        trigger="click"
        :disabled="infoList.length > 0 ? true : true"
      >
        <!-- <el-scrollbar wrap-class="scrollbar-wrapper">
          <ul class="info-card">
            <li v-for="item in infoList" class="info-list">
              {{ item.content }}
            </li>
          </ul>
        </el-scrollbar> -->
        <!-- <el-button slot="reference" class="info-btn"
          ><img :src="imgUrl2" alt="" /><span>消息</span
          ><sup class="info-count" v-show="infoList.length > 0">{{
            infoList.length
          }}</sup></el-button
        > -->
      </el-popover>
      <!-- <el-dropdown trigger="click">
        <el-button class="el-dropdown-link settings-btn"
          ><img :src="imgUrl3" alt="" /><span>设置</span></el-button
        >
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-plus">首页</el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-plus"
            >个人信息</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-circle-plus-outline"
            >个人设置</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown> -->
      <!-- <el-button class="logout-btn" @click="backGuide"
        ><img :src="imgUrl4" alt="" /><span>返回引导页</span></el-button
      > -->
      <el-button class="logout-btn" @click="logout"
        ><img :src="imgUrl4" alt="" /><span>退出</span></el-button
      >
    </div>
  </div>
</template>

<script>
import { user } from '../../api'
export default {
  props: {
    userInfo: Object,
    infoList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      imgUrl1: require('@/assets/img/avatar.png'),
      imgUrl2: require('@/assets/img/email.png'),
      imgUrl3: require('@/assets/img/setting.png'),
      imgUrl4: require('@/assets/img/logout.png'),
      date: this.$moment().format('yyyy-MM-DD hh:mm:ss')
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.date = this.$moment().format('yyyy-MM-DD hh:mm:ss')
    }, 1000)
  },
  methods: {
    logout() {
      this.$emit('logout')
    },
    backGuide() {
      this.$router.push({
        path: '/guide'
      })
    },
    // 点击用户管理
    userManagement(){
      user.getRoutes().then(res=>{
        if(res.res.menutree[0].name == '统计查询'){
          this.$message("您没有该权限!")
        }else{
          this.$router.push({
            path: '/user'
          })
        }
      })
      
    }
  }
}
</script>

<style lang="scss" scoped>
.top-bar {
  float: right;
  height: 100%;
  font-size: 16px;
  color: #fff;
}

.bar {
  height: 100%;
  display: flex;
  align-items: center;
  .time {
    margin-right: 20px;
  }
  .userInfo {
    padding-right: 15px;
    padding-left: 35px;
    cursor: pointer;
    img,
    span {
      vertical-align: middle;
    }
    .avatar-name {
      margin-left: 10px;
    }
  }
  .el-button {
    border: none;
    color: #fff;
    padding: 12px 15px;
    position: relative;
    background-color: transparent;
    img,
    span {
      vertical-align: middle;
    }
    span {
      margin-left: 5px;
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 1px;
      height: 24px;
      margin-top: -12px;
      background-color: #71ace7;
    }
  }
  .el-button + .el-button {
    margin-left: 0;
  }
}

.info-count {
  min-width: 20px;
  min-height: 20px;
  /*padding: 2px;*/
  line-height: 15px;
  position: absolute;
  top: -2px;
  right: 4px;
  z-index: 100;
  border-radius: 50%;
  border: 2px solid #fff;
  background-color: #ff8e2f;
}

.info-card {
  width: 100%;
  max-height: 170px;
  .info-list {
    height: 40px;
    line-height: 40px;
    padding-left: 25px;
    position: relative;
    left: 0;
    top: 0;
    color: #333;
    &:after {
      content: '';
      width: 5px;
      height: 5px;
      position: absolute;
      left: 10px;
      top: 50%;
      margin-top: -2.5px;
      border-radius: 50%;
      background-color: red;
    }
  }
}
</style>
