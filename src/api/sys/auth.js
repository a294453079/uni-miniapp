import { http } from '../../utils/http'

import { LoginParams, MiniappAuthInfo, RegisterParams } from './model/authModel'

export enum AuthApi {
  register = '/paas/paasuser/tenantUserRegister',
  Login = '/paas/userAuth/login',
  Logout = '/paas/paasuser/userLogout',
  BaseInfo = '/paas/paasuser/myInfo'
}

/* 小程序账号注册     */
export function registerAccount(data: RegisterParams) {
  return http.post(AuthApi.register, data, {
    joinParamsToUrl: true,
    ignoreCheckToken: true
  })
}

/* 小程序账号登录 */
export function loginByAccount(data: LoginParams, token?: string) {
  return http.post<MiniappAuthInfo>(AuthApi.Login, data, {
    header: token ? { 'blade-auth': `bearer ${token}` } : {},
    ignoreCheckToken: true,
    ignoreHandleError: true
  })
}

/* 小程序退出登录清除token */
export function logout() {
  return http.get(AuthApi.Logout, undefined, { ignoreHandleError: true })
}

// 查询手机号码是否已经注册
export function isPhoneExist(userName: string) {
  return http.get({
    url: '/paas/paasuser/userNameExist',
    query: { userName }
  })
}

// 查询基础用户信息
export function getBaseInfo() {
  return http.get(AuthApi.BaseInfo)
}
