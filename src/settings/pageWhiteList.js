import { match, pathToRegexp } from 'path-to-regexp/dist'

import { getCurrentPage } from '../utils'
/**页面白名单举例写法 */
const list = [
  'pages/identity/login',
  'pages/identity/register',
  'pages/identity/forget/index',
  'pages/redirect/index'
] 

export default list

const matchFnList = list.map((o) => match(o, { decode: decodeURIComponent }))

export function pageUrlMatch() {
  return matchFnList.some((o) => o(url))
}

export function currentPageMatch() {
  const { route } = getCurrentPage()
  return pageUrlMatch(route)
}
