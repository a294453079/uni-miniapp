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
        <view class="sticky" v-if="scheduleTabsactive == 1">
          <view class="date flex-1" @click="isShowHCalendar = true">
            <img class="w-40rpx h-40rpx" src="@/static/schedule/date-icon.png" alt="" />
            <text>第七周 2023年 10-09 至 10-15</text>
          </view>
          <img class="w-48rpx h-48rpx ml-42rpx" src="@/static/schedule/tip-icon.png" alt="">
        </view>
        <u-popup :show="isShowHCalendar">
          <view>
            <hCalendar @changeDay="changeDay" @closeDay="isShowHCalendar = false" />
          </view>
        </u-popup>
      </u-sticky>

      <daySchedule
        v-if="scheduleTabsactive == 0"
        :dayClassCoursesByStudentPropsList="dayClassCoursesByStudentPropsList"
        :isShowMore="false"
      />
      <weekSchedule v-if="scheduleTabsactive == 1" />
      <span v-if="scheduleTabsactive == 0">
        周课程表周课程表周课程表周课程表周 课程表周课程表周课程表周课程表周课程表周课程表周
        课程表周课程表周课程表周课程表周课程表周课程表周课程表周
        课程表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程
        表周课程表周课程表周课程表周课程表周课程表周课程表周课程表
        周课程表周课程表周课程表周课程表周课程表周课程表周课程表周
      </span>
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
  const scheduleTabsactive = ref(0) // 课表高亮
  const dateTabsActive = ref(1) // 日期高亮
  const dayClassCoursesByStudentPropsList = ref([])
  const isShowHCalendar = ref(false) // 日期高亮
  const dayTime = ref(dayjs().format('YYYY-MM-DD')) // 日期高亮

  // 获取日课表数据
  const getListDayClassCoursesByClass = async (date) => {
    const res = await http.get({
      url: '/app-teach/classCourses/listDayClassCoursesByClass',
      params: {
        schoolId: '64428937560064000',
        semesterId: '376447209173975053',
        classId: '449227900294791393',
        date,
      },
    })
    if (res.code == 0) {
      dayClassCoursesByStudentPropsList.value = res.obj
    }
  }

  onMounted(async () => {
    await getListDayClassCoursesByClass(dayjs().format('YYYY-MM-DD'))
  })
  // 切换课表tabs
  const changeScheduleTabs = (index) => {
    scheduleTabsactive.value = index
  }
  // 切换日期tabs
  const changeDateTabs = async (item, index) => {
    dateTabsActive.value = index
    dayTime.value = item.date
    await getListDayClassCoursesByClass(item.date)
  }
  // 保存日期
  const changeDay = async (e) => {
    const index = dateTabs.findIndex((item) => item.date === e.time)
    if (index !== -1) {
      dateTabsActive.value = index
    } else {
      dateTabsActive.value = 999
    }
    dayTime.value = e.time
    isShowHCalendar.value = false
    await getListDayClassCoursesByClass(e.time)
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
      .sticky {
        height: 148rpx;
        background: #fff;
        padding-top: 40rpx;
        z-index: 1;
        display: flex;
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
    }
  }
</style>
