
import dayjs from 'dayjs'
import { find, flatMap } from 'lodash-es'
import userStore from "@/stores/index.js"
export function verificationToken () {
  // 1：安全可用；0：临近过期；-1：已过期
  const { userInfoStore } = userStore()
  if (userInfoStore.getToken) {
    const { expires_in = 0, token_type } = userInfoStore.authInfo ?? {}
    return 1
    // const diff = dayjs.unix(Number(expires_in)).diff(undefined, 's')

    // const expiration = userInfoStore.authInfo?.expiration || 3600

    // 防止值过大，造成无限刷新token的问题
    // expiration = expiration > 23 * 3600 ? 3600 : expiresIn

    // if (token_type === 1) {
    //   return diff > expiration ? 1 : diff > 0 ? 0 : -1
    // } else {
    //   // 处理短效token
    //   return diff > 0 ? 1 : 0
    // }
  } else {
    return -1
  }
}
