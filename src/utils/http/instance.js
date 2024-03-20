import Ajax, {  Fetcher } from 'uni-ajax'

import { useGlobalSetting } from '@/settings'

import handleInterceptorLoading from './interceptor/handleInterceptorLoading'
import handleRequestToken from './interceptor/handleRequestToken'
import handleRequestParameter from './interceptor/handleRequestParameter'
import handleRespResult from './interceptor/handleRespResult'

const { apiUrl } = useGlobalSetting()

export const fetcher = new Fetcher()

console.log('fetcher',fetcher);

// let ajaxObj = {}
// const requestInstance = new Proxy(ajaxObj, {
//   get: () => {
//     console.log('read',getRequestInstance());
//     return getRequestInstance()
//   },
// });
// const getRequestInstance = () => {
//   if (!Object.keys(ajaxObj).length) {
//     ajaxObj = Ajax.create({
//       baseURL: apiUrl,
//       dataType: 'json',
//       timeout: 60 * 1000,
//       header: {
//         Authorization: `Bearer 2df167e8-2b56-4c6c-a34d-fdf923e1b02e`
//       },
//       fetcher
//     })
//     ajaxObj.interceptors.request.use((config) => {
//       console.log('------', config);
//       return config
//     })
//     handleInterceptorLoading(ajaxObj)
//     handleRequestToken(ajaxObj)
//     handleRequestParameter(ajaxObj) 
//     handleRespResult(ajaxObj)
//     return ajaxObj
//   }
//   return ajaxObj
// }
  const requestInstance = Ajax.create({
  baseURL: apiUrl,
  dataType: 'json',
  timeout: 60 * 1000,
  // header: {
  //   Authorization: `Basic ${token}`
  // },
  fetcher
})
 
setTimeout(() => {

  // handleInterceptorLoading(requestInstance)
  // handleRequestToken(requestInstance)
  // handleRequestParameter(requestInstance)
  // handleRespResult(requestInstance)
}, 0)

// handleInterceptorLoading(requestInstance)
// setTimeout(() => {
//   handleRequestToken(requestInstance)
//   // handleRequestParameter(requestInstance)
//   handleRespResult(requestInstance)
// }, 0)

export { requestInstance  as http }
