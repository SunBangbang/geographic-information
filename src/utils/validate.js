// 正则判空
export function regExpEmptyString(value) {
  const reg = new RegExp(/^$/)
  if (reg.test(value)) return true
  else return false
}
