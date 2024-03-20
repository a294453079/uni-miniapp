import { match, pathToRegexp } from 'path-to-regexp/dist'
/**接口白名单举例写法 */
const list = [
  // '/paas/userAuth/(login|captcha|updatePassword|sendUpdatePwdCode|resetPassword)',
  // '/paas/paasuser/(getWxMiniUserPhone|getWxNewPhoneNoInfo|userNameExist)',
  // '/wpc-return-visit/config/getTenantIdByCountyId',
  // '/paas/paasposition(.*)'
  // '/oauth-server/login/token',
  '/oauth-server/oauth/publicKey'
]

export default list

const matchFnList = list.map((o) => match(o, { decode: decodeURIComponent }))

export function reqUrlMatch(url) {
  return matchFnList.some((o) => o(url))
}
