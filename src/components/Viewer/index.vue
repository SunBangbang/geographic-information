<template>
  <viewer :images="imgUrls" style="display:none;">
    <!-- <img v-for="(url, index) in imgUrls" :key="index" :src="url" alt="" /> -->
  </viewer>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import Vue from 'vue'
Vue.use(VueViewer)

export default {
  props: {
    imgUrls: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    imgUrls(val) {
      if (val.length > 0) this.show()
    }
  },
  methods: {
    show() {
      this.$viewerApi({
        images: this.imgUrls,
        options: {
          hidden: this.hide
        }
      })
    },
    hide() {
      this.$emit('update:imgUrls', [])
    }
  }
}
</script>

<style lang="scss" scoped>
#index {
  display: none;
}
</style>
