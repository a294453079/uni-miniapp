import Ajax, { AjaxRequestConfig, Fetcher } from 'uni-ajax'

import { useGlobalSetting } from '@/settings'

import handleInterceptorLoading from './interceptor/handleInterceptorLoading'
import handleRequestParameter from './interceptor/handleRequestParameter'
import handleRequestToken from './interceptor/handleRequestToken'
import handleRespResult from './interceptor/handleRespResult'

const { apiUrl } = useGlobalSetting()

export const fetcher = new Fetcher()

const requestInstance = Ajax.create<AjaxRequestConfig>({
  baseURL: apiUrl,
  dataType: 'json',
  timeout: 60 * 1000,
  header: {
    Authorization: `Bearer`
  },
  fetcher
})

// handleInterceptorLoading(requestInstance)
handleRequestToken(requestInstance)
// handleRequestParameter(requestInstance)
// handleRespResult(requestInstance)

export default requestInstance
export { requestInstance }
