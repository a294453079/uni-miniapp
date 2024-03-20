import { merge } from 'lodash-es'
import { AuthApi } from '@/api/sys/auth'
import { reqUrlMatch, useGlobalSetting } from '@/settings'
import {  http } from '@/utils'
import { AsyncPromise } from '@/utils/asyncPromise'
import { verificationToken } from "@/utils/helper/storeHelper.js"
import userStore from "@/stores/index.js"
import { IGNORE_ERROR } from '../const'
import { showModal } from '@/utils'
export default function (instance) {
  let reqId
  let respId

  let isRefreshing = false // 当前是否在请求刷新 Token

  let requestQueue = [] // 将在请求刷新 Token 中的请求暂存起来，等刷新 Token 后再重新请求
  const {userInfoStore} = userStore();

  // 执行暂存起来的请求
  const executeQueue = (error) => {
    for (const promise of requestQueue) {
      if (error) {
        console.log('error',error);
        promise.reject(error)
      } else {
        promise.resolve(null)
      }
    }
    requestQueue = []
    console.log('存请求', requestQueue);
  }

  // 刷新 Token 请求处理,多个请求将拦截结果
  const refreshToken = async () => {
    console.log('刷新toekn',isRefreshing);
    // 如果当前是在请求刷新 Token 中，则将期间的请求推到等待队列
    if (isRefreshing) {
      const Promise = new AsyncPromise()
      requestQueue.push(Promise)
      console.log('刷新时候存请求',requestQueue);
      return Promise.promise
    }

    isRefreshing = true
    // 发起刷新 Token 请求，成功或失败都将执行队列中的请求

    try {
      await userInfoStore.Login()
      executeQueue()
    } catch (e) {
      executeQueue(e)
    } finally {
      isRefreshing = false
    }
  }

  const apply = () => {
    reqId = instance.interceptors.request.use(async (config) => {
      console.log('token拦截层', config);
      if (reqUrlMatch(config.url) || config.ignoreCheckToken) {
        return config
      }
      // 退出登陆时单独处理
      if (config.url === AuthApi.Logout) {
        config.header = {
           Authorization: `Bearer ${userInfoStore.getToken}`,
          // 'blade-auth': `bearer ${app.getToken}`,
          ...config.header,
        }
        return config
      }

      const code = verificationToken()
      const { checkAuth } = useGlobalSetting()
      if (checkAuth && code < 0) {
        userInfoStore.Logout()
        return Promise.reject({
          message: 'Unauthorized, Login required',
          config,
        })
      } else if ((!checkAuth && code < 1) || (checkAuth && code === 0)) {
        await refreshToken()
      }
      config.header = {
        Authorization: `Bearer ${userInfoStore.getToken}`,
        ...config.header,
      }
      
      return config
    })
    respId = instance.interceptors.response.use(undefined, (error) => {
      console.log('token响应层',error);
      const { config, statusCode ,data} = error
      const { checkAuth } = useGlobalSetting()

      // 处理401错误
      if (statusCode === 401) {
        if (checkAuth) {
          userInfoStore.Logout()
          return Promise.reject(merge(error, { [IGNORE_ERROR]: true }))
        } else {
          return refreshToken().then(() => http(config))
        }
      }

      if (data.code === 400) {
         showModal({
          title: '提示',
          content: data.msg,
          showCancel: false,
        })
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
