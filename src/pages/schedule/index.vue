<template>
  <view class="schedule">
    <image src="/static/blueBg2.png" class="bg-image" mode="top" />
    <navbar
      title="课程表"
      :titleStyle="{
        color: '#fff',
        fontSize: '36rpx',
        fontWeight: 'bold',
      }"
    ></navbar>
    <view class="schedule-tabs">
      <view v-for="(item, index) in scheduleTabs" :key="index" @click="changeScheduleTabs(index)">
        <text class="lable">{{ item }}</text>
        <text
          class="before"
          :style="{
            background: scheduleTabsactive == index ? '#fff' : '',
            opacity: scheduleTabsactive == index ? '1' : '0',
          }"
        ></text>
      </view>
    </view>
    <view class="content">
      <u-sticky offset-top="0">
        <view class="sticky" v-if="scheduleTabsactive == 0">
          <view class="date-tabs">
            <text
              v-for="(item, index) in dateTabs"
              :key="index"
              :class="dateTabsActive == index ? 'date-tabs-active' : ''"
              @click="changeDateTabs(item, index)"
              >{{ item.name }}</text
            >
          </view>
          <view class="date" @click="isShowHCalendar = true">
            <img class="w-40rpx h-40rpx" src="@/static/schedule/date-icon.png" alt="" />
            <text>{{ dayTime }}</text>
          </view>
        </view>
        <view class="sticky items-center" v-if="scheduleTabsactive == 1">
          <view class="date flex-1" @click="isShowHCalendar = true">
            <img class="w-40rpx h-40rpx" src="@/static/schedule/date-icon.png" alt="" />
            <text>{{ weekTime }}</text>
          </view>
          <img
            @click="isShowWeekScheduleTip = true"
            class="w-48rpx h-48rpx ml-42rpx mr-12px"
            src="@/static/schedule/tip-icon.png"
            alt=""
          />
        </view>
        <!-- 周课表状态提示弹框 -->
        <u-popup :show="isShowWeekScheduleTip" round="32rpx">
          <view class="week-schedule-tip">
            <view class="close">
              <text>图表解释</text>
              <img
                class="w-48rpx h-48rpx"
                @click="isShowWeekScheduleTip = false"
                src="@/static/calendar/close-icon.png"
                alt=""
              />
            </view>
            <view class="tip-label">
              <view class="mt-32rpx">
                <text></text>
                <text class="text-30rpx leading-32rpx ml-16rpx">时间已过</text>
              </view>
              <view class="mx-80rpx mt-32rpx">
                <text></text>
                <text class="text-30rpx leading-32rpx ml-16rpx">下节课</text>
              </view>
              <view class="mt-32rpx">
                <text class="triangle">
                  <text></text>
                </text>
                <text class="text-30rpx leading-32rpx ml-16rpx">出勤</text>
              </view>
              <view class="mt-48rpx">
                <text class="triangle">
                  <text style="border-top: 16rpx solid #f66969"></text>
                </text>
                <text class="text-30rpx leading-32rpx ml-16rpx">缺勤</text>
              </view>
              <view class="ml-140rpx mt-48rpx">
                <text class="triangle">
                  <text style="border-top: 16rpx solid #40cc8a"></text>
                </text>
                <text class="text-30rpx leading-32rpx ml-16rpx">请假</text>
              </view>
            </view>
          </view>
        </u-popup>
        <!-- 日历弹窗 -->
        <u-popup :show="isShowHCalendar" round="32rpx">
          <view>
            <hCalendar
              :key="componentsKey"
              :scheduleTabsactive="scheduleTabsactive"
              @changeDay="changeDay"
              @weekChange="weekChange"
              @closeDay="isShowHCalendar = false"
            />
          </view>
        </u-popup>
      </u-sticky>
      <!-- 日课表 -->
      <daySchedule
        v-show="scheduleTabsactive == 0"
        :dayClassCoursesByStudentPropsList="dayClassCoursesByStudentPropsList"
        :isShowMore="false" class="flex-1 flex"
      />
      <!-- 周课表 -->
      <weekSchedule v-show="scheduleTabsactive == 1" :classCoursesWeekList="classCoursesWeekList" />
    </view>
  </view>
</template>

<script setup>
  import navbar from '@/components/navbar/navbar.vue'
  import hCalendar from '@/components/common/h-calendar.vue'
  import daySchedule from '@/components/schedule/daySchedule.vue'
  import weekSchedule from '@/components/schedule/weekSchedule.vue'
  import dayjs from 'dayjs'
  import { http } from '@/utils'
  import { ref, onMounted } from 'vue'
  const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
  const scheduleTabs = ['日课程表', '周课程表']
  const dateTabs = [
    {
      name: '昨天',
      date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    },
    {
      name: '今天',
      date: dayjs().format('YYYY-MM-DD'),
    },
    {
      name: '明天',
      date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    },
  ]
  const componentsKey = ref(0) // 用于刷新组件
  const scheduleTabsactive = ref(0) // 课表高亮
  const dateTabsActive = ref(1) // 日期高亮
  const dayClassCoursesByStudentPropsList = ref([]) // 日课表
  const classCoursesWeekList = ref([]) // 周课表
  const isShowHCalendar = ref(false) // 日期高亮
  const dayTime = ref(dayjs().format('YYYY-MM-DD')) // 日期高亮
  const isShowWeekScheduleTip = ref(false) // 周课表提示弹框
  const weekTime = ref('') // 周课表日期

  // 获取日课表数据
  const getListDayClassCoursesByClass = async (date) => {
    const res = await http.get({
      url: '/app-teach/classCourses/listDayClassCoursesByClass',
      data: {
        schoolId: userInfo.userInfo.orgId,
        semesterId: userInfo.semesterInfo.id,
        classId: userInfo.classInfo.id,
        date,
      },
    })
    if (res.code == 0) {
      dayClassCoursesByStudentPropsList.value = res.obj
    }
  }

  // 获取周课表数据
  const getListWeekClassCoursesByClass = async (startDate, endDate) => {
    const res = await http.get({
      url: '/app-teach/classCourses/listWeekClassCoursesByClass',
      data: {
        classId: userInfo.classInfo.id,
        studentId: userInfo.userInfo.studentId,
        schoolId: userInfo.userInfo.orgId,
        semesterId: userInfo.semesterInfo.id,
        startDate,
        endDate,
      },
    })
    console.log(res.obj)
    if (res.code == 0) {
      classCoursesWeekList.value = res.obj
    }
  }

  onMounted(async () => {
    await getListDayClassCoursesByClass(dayjs().format('YYYY-MM-DD'))
  })
  // 切换课表tabs
  const changeScheduleTabs = async (index) => {
    if (scheduleTabsactive.value == index) return
    dayTime.value = dayjs().format('YYYY-MM-DD')
    scheduleTabsactive.value = index
    dateTabsActive.value = 1
    componentsKey.value++
    if (index == 0) {
      await getListDayClassCoursesByClass(dayjs().format('YYYY-MM-DD'))
    }
  }
  // 切换日期tabs
  const changeDateTabs = async (item, index) => {
    if (dateTabsActive.value == index) return
    dateTabsActive.value = index
    dayTime.value = item.date
    await getListDayClassCoursesByClass(item.date)
  }
  // 保存日期
  const changeDay = async (e) => {
    // 日课表
    if (scheduleTabsactive.value == 0) {
      const index = dateTabs.findIndex((item) => item.date === e.item.time)
      if (index !== -1) {
        dateTabsActive.value = index
      } else {
        dateTabsActive.value = 999
      }
      dayTime.value = e.item.time
      await getListDayClassCoursesByClass(e.item.time)
    }
    isShowHCalendar.value = false
  }

  const weekChange = async (item) => {
    weekTime.value = item.time
    await getListWeekClassCoursesByClass(item.startDate, item.endDate)
  }
</script>
<style scoped lang="scss">
  .schedule {
    .bg-image {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 408rpx !important;
      z-index: -1;
      pointer-events: none;
    }
    .schedule-tabs {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 140rpx;
      box-sizing: border-box;
      view {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .lable {
        font-weight: blod;
        font-size: 30rpx;
        color: #fff;
        line-height: 32rpx;
        font-weight: bold;
        cursor: pointer;
      }
      .before {
        width: 40rpx;
        height: 6rpx;
        background: #fff;
        border-radius: 22rpx;
        margin-top: 16rpx;
      }
    }
    .content {
      padding: 0rpx 32rpx 10rpx 32rpx;
      height: calc(100vh - 408rpx);
      overflow: auto;
      margin-top: 30rpx;
      background: #fff;
      border-radius: 60rpx 60rpx 0rpx 0rpx;
      display: flex;
      flex-direction: column;
      .sticky {
        background: #fff;
        padding-top: 40rpx;
        z-index: 1;
        display: flex;
        padding-bottom: 20rpx;
        box-sizing: border-box;
        .date-tabs {
          width: 360rpx;
          height: 88rpx;
          background: #f9faff;
          border-radius: 44rpx;
          display: flex;
          align-items: center;
          margin-right: 26rpx;
          text {
            width: 120rpx;
            height: 88rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30rpx;
            color: #333333;
            line-height: 32rpx;
          }
          .date-tabs-active {
            color: #00a0ff;
            background: #fff;
            box-shadow: 0rpx 0rpx 24rpx 0rpx rgba(56, 140, 126, 0.2);
            border-radius: 48rpx;
          }
        }
        .date {
          width: 302rpx;
          height: 88rpx;
          background: #f9faff;
          border-radius: 44rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          text {
            margin-left: 16rpx;
            font-size: 30rpx;
            color: #333;
            line-height: 32rpx;
          }
        }
      }
      .week-schedule-tip {
        padding: 32rpx;
        box-sizing: border-box;
        .close {
          display: flex;
          align-items: center;
          justify-content: space-between;
          text {
            font-size: 34rpx;
            color: #333;
            line-height: 48rpx;
          }
        }
        .tip-label {
          display: flex;
          flex-wrap: wrap;
          view {
            display: flex;
            align-items: center;
            text {
              color: #666;
            }
          }
          view:nth-child(1) {
            text:nth-child(1) {
              width: 48rpx;
              height: 48rpx;
              background: #f7f8fa;
              border: 2rpx solid #e5e5e5;
            }
          }
          view:nth-child(2) {
            text:nth-child(1) {
              width: 48rpx;
              height: 48rpx;
              background: #fff7eb;
              border: 2rpx solid #ff9500;
            }
          }
          .triangle {
            width: 48rpx;
            height: 48rpx;
            background: #f7f8fa;
            border: 2rpx solid #e5e5e5;
            text {
              position: absolute;
              width: 0;
              height: 0;
              border-right: 16rpx solid transparent;
              border-top: 16rpx solid #00a0ff;
            }
          }
        }
      }
    }
  }
</style>
