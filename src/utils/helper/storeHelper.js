
import dayjs from 'dayjs'
import { find, flatMap } from 'lodash-es'
import useStore from "@/stores/index.js"
export function verificationToken () {
  // 1：安全可用；0：临近过期；-1：已过期
  const { app } = useStore()
  if (app.getToken) {
    const { expiresIn = 0, tokenType } = app.authInfo ?? {}
    const diff = dayjs.unix(Number(expiresIn)).diff(undefined, 's')

    const expiration = app.authInfo?.expiration || 3600

    // 防止值过大，造成无限刷新token的问题
    // expiration = expiration > 23 * 3600 ? 3600 : expiresIn

    if (tokenType === 1) {
      return diff > expiration ? 1 : diff > 0 ? 0 : -1
    } else {
      // 处理短效token
      return diff > 0 ? 1 : 0
    }
  } else {
    return -1
  }
}
