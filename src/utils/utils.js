import JSEncrypt from 'jsencrypt' // RSA加密
/*
 * @Description:
 * @version:
 * @Author: Chen JianXin
 * @Date: 2020-12-14 09:17:35
 * @LastEditors: Chen JianXin
 * @LastEditTime: 2020-12-28 10:44:38
 */
/**
 * 路由白名单
 * */
export const exportWhiteListFromRouter = router => {
  let res = []
  for (let item of router) res.push(item.path)
  return res
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * RSA encryption
 * */
export function encryption(str, publicKey) {
  let pubKey = `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`
  let encryptStr = new JSEncrypt()
  encryptStr.setPublicKey(pubKey)
  let data = encryptStr.encrypt(str.toString())
  return data
}

export function isCompress(str) {
  //var format = str.lastIndexOf('.');
  var format = str.substring(str.lastIndexOf('.') + 1)

  console.log('format', format)
  if (format === 'zip' || format === 'rar' || format === '7z') {
    return true
  } else {
    return false
  }
}

export function isimg(str) {
  //var format = str.lastIndexOf('.');
  var format = str.substring(str.lastIndexOf('.') + 1)

  console.log('format', format)
  if (format === 'jpg' || format === 'png') {
    return true
  } else {
    return false
  }
}

// 深拷贝
export function copy(obj, exclude = []) {
  let newObj = null
  if (typeof obj === 'object' && obj !== null) {
    newObj = obj instanceof Array ? [] : {}
    for (let i in obj) {
      if (!exclude.includes(i))
        newObj[i] = typeof obj[i] === 'object' ? copy(obj[i]) : obj[i]
    }
  } else {
    newObj = obj
  }
  return newObj
}
