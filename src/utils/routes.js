export function filterAsyncRouter(routers) {
    let accessedRouters = routers.filter(router => {
        if (!router.path) {
            return false
        }
        router.meta = {
            icon: router.icon ? router.icon : 'el-icon-s-help',
            title: router.title ? router.title : '未命名'
        }
        if (!router.pid) {
            router.component = loadView('layout')
            router.path = `/${router.path}`
            if (router.children && router.children.length > 0) {
                router.redirect = `${router.path}/${router.children[0].path}`
            }
        } else {
            router.component = loadView(router.path)
        }
        if (router.children && router.children.length) {
            router.children = filterAsyncRouter(router.children)
        }
        return true
    })
    return accessedRouters
}

export function loadView(view) {
    // return () => import(`@/views/${view}/index`)
    return () => Promise.resolve(require(`@/views/${view}/index`).default)
}
