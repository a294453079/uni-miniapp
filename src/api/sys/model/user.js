/**
 * 此文件用于填写相关获取用户信息的接口，不同小程序需要获取的信息不一样
 */
import { http } from '@/utils'


const UserApi = {
  info : '/wpc-return-visit/tdapolicerelatives/personInfo'
}

/* 获取我的用户信息 */
export async function getUserInfo() {
  return await http.get(UserApi.info)
}
