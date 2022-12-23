import { user } from '../../api'
import {
  getToken,
  setToken,
  removeToken,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
  setID,
  removeActive,
  removeVisitedView
} from '../../utils/cookies'
import { constantRoutes, resetRouter } from '../../router'
import { filterAsyncRouter } from '../../utils/routes'

const state = {
  token: getToken(),
  userInfo: {},
  routes: [],
  menus: [],
  publicKey: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_PUBLICKEY: (state, publicKey) => {
    state.publicKey = publicKey
  }
}

const actions = {
  getPublicKey({ commit }) {
    return new Promise((resolve, reject) => {
      user
        .getPublicKey()
        .then(res => {
          if (res.status === 200) {
            commit('SET_PUBLICKEY', res.res.key)
            resolve(res.res.key)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 此处建议将用户信息与token划分为俩个接口，将用户信息存储于本地缺乏安全性
  login({ commit }, userInfo) {
    const { name, pwsd } = userInfo
    return new Promise((resolve, reject) => {
      user
        .login({ name, pwsd })
        .then(res => {
          if (res.status === 200) {
            setToken(res.res.token)
            // setUserInfo(res.res)
            commit('SET_TOKEN', res.res.token)
            // commit('SET_USERINFO', res.res)
          }
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      user
        .getUserInfo()
        .then(res => {
          if (res.status === 200) {
            setUserInfo(res.res)
            commit('SET_USERINFO', res.res)
            resolve(res)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  logout({ commit }) {
    return new Promise(resolve => {
      // user.logout().then(res => {
      commit('SET_TOKEN', '')
      commit('SET_USERINFO', {})
      commit('SET_ROUTES', [])
      removeToken()
      removeUserInfo()
      removeActive()
      removeVisitedView()
      resetRouter() // 重置路由
      resolve()
      // }).catch(err => {
      //     reject(err)
      // })
    })
  },
  generateRoutes({ commit, state }) {
    return new Promise((resolve, reject) => {
      // let menusData = [
      //   {
      //     id: '0',
      //     name: '首页',
      //     path: '/homePage',
      //     icon: 'el-icon-message'
      //   },
      //   {
      //     id: '1',
      //     name: '平台展示',
      //     path: '/show',
      //     icon: 'el-icon-message',
      //     children: [
      //       {
      //         id: '1-1',
      //         name: 'gis',
      //         path: '/gis'
      //       },
      //       {
      //         id: '1-2',
      //         name: 'bim',
      //         path: '/bim'
      //       },
      //       {
      //         id: '1-3',
      //         name: 'openlayers',
      //         path: '/openlayers'
      //       }
      //     ]
      //   },
      //   {
      //     id: '2',
      //     name: '富文本编辑器',
      //     path: '/wangEditor',
      //     icon: 'el-icon-message',
      //   }
      // ]
      // commit('SET_MENUS', menusData)
      // let menus = []
      // let addRoutes = filterAsyncRouter(menus)
      // let route_404 = [{ path: '*', redirect: '/404', hidden: true }]
      // commit('SET_ROUTES', [...constantRoutes, ...addRoutes, ...route_404])
      // resolve([...constantRoutes, ...addRoutes, ...route_404])
      user
        .getRoutes()
        .then(res => {
          // let menusData = [
          //   {
          //     id: '0',
          //     name: '项目总览',
          //     path: '/openlayers',
          //     icon: 'el-icon-message'
          //   },
          //   {
          //     id: '1',
          //     name: 'BIM视景器',
          //     path: '/gis',
          //     icon: 'el-icon-message'
          //   },
          //   {
          //     id: '2',
          //     name: 'BIM数据管理',
          //     path: '/homePage',
          //     icon: 'el-icon-message',
          //     children: [
          //       {
          //         id: '2-1',
          //         name: 'BIM数据记录',
          //         path: '/homePage',
          //         icon: 'el-icon-message'
          //       },
          //       {
          //         id: '2-2',
          //         name: '审核管理',
          //         path: '/examine',
          //         icon: 'el-icon-message'
          //       },
          //       {
          //         id: '2-3',
          //         name: 'BIM数据分析',
          //         path: '/analysis',
          //         icon: 'el-icon-message'
          //       }
          //     ]
          //   },
          //   {
          //     id: '3',
          //     name: '运行日志',
          //     path: '/',
          //     icon: 'el-icon-message'
          //   },
          //   {
          //     id: '4',
          //     name: '项目文件管理',
          //     path: '/file',
          //     icon: 'el-icon-message'
          //   },
          //   {
          //     id: '5',
          //     name: '用户管理',
          //     path: '/',
          //     icon: 'el-icon-message'
          //   }
          // ]
          console.log(res);
          let menusData = res.res.menutree
          commit('SET_MENUS', menusData)
          let menus = []
          let addRoutes = filterAsyncRouter(menus)
          let route_404 = [{ path: '*', redirect: '/404', hidden: true }]
          commit('SET_ROUTES', [...constantRoutes, ...addRoutes, ...route_404])
          resolve([...constantRoutes, ...addRoutes, ...route_404])
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateToken({ commit }, token) {
    return new Promise(resolve => {
      setToken(token)
      commit('SET_TOKEN', token)
      resolve()
    }).catch(err => {
      reject(err)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
