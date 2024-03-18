
import { showModal } from '@/utils'

import { IGNORE_ERROR } from '../const'

export default function (instance) {
  let respId
  let respId2

  const apply = () => {
    respId = instance.interceptors.response.use((response) => {
      const { isReturnNativeResponse = false, isTransformResponse = true } =
        response.config

      // 返回原始响应内容
      if (isReturnNativeResponse) {
        return response
      }

      // 不处理返回内容时
      if (!isTransformResponse) {
        return response.data
      }

      // 没有正确的返回响应内容
      if (!response.data) {
        response.errMsg = '请求出错，请稍候重试！'
        return Promise.reject(response)
      }

      const { code, data: result, success } = response.data

      if (success && code === 200) {
        return result
      }

      return Promise.reject(response)
    })

    respId2 = instance.interceptors.response.use(undefined, (error) => {
      const { config, errMsg, data, statusCode } = error

      // 忽略相关处理
      if (
        error[IGNORE_ERROR] ||
        config.ignoreHandleError ||
        statusCode === 400
      ) {
        return Promise.reject(error)
      }

      let msgText = errMsg

      if (errMsg.includes('request:fail')) {
        msgText = '网络异常，请检查您的网络连接是否正常!'
      }

      if (data.msg) {
        msgText = data.msg
      } else {
        switch (statusCode) {
          case 401:
            msgText = '401: 用户没有权限（令牌、用户名、密码错误）！'
            break
          case 403:
            msgText = '403: 访问被禁止！'
            break
          case 404:
            msgText = '404: 网络请求错误，未找到该资源！'
            break
          case 405:
            msgText = '405: 网络请求错误，请求方法未允许！'
            break
          case 408:
            msgText = '网络请求超时！'
            break
          case 500:
            msgText = '500: 服务器错误，请联系管理员！'
            break
          case 503:
            msgText = '503: 服务不可用，服务器暂时过载或维护！'
            break
          case 504:
            msgText = '504: 网络超时！'
            break
        }
      }

      showModal({
        title: '请求错误提示',
        content: msgText,
        showCancel: false
      })
      return Promise.reject(error)
    })
  }

  const eject = () => {
    instance.interceptors.response.eject(respId)
    instance.interceptors.response.eject(respId2)
  }

  apply()

  return {
    apply,
    eject
  }
}
