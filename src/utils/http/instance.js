import Ajax, {  Fetcher } from 'uni-ajax'

import { useGlobalSetting } from '@/settings'

import handleInterceptorLoading from './interceptor/handleInterceptorLoading'
import handleRequestParameter from './interceptor/handleRequestParameter'
import handleRequestToken from './interceptor/handleRequestToken'
import handleRespResult from './interceptor/handleRespResult'

const { apiUrl } = useGlobalSetting()

export const fetcher = new Fetcher()


let ajaxObj = {}

let requestInstance = new Proxy(ajaxObj, {
  get: () => {
    return getRequestInstance()
  }
});
  const getRequestInstance = () => {
  if (!Object.keys(ajaxObj).length) {
    ajaxObj = Ajax.create({
      baseURL: apiUrl,
      dataType: 'json',
      timeout: 60 * 1000,
      header: {
        Authorization: `Bearer 2df167e8-2b56-4c6c-a34d-fdf923e1b02e`
      },
      fetcher
    })
    //  handleInterceptorLoading(ajaxObj)
    handleRequestToken(ajaxObj)
    // handleRequestParameter(ajaxObj)
    handleRespResult(ajaxObj)
    return ajaxObj
  }
  return ajaxObj
}
// handleInterceptorLoading(requestInstance)
// setTimeout(() => {
//   handleRequestToken(requestInstance)
//   // handleRequestParameter(requestInstance)
//   handleRespResult(requestInstance)
// }, 0)

export { requestInstance  as http }
