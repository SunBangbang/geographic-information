/*
 * @Description:
 * @version:
 * @Author: Chen JianXin
 * @Date: 2020-12-02 16:11:52
 * @LastEditors: Chen JianXin
 * @LastEditTime: 2020-12-02 16:14:51
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
const _import = require('./import_' + process.env.NODE_ENV)
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 * meta: {
 *     keepAlive: true/false 判断是否记录滚轮位置
 * }
 */
export const constantRoutes = [
  // {
  //   path: '/legalPerson',
  //   component: _import('legalPerson'),
  //   name: '法人注册',
  //   hidden: true,
  //   meta: {
  //     keepAlive: true
  //   }
  // },
  {
    path: '/redirect',
    component: _import('layout'),
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: _import('redirect')
      }
    ]
  },
  // {
  //   path: '/naturalPerson',
  //   component: _import('naturalPerson'),
  //   name: '自然人注册',
  //   hidden: true,
  //   meta: {
  //     keepAlive: true
  //   }
  // },
  {
    path: '/login',
    component: _import('login'),
    name: '登录页',
    hidden: true
  },
  {
    path: '/404',
    component: _import('404'),
    name: '404',
    hidden: true,
    meta: {
      keepAlive: true
    }
  },
  // {
  //   path: '/register',
  //   component: _import('register'),
  //   name: '注册账号',
  //   hidden: true,
  //   meta: {
  //     keepAlive: false
  //   }
  // },
  // {
  //   path: '/findPass',
  //   component: () => import('@/views/findPass'),
  //   name: '找回密码',
  //   hidden: true,
  //   meta: {
  //     keepAlive: false
  //   }
  // },
  {
    path: '/',
    redirect: '/openlayers',
    component: _import('layout'),
    children: [

      {
        name: 'openlayers',
        path: 'openlayers',
        component: _import('openlayers'),
        meta: {
          keepAlive: true,
          title: '基础设施'
        }
      },
      {
        name: '统计查询',
        path: 'query',
        component: _import('query'),
        meta: {
          keepAlive: true,
          title: '统计查询'
        }
      },
      {
        name: '态势监测',
        path: 'monitor',
        component: _import('monitor'),
        meta: {
          keepAlive: true,
          title: '态势监测'
        }
      },
      {
        name: 'file',
        path: 'file',
        component: _import('file'),
        meta: {
          keepAlive: true,
          title: '项目文件管理'
        }
      },
      {
        name: 'dataManagement',
        path: 'dataManagement',
        component: _import('dataManagement'),
        meta: {
          keepAlive: true,
          title: '数据管理'
        }
      },
      {
        name: 'user',
        path: 'user',
        component: _import('user'),
        meta: {
          keepAlive: true,
          title: '用户管理'
        }
      },
    ]
  }
]

const createRouter = () =>
  new VueRouter({
    // 该特性新版vue不再支持，存在bug，但暂未找到更好的解决方案
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        if (!from.meta.noCache) {
          from.meta.savedPosition = document.body.scrollTop
        }
      }
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            x: 0,
            y: to.meta.savedPosition
          })
        }, 0)
      })
    },
    mode: 'history',
    base: process.env.BASE_URL,
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router 重置路由
}

export default router
