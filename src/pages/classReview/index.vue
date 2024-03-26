<template>
  <view class="page">
    <image src="/static/blueBg2.png" class="bg-image" mode="top" />
    <view>
      <navbar title="课堂回顾" :titleStyle="{
        color: '#fff',
        fontSize: '36rpx',
        fontWeight: 'bold',
      }">
      </navbar>
    </view>
    <view class="selectFrom">
      <view class="selectFrom_item flex">
        <view class="select_label" @click="handleSubject">{{ courseData.name }}</view>
        <u-picker :show="showSubject" :columns="courseColumns" @confirm="handleSubjectConfirm"
          @cancel="handleSubjectCancel" keyName="name"></u-picker>
        <u-icon v-if="!showSubject" name="arrow-down" color="#B0B8C7" size="26rpx" @click="handleSubject"></u-icon>
        <u-icon v-else name="arrow-up" color="#B0B8C7" size="26rpx" @click="handleSubject"></u-icon>
        <view class="lineStyle">|</view>
        <view class="select_label" @click="handleSemester">{{ semesterData.year }}</view>
        <u-picker :show="showSemester" :columns="semesterColumns" @confirm="handleSemesterConfirm"
          @cancel="handleSemesterCancel" keyName="year"></u-picker>
        <u-icon v-if="!showSemester" name="arrow-down" color="#B0B8C7" size="26rpx" @click="handleSemester"></u-icon>
        <u-icon v-else name="arrow-up" color="#B0B8C7" size="26rpx" @click="handleSemester"></u-icon>
      </view>
      <view class="selectFrom_item">
        <view class="select_text">{{ timeList[0].time }}</view>
        <view class="select_date">至</view>
        <view class="select_text">{{ timeList[1]?.time }}</view>
        <view class="lineDateStyle">|</view>
        <img class="w-44rpx h-44rpx" src="@/static/classReview/calendar.png" @click="showCalendar = true">
        <!-- <up-calendar :show="showCalendar" :mode="mode" @confirm="handleConfirmCalendar" @close="showCalendar = false"
          monthNum="72"></up-calendar> -->

      </view>
    </view>

    <PagesContainer :loading="pageLoading" hasCustomNavbar :customHeight="148" scrollContainer scrollRefresher
      scrollToLowerAllow @scrollToLower="onNextPage" @onRefresh="onRefreshPage">
      <view class="listStyle" v-if="pageList.length">
        <view class="listItemStyle" v-for="item in pageList" :key="item.classCoursesHistoryId"
          @click="hangleDetail(item)">
          <view class="titleStyle">
            {{ item.subjectName }}
            <span class="subtitle ml-12rpx mr-6rpx">/</span>
            <span class="subtitle">{{ item.teacherName }}</span>
          </view>
          <viw class="classInfo">
            <view class="mr-6rpx">第{{ item.weekNumber }}周</view>
            <view>{{ item.week }}{{ item.periodTime }}第{{ ToChinese(item.section) }}节</view>
            <view>（{{ item.date }}）</view>
          </viw>
        </view>
      </view>
      <view v-else class="empty">
        <hEmpty text="暂无课堂回顾" />
      </view>
    </PagesContainer>
    <!-- 日历弹窗 -->
    <u-popup :show="showCalendar" round="32rpx" @close="showCalendar = false">
      <view>
        <hCalendar :scheduleTabsactive="scheduleTabsactive" @changeDay="changeDay" @weekChange="weekChange"
          :selectedActiveList="calendarList" @closeDay="showCalendar = false" />
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import hEmpty from '@/components/common/h-empty.vue'
import { ToChinese } from '@/utils/tools'
import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'
import { getSemesterInfo } from '@/api/sys/model/user'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import PagesContainer from '@/components/pages-container/pages-container.vue'
import navbar from '@/components/navbar/navbar.vue';
import { shallowRef, reactive, ref, computed } from 'vue'
import { getClassCoursesHistory, getCourseBySchoolId } from './service'
import { usePagination } from '@/utils/usePagination.js'
import hCalendar from '@/components/common/h-calendar.vue'
import userStore from "@/stores/index.js"
const { userInfoStore } = userStore();
const pageLoading = shallowRef(false)
const showSubject = shallowRef(false)
const showSemester = shallowRef(false)
const mode = shallowRef('range');
const semesterData = reactive({ year: '请选择学期', id: '' })
const courseData = reactive({ name: '全部学科', id: '' })
// const courseList = ref([])
const pageList = computed(() => {
  return pageData.payload.data
})
const showCalendar = shallowRef(false)
const calendarList = shallowRef([
  {
    timeStamp: dayjs(userInfoStore.semesterInfo?.createdate).unix() * 1000,
    time: userInfoStore.semesterInfo?.createdate
  },
  {
    timeStamp: dayjs(userInfoStore.semesterInfo?.enddate).unix() * 1000,
    time: userInfoStore.semesterInfo?.enddate
  }])

let timeList = shallowRef(cloneDeep(calendarList.value))
const scheduleTabsactive = shallowRef(2) // 课表高亮
const dateTabsActive = ref(1) // 日期高亮
const form = reactive({
  semesterId: '',
  studentId: userInfoStore.userInfo.studentId,
  schoolId: userInfoStore.userInfo.orgId,
  classId: userInfoStore.classInfo.id,
  courseId: '',
  startDate: timeList.value[0].time,
  endDate: timeList.value[1].time,
})
const semesterColumns = ref([
  [{
    year: '2000',
    id: 1
  }]
]);
const courseColumns = ref([
  [{
    name: '语文',
    id: 1
  }]
]);
const handleSubject = () => {
  showSubject.value = !showSubject.value
}
const handleSemester = () => {
  showSemester.value = !showSemester.value
}
/**确认学科选择 */
const handleSubjectConfirm = (e) => {
  courseData.id = e.value[0].id
  courseData.name = e.value[0].name
  form.courseId = courseData.id
  showSubject.value = !showSubject.value
  getData(true)
}
const handleSubjectCancel = () => {
  showSubject.value = !showSubject.value
}
/**确认学期选择 */
const handleSemesterConfirm = (e) => {
  /**semester为1是下学期 0是上学期 */
  semesterData.id = e.value[0].id
  semesterData.year = e.value[0].year
  form.semesterId = semesterData.id
  showSemester.value = !showSemester.value
  getData(true)
}
const handleSemesterCancel = () => {
  showSemester.value = !showSemester.value
}

// 保存日期
const changeDay = async (e) => {
  if (calendarList.value.length === 2) {
    calendarList.value = []
  }
  calendarList.value.push(e.item)

  if (calendarList.value.length === 2) {
    showCalendar.value = false
    timeList.value = cloneDeep(calendarList.value)
    form.startDate = timeList.value[0].time
    form.endDate = timeList.value[1].time
    getData(true)
  }
  // showCalendar.value = false
}

const pageData = usePagination(getClassCoursesHistory)

onLoad(async () => {
  uni.showLoading()
  await getSemesterList()
  await getPageCourseBySchoolId()
  form.courseId = courseColumns.value[0][0].id
  form.semesterId = semesterColumns.value[0][0].id
  console.log('学期', semesterColumns.value);
  semesterData.year = semesterColumns.value[0][0].year
  getData(true)
})
const getData = async (reset = false) => {
  uni.hideLoading()
  const result = await pageData.run(reset, form)
  return result
}
const onNextPage = () => {
  getData()
}
const onRefreshPage = () => {
  console.log('刷新页面');
  uni.showLoading()
  getData(true)
}

onReachBottom(() => {
  uni.showLoading()
  getData()
  console.log('分割线底部------------');
})



const getSemesterList = async () => {
  console.log(userInfoStore.userInfo.orgId);
  const { obj } = await getSemesterInfo({
    schoolId: userInfoStore.userInfo.orgId
  })
  /**semester为1是下学期 0是上学期 */
  semesterColumns.value = [obj.map(item => ({
    ...item,
    year: `${item.year + '学年'}${item.semester == 0 ? '上学期' : '下学期'}`
  }))]
}
const getPageCourseBySchoolId = async () => {
  const { obj } = await getCourseBySchoolId({
    schoolId: userInfoStore.userInfo.orgId
  })
  obj.unshift({
    name: '全部学科',
    id: ''
  })
  courseColumns.value = [obj]
}
// const getPageClassCoursesHistory = async () => {
//   const { obj } = await getClassCoursesHistory(form)
//   console.log('课堂回顾列表', obj);
//   courseList.value = obj.records
// }

// const minDate = dayjs().subtract(3, 'year').startOf('year');
// const maxDate = dayjs().add(3, 'year').startOf('year');
const handleConfirmCalendar = (e) => {
  console.log('确定日历', e);
  showCalendar.value = false
}
// 查看详情
const hangleDetail = (e) => {
  console.log('查看详情', e.classCoursesHistoryId);
  uni.navigateTo({
    url: `/pages/classReview/detail?classCoursesHistoryId=${e.classCoursesHistoryId}`,
  })
}


</script>

<style scoped lang="scss">
.page {
  .selectFrom {
    .selectFrom_item {
      display: flex;
      box-sizing: border-box;
      height: 96rpx;
      align-items: center;
      padding: 32rpx 44rpx;

      .select_label {
        font-size: 28rpx;
        line-height: 32rpx;
        color: #333;
        margin-right: 40rpx;
      }

      .lineStyle {
        color: #E5E5E5;
        width: 2rpx;
        margin: 0px 62rpx;
      }

      .select_date {
        color: #B0B8C7;
        font-size: 28rpx;
        margin: 0rpx 52rpx;
      }

      .select_text {
        color: #333333;
        font-size: 28rpx;
      }

      .lineDateStyle {
        color: #E5E5E5;
        width: 2rpx;
        margin: 0px 70rpx;
      }
    }
  }

  .listStyle {
    background: #F7F7F8;
    padding: 32rpx;

    .listItemStyle {
      padding: 40rpx 40rpx 36rpx 40rpx;
      background: #fff;
      border-radius: 32rpx;
      margin-bottom: 32rpx;

      .titleStyle {
        font-size: 40rpx;
        color: #333333;
        font-weight: 900;

        .subtitle {
          font-size: 30rpx;
          color: #B0B8C7;
          font-weight: 500;
        }
      }

      .classInfo {
        margin-top: 32rpx;
        display: flex;
        align-items: center;
        color: #333;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 44rpx;
      }
    }

  }

  .bg-image {
    background: url('/static/blueBg2.png') no-repeat top #f9f9f9;
    position: fixed;
    top: 0;
    left: 0;
    height: 222rpx !important;
    width: 100%;
    z-index: -1;
    pointer-events: none;
  }

  .empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
