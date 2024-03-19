import { isNull, isUndefined, merge, omit, omitBy, pick } from 'lodash-es'

import { reqUrlMatch } from '@/settings'

export default function (instance) {
  let reqId
  const apply = () => {
    console.log('进来吧');
    reqId = instance.interceptors.request.use((config) => {
      if (reqUrlMatch(config.url)) return config

      const { joinParamsToUrl = false, ignoreParameter = [] } = config

   
      if (ignoreParameter !== true) {
        const keys = !Array.isArray(ignoreParameter)
          ? []
          : ignoreParameter.filter(Boolean)
        keys.length && (extraData = omit(extraData, keys))
      } else {
        extraData = {}
      }

      extraData.apiUrl && (config.baseURL = extraData.apiUrl)
      extraData = omit(extraData, 'apiUrl')

      /*
       * 参数合并说明 字段详细见：https://uniajax.ponjs.com/api/config
       * 当请求为 get delete 且 data 含有数据，query 会被舍弃，导致值被设为 data 的数据。（由于uni.request api 接口的问题）
       * 所以此时将空值过滤掉，避免出现值被覆盖问题。
       */
      config.header = omitBy(
        merge(
          pick(extraData, ['baseAppId', 'appId', 'appCode']),
          config.header
        ),
        (o) => isUndefined(o) || isNull(o)
      )

      if (
        joinParamsToUrl ||
        ['get', 'delete', 'head', 'options', 'trace'].includes(
          config.method?.toLowerCase()
        )
      ) {
        config.query = omitBy(
          merge({}, extraData, config.query, config.data),
          (o) => isUndefined(o) || isNull(o)
        )
        config.data = undefined
      } else {
        config.data = omitBy(
          merge({}, extraData, config.data),
          (o) => isUndefined(o) || isNull(o)
        )
      }

      return config
    })
  }

  const eject = () => {
    instance.interceptors.request.eject(reqId)
  }

  apply()

  return {
    apply,
    eject
  }
}
