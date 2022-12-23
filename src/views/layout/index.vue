<template>
    <div :class="classObj" class="app-wrapper">
        <navbar/>
        <sidebar class="sidebar-container" />
        <div class="main-container">
            <!-- <tags-view class="tags-container"/> -->
            <app-main/>
            <right-panel v-if="showSettings">
                <settings />
            </right-panel>
            <el-backtop target=".app-main"></el-backtop>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {Sidebar, AppMain, Navbar, TagsView, Settings} from './components'
    import RightPanel from '@/components/RightPanel'
    export default {
        name: 'Home',
        components: {
            Navbar,
            Sidebar,
            TagsView,
            AppMain,
            Settings,
            RightPanel
        },
        data() {
          return {
            //   isShow:false,
              showSettings: true
          }
        },
        computed: {
            ...mapState({
                sidebar: state => state.app.sidebar
            }),
            key() {
                return this.$route.path
            },
            classObj() {
                return {
                    hideSidebar: this.sidebar.opened,
                    openSidebar: !this.sidebar.opened,
                    withoutAnimation: this.sidebar.withoutAnimation
                }
            }
        },
        methods:{
            
            // leave(){
            // //   this.currentTarget.className = "hideSidebar"
            // alert(1)
            // }
        }

    }
</script>
