import router from './index'
import store from '../store'
import { Message } from 'element-ui'
import {getToken, getUserInfo} from "../utils/cookies"
import {exportWhiteListFromRouter} from "../utils/utils"
import {constantRoutes} from "./index"
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({showSpinner: false});

const whiteList = exportWhiteListFromRouter(constantRoutes) // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') { //如果登录成功访问登录页跳转到主页
            next({path: '/'})
            NProgress.done()
        } else {
            const hasRoutes = store.getters.routes && store.getters.routes.length > 0
            const hasUserInfo = store.getters.userInfo
            // 判断路由信息以及用户信息是否拉取
            if (hasRoutes && hasUserInfo) {
                // const accessRoutes = await store.dispatch('user/generateRoutes')
                next()
            } else {
                try {
                    // generate accessible routes map based on roles
                    await store.dispatch('user/getUserInfo')
                    const accessRoutes = await store.dispatch('user/generateRoutes')
                    // dynamically add accessible routes
                    router.addRoutes(accessRoutes)
                    // hack method to ensure that addRoutes is complete
                    // set the replace: true, so the navigation will not leave a history record
                    next({...to, replace: true})
                }
                catch (err) {
                    await store.dispatch('user/logout')
                    // next(`/login?redirect=${to.path}`)
                    next(`/login`)
                    NProgress.done()
                }
            }
        }
    } else {
        if (whiteList.indexOf(to.path) > -1) {
            next()
        } else {
            // next(`/login?redirect=${to.path}`)
            console.log(222);
            next(`/login`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
