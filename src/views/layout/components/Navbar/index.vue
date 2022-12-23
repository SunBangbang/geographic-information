<template>
  <div class="navbar" :style="{ 'background-color': theme }">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClickopen="toggleClickopen"
      @toggleClickclose="toggleClickclose"
    />
    <div class="logo-name">
      <img :src="logoImgUrl" alt="" class="logo" />
      <span class="system-name">江苏省港航地理信息云平台</span>
    </div>
    <top-bar v-on:logout="logout" :userInfo="userInfo" :infoList="infoList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import TopBar from '@/components/TopBar'

export default {
  // props:isShow,
  components: {
    Hamburger,
    TopBar
  },
  computed: {
    ...mapGetters(['sidebar', 'userInfo', 'theme'])
  },
  data() {
    return {
      seen:false,
      websock: null,
      logoImgUrl: require('@/assets/img/header_logo.png'),
      infoList: [
        // {
        //   content: '这是消息'
        // },
        // {
        //   content: '这是消息'
        // },
        // {
        //   content: '这是消息'
        // },
        // {
        //   content: '这是消息'
        // }
      ],
      yc:false,
      wc:false,
    }
  },
  mounted() {
   
  },
  destroyed() {
   
  },
  methods: {
    toggleClickclose() {

      // alert(1)
      this.$store.dispatch('app/toggleSideBarCLOSE')
      
    },
    toggleClickopen() {

      // alert(1)
      this.$store.dispatch('app/toggleSideBarOPEN')
      
    },
    // leave() {
		// 		alert(2)
		// 	},
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push(`/login`)
    },
    
  }
}
</script>
