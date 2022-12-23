import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const InfoKey = 'User-Info'
const ID = 'User-Id'
const VisitedView = 'Visited-View'
const ActiveView = 'Active-View'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function setID(token) {
    return Cookies.set(ID, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function getUserInfo() {
    return Cookies.get(InfoKey)
}

export function setUserInfo(userInfo) {
    return Cookies.set(InfoKey, userInfo)
}

export function removeUserInfo() {
    return Cookies.remove(InfoKey)
}

export function getVisitedView() {
    return Cookies.get(VisitedView)
}

export function setVisitedView(view) {
    return Cookies.set(VisitedView, view)
}

export function removeVisitedView() {
    return Cookies.remove(VisitedView)
}

export function setActive(view) {
    return Cookies.set(ActiveView, view)
}

export function getActive() {
    return Cookies.get(ActiveView)
}

export function removeActive() {
    return Cookies.remove(ActiveView)
}