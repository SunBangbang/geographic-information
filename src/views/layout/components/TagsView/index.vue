<template>
  <div class="tags-view-container">
    <el-scrollbar
      ref="scrollContainer"
      :vertical="false"
      class="scroll-container"
    >
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :to="{ path: tag.path }"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        class="tags-view-item"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          v-if="visitedViews.length > 1"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </el-scrollbar>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
    </ul>
  </div>
</template>

<script>
import { getVisitedView, getActive, setActive } from '@/utils/cookies'
export default {
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.user.routes
    }
  },
  mounted() {
    this.addTags()
  },
  watch: {
    $route() {
      this.addTags()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    closeSelectedTag(view) {
      this.$store
        .dispatch('tagsView/delView', view)
        .then(({ visitedViews }) => {
          // console.log(visitedViews)
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view)
          }
        })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        this.$router.push('/')
      }
    },
    // 刷新所选tag对应页面
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    // 关闭其他页面
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store
        .dispatch('tagsView/delOthersViews', this.selectedTag)
        .then(() => {
          // this.moveToCurrentTag()
        })
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetTop = this.$el.getBoundingClientRect().top // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right
      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }
      this.top = e.clientY - offsetTop + 15
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  // height: 75px;
  width: 100%;
  padding: 10px 20px;
  .tags-view-item {
    display: inline-block;
    position: relative;
    cursor: pointer;
    height: 45px;
    line-height: 40px;
    // border: 1px solid #d8dce5;
    color: #5d6268;
    // background: #cad1d8;
    padding: 0 8px;
    font-size: 14px;
    font-weight: bold;
    margin-left: 5px;
    // margin-top: 17px;
    // margin-bottom: 10px;
    &:first-of-type {
      margin-left: 0;
    }
    &:last-of-type {
      margin-right: 15px;
    }
    &.active {
      background-color: #fff;
      color: #56a3f3;
      border-bottom: 2px solid #56a3f3;
      //   box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05);
      &::before {
        content: '';
        background: #fff;
        display: none;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 2px;
      }
    }
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 0;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -1px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}

.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.04);
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 100%;
      background-color: #fff;
    }
  }
}

.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
// .link-icon {
//   margin-right: 5px;
// }
// /deep/.el-scrollbar__wrap {
//   padding: 0 15px;
// }
// .dropdown-active {
//   color: #57a4f4;
//   background-color: #e8eff9;
// }
// /deep/.el-dropdown-menu__item {
//   float: left;
// }
// /deep/.el-dropdown-link {
//   display: inline-block;
//   height: 100%;
// }
/deep/.tags-view-item {
  margin: 0 10px;
}
</style>
