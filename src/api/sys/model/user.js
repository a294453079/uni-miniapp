/**
 * 此文件用于填写相关获取用户信息的接口，不同小程序需要获取的信息不一样
 */
import { http } from '@/utils'


const UserApi = {
  info : '/user-server/users/getUserInfo'
}

/* 获取我的用户信息 */
export async function getUserInfo(data) {
  return await http.get(UserApi.info,data)
}
/**获取班级信息 */
export async function getStudentClassInfo(data) {
  return await http.get('/app-teach/student/getStudentClass',data)
}
/**获取学期信息 */
export async function getSemesterInfo(data) {
  return await http.get('/app-teach/samples/semester/list',data)
}