import { http } from '@/utils'

/**获取课堂回顾列表 */
export async function getClassCoursesHistory(data) {
  return await http.post('/app-teach/classCoursesHistory/pageClassCoursesHistory',data)
}
/**根据学校 获取学科列表 */
export async function getCourseBySchoolId(data) {
  return await http.post('/app-teach/samples/course-information/getCourseBySchoolId', data, {
    joinParamsToUrl:true
  })
}
/**课堂回顾三个接口 获取详情基本信息数据 classCoursesHistoryId */
export async function getClassCoursesBaseData(data) {
  return await http.get('/app-teach/classCoursesHistory/getBaseData', data)
}
/**获取课堂资源数据 classCoursesHistoryId */
export async function getClassCoursesHistoryResourceList(data) {
  return await http.get('/app-teach/classCoursesHistoryResource/getClassCoursesHistoryResourceList', data)
}
/**获取课堂实录、板书数据 classCoursesHistoryId */
export async function getTeachResources(data) {
  return await http.get('/app-teach/classCoursesHistory/getTeachResources', data)
}