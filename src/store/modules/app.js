import Cookies from 'js-cookie'

const state = {
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
        withoutAnimation: false
    }
}

const mutations = {
    TOGGLE_SIDEBAR_OPEN: state => {
        state.sidebar.opened = !state.sidebar.opened
        state.sidebar.withoutAnimation = false
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1)
        } 
    },
    TOGGLE_SIDEBAR_CLOSE: state => {
        state.sidebar.opened = !state.sidebar.opened
        state.sidebar.withoutAnimation = false
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 0)
        } 
    }
}

const actions = {
    toggleSideBarOPEN({commit}) {
        commit('TOGGLE_SIDEBAR_OPEN')
    },
    toggleSideBarCLOSE({commit}) {
        commit('TOGGLE_SIDEBAR_CLOSE')
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
