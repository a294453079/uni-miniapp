import { isEqual } from 'lodash-es'

export const CACHE_KEY = {
  SYS_SETTING: '_MINIAPP__SYS_SETTING__',
  MENU_BUTTON_BOUNDING: '_MINIAPP__MENU_BUTTON_BOUNDING__'
}

export function getSystemSetting(
  isRefresh = false
) {
  let cacheData = uni.getStorageSync(CACHE_KEY.SYS_SETTING)
  if (isRefresh || !cacheData) {
    cacheData = uni.getSystemInfoSync()
    uni.setStorageSync(CACHE_KEY.SYS_SETTING, cacheData)
    return cacheData
  } else {
    uni.getSystemInfo({
      success: (result) => {
        if (!isEqual(cacheData, result)) {
          uni.setStorageSync(CACHE_KEY.SYS_SETTING, result)
        }
      }
    })
  }
  return cacheData
}

export function getMenuButtonBoundingRect(
  isRefresh = false
) {

  let cacheData = uni.getStorageSync(CACHE_KEY.MENU_BUTTON_BOUNDING)
  if (isRefresh || !cacheData) {
    console.log('进11111111111');
    cacheData = uni.getMenuButtonBoundingClientRect()
    uni.setStorageSync(CACHE_KEY.MENU_BUTTON_BOUNDING, cacheData)
    return cacheData
  } else {
      console.log('进22222222222');
    const result = uni.getMenuButtonBoundingClientRect()
    console.log(result,'--',cacheData);
    if (!isEqual(cacheData, result)) {
      uni.setStorageSync(CACHE_KEY.MENU_BUTTON_BOUNDING, result)
    }
  }
  return cacheData
}
