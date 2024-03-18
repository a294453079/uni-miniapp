export * from './tools'
export * from './helper/storeHelper'
export * from './helper/uniHelper'
export * from './asyncPromise'
export * from './http'
// 定时器方案
export function throttle(fn, wait) {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    if (!timer) {
      timer = setTimeout(function () {
        fn.apply(context, args)
        timer = null
      }, wait)
    }
  }
}

