import { http } from '@/utils'
export const AuthApi = {
  register : '/paas/paasuser/tenantUserRegister',
  Login : '/oauth-server/login/token',
  Logout : '/oauth-server/logout/token',
  BaseInfo : '/user-server/users/getUserInfo'
}

/* 小程序账号注册     */
export function registerAccount(data) {
  return http.post(AuthApi.register, data, {
    joinParamsToUrl: true,
    ignoreCheckToken: true
  })
}

/* 小程序账号登录 */
export function loginByAccount (data, token) {
  const {userNameLoginReq} = data
  return http.post(AuthApi.Login, {...userNameLoginReq,encryption:true}, {
    header: token ? { 'blade-auth': `bearer ${token}` } : {},
    ignoreCheckToken: true,
    joinParamsToUrl: true,
    ignoreHandleError: true
  })
}

/* 小程序退出登录清除token */
export function logout(data) {
  return http.post(AuthApi.Logout, data, {
    joinParamsToUrl: true,
    ignoreHandleError: true
  })
}

// 查询手机号码是否已经注册
export function isPhoneExist(userName) {
  return http.get({
    url: '/paas/paasuser/userNameExist',
    query: { userName }
  })
}

// 查询基础用户信息
export function getBaseInfo() {
  return http.get(AuthApi.BaseInfo)
}
