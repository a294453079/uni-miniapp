import { isPlainObject } from 'lodash-es'


export class Loading {
   times = 0
   timer = null
   enabled = true
   config
   activeId
  /* 由谁来取消，默认1:定时器，2:请求结束 */
   cancelMode = 1

  constructor(config = true) {
    if (!config) {
      this.enabled = false
      this.config = {}
    } else {
      this.config = Object.assign(
        {
          text: '努力加载中~',
          delay: 300,
          duration: 500
        },
        typeof config === 'object' ? config : {}
      )
    }
  }

   getConfig(opt = true) {
    return Object.assign({}, this.config, isPlainObject(opt) ? opt : {})
  }

  show(opt = true) {
    if (!opt || !this.enabled) return
    uni.showNavigationBarLoading()
    const { text, duration, delay } = this.getConfig(opt)

    const activeId = Date.now()

    this.timer && clearTimeout(this.timer)
    this.times++

    this.timer = setTimeout(() => {
      this.activeId = activeId
      uni.showLoading({
        title: text,
        mask: true
      })

      this.cancelMode = 1
      setTimeout(() => {
        // 如果触发loading的请求已经提前结束，则activeId为空,则结束loading状态
        if (!this.activeId) uni.hideLoading()
        else this.cancelMode = 2
      }, duration)
    }, delay)

    return activeId
  }

  hide(activeId) {
    if (!activeId) return
    this.times--

    // console.log('this', this.activeId, 'act', activeId)

    if (this.times <= 0) {
      uni.hideNavigationBarLoading()
      this.timer && clearTimeout(this.timer)
      this.times = 0

      // 保险起见
      setTimeout(() => {
        uni.hideLoading()
      }, this.config.duration)
    }

    // 激活loading状态的请求已经结束
    if (activeId === this.activeId) {
      this.activeId = undefined

      if (this.cancelMode === 2) {
        // 代表当次请求超过指定的等待时间,需要在这里关闭loading
        uni.hideLoading()
      }
    }
  }
}
