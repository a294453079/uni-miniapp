import { http } from '@/utils'
/* 获取公共key */

export async function getPublicKey () {
  return await http.get(
   '/oauth-server/oauth/publicKey',
    {},
    {ignoreCheckToken:true}
    // { joinParamsToUrl: true }
  )
}