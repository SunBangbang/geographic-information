<template>
  <div class="navMenu">
    <template v-for="navMenu in navMenus">
      <!-- 最后一级菜单 -->
      <el-menu-item
        v-if="!navMenu.children || navMenu.children.length < 1"
        :key="navMenu.id"
        :index="navMenu.path"
      >
        <!-- <i :class="navMenu.icon"></i>
        <span slot="title">{{ navMenu.name }}</span> -->
        <item :icon="navMenu.icon" :title="navMenu.name" />
      </el-menu-item>

      <!-- 此菜单下还有子菜单 -->
      <el-submenu
        v-if="navMenu.children && navMenu.children.length > 0"
        :key="navMenu.id"
        :index="navMenu.path"
      >
        <template slot="title">
          <item :icon="navMenu.icon" :title="navMenu.name" />
          <!-- <i :class="navMenu.icon"></i>
          <span> {{ navMenu.name }}</span> -->
        </template>
        <!-- 递归 -->
        <sidebar-item :navMenus="navMenu.children"></sidebar-item>
      </el-submenu>
    </template>
  </div>
</template>

<script>
import Item from './Item'
export default {
  name: 'SidebarItem',
  components: { Item },
  props: {
    navMenus: {
      type: Array,
      default: []
    }
  },
  data() {
    return {}
  },
  methods: {
    
  }
}
</script>
