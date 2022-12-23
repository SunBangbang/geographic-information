<template>
    <div @mouseenter="toggleClickclose" @mouseleave="toggleClickopen" :collapse="isCollapse">
    
        <el-scrollbar wrap-class="scrollbar-wrapper">
    
            <el-menu  :unique-opened="false" :collapse-transition="false" :background-color="styleObj.menuBg" :text-color="styleObj.menuText" :active-text-color="styleObj.menuActiveText" :default-active="activeMenu" router mode="vertical">
    
                <sidebar-item :navMenus="menuData"></sidebar-item>
    
            </el-menu>
    
        </el-scrollbar>
    
        <img class="pad-printing" :src="padPrinting" alt="">
    
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { common,layout } from '@/api/index'
export default {
    components: {
        SidebarItem
    },
    data() {
        return {
            styleObj: {
                menuBg: 'rgba(0,0,0,0)',
                menuText: '#fff',
                menuActiveText: '#fdff2e'
            },
            padPrinting: require("@/assets/img/layout/sidebar_bg.png"),
            pageName:'',
        }
    },
    computed: {
        ...mapGetters(['sidebar']),
        menuData() {
            return this.$store.state.user.menus
        },
        activeMenu() {
            const route = this.$route
            const { meta, path } = route
            console.log(meta, path)
            this.pageName = meta.title + '页面'
            this.save()
            if (meta.activeMenu) {
                return meta.activeMenu
            }
            return path
        },
        isCollapse() {
            return !this.sidebar.opened
        }
    },
    methods: {
        // 上传浏览记录
        async save() {
            let { code, data } = await layout.save({
                pageName:this.pageName
            })
            if(code == 200){
                console.log(data);
            }
  
        },
        toggleClickopen() {
            // this.$emit('toggleClickopen')
            this.$store.dispatch('app/toggleSideBarOPEN')
        },
        toggleClickclose() {
            // this.$emit('toggleClickclose')
           this.$store.dispatch('app/toggleSideBarCLOSE')
        },
        leave($event) {
            console.log(this.$event)
            $event.currentTarget.className = "openSidebar"
        }
        // leave(){
        //   this.$refs.abc.style.width = "0%" ;
        // }

    }
}
</script>
