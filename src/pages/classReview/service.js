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
/**课堂回顾详情 classCoursesHistoryId */
export async function getClassCoursesHistoryDetail(data) {
  return await http.get('/app-teach/classCoursesHistory/getBaseData', data)
}
/**课堂回顾详情 classCoursesHistoryId */
export async function getClassCoursesHistoryDetail(data) {
  return await http.get('/app-teach/classCoursesHistory/getBaseData', data)
}