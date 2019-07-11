/**
 * 首字母大写
 * @param str 字符串
 * @example heheHaha
 * @return {string} HeheHaha
 */
export function capitalizeFirstLetter (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/* 去除对象空值 */
export function ObjectMap (obj = {}) {
  const newObject = {}
  for (const key of Object.keys(obj)) {
    const value = obj[key]
    if (typeof value !== 'undefined' && value !== '' && value !== null && value !== -1) {
      newObject[key] = value
    }
  }
  return newObject
}

/* 深拷贝 */
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}
