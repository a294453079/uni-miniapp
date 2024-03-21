<template>
  <view class="schedule">
    <view class="schedule-header">
      <view class="flex flex-col sticky left-0 z-3">
        <view class="flex items-center sticky top-0 z-3">
          <text class="min-w-80rpx left-0 label">时段</text>
          <text class="min-w-96rpx left-82rpx label">节数</text>
        </view>
        <view class="flex items-center">
          <text class="min-w-80rpx left-0 label" :style="{ height: 122 * morning - 1 + 'rpx' }"
            >上午</text
          >
          <view class="flex flex-col">
            <text class="min-w-96rpx left-82rpx label" v-for="item in morning" :key="item">{{
              ToChinese(item)
            }}</text>
          </view>
        </view>
        <view class="flex items-center">
          <text class="min-w-80rpx left-0 label" :style="{ height: 122 * afternoon - 1 + 'rpx' }"
            >下午</text
          >
          <view class="flex flex-col">
            <text class="min-w-96rpx left-82rpx label" v-for="item in afternoon" :key="item">{{
              ToChinese(morning + item)
            }}</text>
          </view>
        </view>
        <view class="flex items-center">
          <text class="min-w-80rpx left-0 label" :style="{ height: 122 * night - 1 + 'rpx' }"
            >晚上</text
          >
          <view class="flex flex-col">
            <text class="min-w-96rpx left-82rpx label" v-for="item in night" :key="item">{{
              ToChinese(morning + afternoon + item)
            }}</text>
          </view>
        </view>
      </view>
      <view class="flex flex-col">
        <view class="week-time sticky top-0 z-1">
          <view v-for="(item, index) in classCoursesWeekList.weekCoursesList" :key="index">
            <text>{{ item.week }}</text>
            <text>{{ item.date }}</text>
          </view>
        </view>
        <view class="week-data">
          <view
            v-for="(item, index) in classCoursesWeekList.weekCoursesList"
            :key="index"
            class="week-courses-list"
          >
            <view
              v-for="(o, idx) in item.classCoursesOutDTOList"
              :key="idx"
              :style="{
                background:
                  dayjs().format('YYYY-MM-DD HH:mm:ss') > o.date + ' ' + o.endTime + ':00'
                    ? '#F7F8FA'
                    : o.nextCourses
                    ? '#FFF7EB'
                    : '',
                border: o.nextCourses ? '2rpx solid #FF9500' : '',
                width: o.nextCourses ? '166rpx' : ''
              }"
            >
              <text>{{ o.subjectsName }}</text>
              <text>{{ o.teacherName }}</text>
              <span v-if="o.nextCourses" class="next-courses"></span>
              <img
                v-if="o.studentsAttendanceStatus == 0"
                class="tip-icon"
                src="@/static/schedule/cq.png"
                alt=""
              />
              <img
                v-if="o.studentsAttendanceStatus == 1"
                class="tip-icon"
                src="@/static/schedule/qq.png"
                alt=""
              />
              <img
                v-if="o.studentsAttendanceStatus == 5"
                class="tip-icon"
                src="@/static/schedule/qj.png"
                alt=""
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { ToChinese } from '@/utils/tools'
  import dayjs from 'dayjs'
  import { ref, onMounted, watch } from 'vue'
  const props = defineProps({
    classCoursesWeekList: Array, // 课表数据
  })

  const morning = ref(0) // 上午节数
  const afternoon = ref(0) // 下午节数
  const night = ref(0) // 晚上节数

  // 使用watch来观察props的变化
  watch(
    () => props.classCoursesWeekList,
    (newData, oldData) => {
      console.log('勾勾沟========', props.classCoursesWeekList)
      morning.value = props.classCoursesWeekList.periodSectionTimeOutDTO.morning
      afternoon.value = props.classCoursesWeekList.periodSectionTimeOutDTO.afternoon
      night.value = props.classCoursesWeekList.periodSectionTimeOutDTO.night
      let classCourseLength = morning.value + afternoon.value + night.value // 总节数
      props.classCoursesWeekList.weekCoursesList.forEach((item) => {
        item.classCoursesOutDTOList = []
        // 如果存在list，则将list中的数据合并
        if (item.list) {
          item.list.forEach((o) => {
            item.classCoursesOutDTOList.push(...o.classCoursesOutDTOList)
          })
        }
        // 如果节数小于总节数，则补全
        if (item.classCoursesOutDTOList.length < classCourseLength) {
          const classCoursesOutDTOList = new Array(classCourseLength).fill({})
          item.classCoursesOutDTOList.forEach((o) => {
            classCoursesOutDTOList[o.section - 1] = o
          })
          item.classCoursesOutDTOList = classCoursesOutDTOList
        }

        item.classCoursesOutDTOList.sort((a, b) => {
          return a.section - b.section
        })
      })

      console.log('vvvvvvvvvvvvvvvv', props.classCoursesWeekList)
    },
  )
</script>
<style scoped lang="scss">
  .schedule {
    .schedule-header {
      display: flex;
      overflow: auto;
      border: 2rpx solid #e5e5e5;
      border-radius: 16rpx;
      height: calc(100vh - 560rpx);
      .label {
        height: 120rpx;
        background: #f0f2f5;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30rpx;
        color: #666;
        line-height: 32rpx;
        writing-mode: tb-rl;
        border-right: 2rpx solid #e5e5e5;
        position: sticky;
        border-bottom: 2rpx solid #e5e5e5;
      }
      .week-time {
        display: flex;
        view {
          width: 170rpx;
          height: 120rpx;
          background: #f0f2f5;
          border-left: 2rpx solid #e5e5e5;
          border-bottom: 2rpx solid #e5e5e5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text:nth-child(1) {
            font-size: 30rpx;
            color: #666;
            line-height: 32rpx;
          }
          text:nth-child(2) {
            font-size: 24rpx;
            color: #b0b8c7;
            line-height: 32rpx;
            margin-top: 10rpx;
          }
        }
        view:nth-child(1) {
          border-left: none;
        }
      }
      .week-data {
        display: flex;
        .week-courses-list {
          width: 170rpx;
          view {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: 170rpx;
            height: 120rpx;
            background: #fff;
            border-left: 2rpx solid #e5e5e5;
            border-bottom: 2rpx solid #e5e5e5;
            text:nth-child(1) {
              font-size: 30rpx;
              color: #333;
              line-height: 32rpx;
            }
            text:nth-child(2) {
              font-size: 24rpx;
              color: #b0b8c7;
              line-height: 32rpx;
              margin-top: 10rpx;
            }
          }
          .tip-icon {
            position: absolute;
            left: 0;
            top: 0;
            width: 20rpx;
            height: 24rpx;
          }
          .next-courses {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            border-right: 24rpx solid transparent;
            border-top: 24rpx solid #ff9500;
          }
        }
        .week-courses-list:nth-child(1) {
          view {
            border-left: none;
          }
        }
      }
    }
  }
</style>
