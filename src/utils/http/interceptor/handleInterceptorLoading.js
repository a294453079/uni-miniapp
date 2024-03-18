
import { Loading } from '../plugins/Loading'

export default function (instance) {
  let reqId
  let respId

  // 这里可以作为全局默认设置
  const loadingInstance = new Loading()

  const apply = () => {
    let activeId
    reqId = instance.interceptors.request.use((config) => {
      activeId = loadingInstance.show(config.loading)
      return config
    })

    respId = instance.interceptors.response.use(
      (response) => {
        loadingInstance.hide(activeId)
        return response
      },
      (error) => {
        loadingInstance.hide(activeId)
        return Promise.reject(error)
      }
    )
  }

  const eject = () => {
    instance.interceptors.request.eject(reqId)
    instance.interceptors.response.eject(respId)
  }

  apply()

  return {
    apply,
    eject
  }
}
