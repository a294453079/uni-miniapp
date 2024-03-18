import { merge } from 'lodash-es'
import pinia from '@/stores/pinia'
import { appStore } from "@/stores/modules/app.js"

import { AuthApi } from '@/api/sys/auth'
import { reqUrlMatch, useGlobalSetting } from '@/settings'
import { AsyncPromise, http, verificationToken } from '@/utils'

import { IGNORE_ERROR } from '../const'

export default function (instance) {
  let reqId
  let respId

  let isRefreshing = false // 当前是否在请求刷新 Token
  let requestQueue = [] // 将在请求刷新 Token 中的请求暂存起来，等刷新 Token 后再重新请求
  

  // const store = appStore(pinia);
  
  // const { app } = appStore();
  // console.log('app1-', store);
  console.log('AsyncPromise',AsyncPromise)
  // 执行暂存起来的请求
  const executeQueue = (error) => {
    for (const promise of requestQueue) {
      if (error) {
        promise.reject(error)
      } else {
        promise.resolve(null)
      }
    }

    requestQueue = []
  }

  // 刷新 Token 请求处理,多个请求将拦截结果
  const refreshToken = async () => {
    // 如果当前是在请求刷新 Token 中，则将期间的请求推到等待队列
    if (isRefreshing) {
      const Promise = new AsyncPromise()
      requestQueue.push(Promise)
      return Promise.promise
    }

    isRefreshing = true
    // 发起刷新 Token 请求，成功或失败都将执行队列中的请求

    try {
      await app.Login()
      executeQueue()
    } catch (e) {
      executeQueue(e)
    } finally {
      isRefreshing = false
    }
  }

  const apply = () => {
    reqId = instance.interceptors.request.use(async (config) => {
      if (reqUrlMatch(config.url) || config.ignoreCheckToken) {
        return config
      }

      // 退出登陆时单独处理
      if (config.url === AuthApi.Logout) {
        config.header = {
          'blade-auth': `bearer ${app.getToken}`,
          ...config.header,
        }
        return config
      }

      const code = verificationToken()

      const { checkAuth } = useGlobalSetting()
      if (checkAuth && code < 0) {
        app.Logout()
        return Promise.reject({
          message: 'Unauthorized, Login required',
          config,
        })
      } else if ((!checkAuth && code < 1) || (checkAuth && code === 0)) {
        await refreshToken()
      }
      config.header = {
        'blade-auth': `bearer ${app.getToken}`,
        ...config.header,
      }
      return config
    })

      respId = instance.interceptors.response.use(undefined, (error) => {
      const { config, statusCode } = error
      const { checkAuth } = useGlobalSetting()

      // 处理401错误
      if (statusCode === 401) {
        if (checkAuth) {
          app.Logout()
          return Promise.reject(merge(error, { [IGNORE_ERROR]: true }))
        } else {
          return refreshToken().then(() => http(config))
        }
      }

      return Promise.reject(error)
    })
  }

  const eject = () => {
    instance.interceptors.request.eject(reqId)
    instance.interceptors.response.eject(respId)
  }

  apply()

  return {
    apply,
    eject,
  }
}
