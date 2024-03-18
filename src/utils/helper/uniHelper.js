import { isPlainObject, merge } from 'lodash-es'

import { pageUrlMatch, pageWhiteList, useGlobalSetting } from '@/settings'
import useStore  from '@/stores'
import { toPromise } from '@/utils'

/**
 * 延迟执行
 * @param {number} [timeout=1500] 延迟时间（单位毫秒）
 * @returns {Promise<void>} 返回Promise.resolve
 *  */
export async function sleep(timeout = 1500){
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

/** 提示模态框（无取消按钮） */
export async function showModal(
  options = {}
) {
  const opt = merge(
    {
      title: '温馨提示'
    },
    isPlainObject(options) ? options : { content: options  }
  )

  return toPromise(uni.showModal, opt)
}

/** 删除警告 */
export function showModalDelete(options = {}) {
  options.content = options.content || '您确定删除吗？'
  options.confirmColor = '#ff0000'
  options.confirmText = '删除'

  return showModal(options)
}

/** 提示 */
export function showToast(
  options = {}
){
  const opt = merge(
    { icon: 'none', mask: true, duration: 1000 } ,
    isPlainObject(options) ? options : { title: options }
  )

  uni.showToast(opt)
  return sleep(opt.duration)
}

/**
 * 检测小程序更新
 *
 * @since 1.0.0
 * @returns {void}
 */
export function getUpdate() {
  const updateManager = uni.getUpdateManager()

  updateManager.onUpdateReady(function () {
    uni.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success(res) {
        if (res.confirm) {
          updateManager.applyUpdate()
        }
      }
    })
  })
}

export function checkAuth (path) {
  const { app } = useStore()
  const { checkAuth } = useGlobalSetting()
  if (!checkAuth) return
  // if (pageUrlMatch(path)) return 白名单
  if (app.hasLogin) return
  return app.Logout()
}
