import { match, pathToRegexp } from 'path-to-regexp/dist'

import { getCurrentPage } from '../utils'
/**页面白名单举例写法 */
const list = [
  'pages/login/index',
  'pages/register/index',
  'pages/identity/forget/index',
  'pages/redirect/index'
] 

export default list

const matchFnList = list.map((o) => match(o, { decode: decodeURIComponent }))

export function pageUrlMatch(url) {
  return matchFnList.some((o) => o(url))
}

export function currentPageMatch () {
  const { route } = getCurrentPage()
  return pageUrlMatch(route)
}
