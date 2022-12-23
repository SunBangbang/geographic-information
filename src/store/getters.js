const getters = {
  token: state => state.user.token,
  publicKey: state => state.user.publicKey,
  userInfo: state => state.user.userInfo,
  menus: state => state.user.menus,
  routes: state => state.user.routes,
  visitedViews: state => state.tagsView.visitedViews,
  viewActiveId: state => state.tagsView.viewActiveId,
  sidebar: state => state.app.sidebar,
  theme: state => state.settings.theme
}

export default getters
