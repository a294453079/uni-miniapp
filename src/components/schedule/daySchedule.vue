<template>
  <view class="mt-32rpx" style="background: #fff; border-radius: 32rpx">
    <view v-for="(item, index) in dayClassCoursesByStudentList" :key="index" class="schedule">
      <!-- 更多 -->
      <view class="more" v-if="index == 0 && isShowMore" @click="handleMoreScheduleClick">
        <text>更多</text>
        <img class="w-24rpx h-24rpx" src="@/static/my/arrow-right.png" alt="" />
      </view>
      <view class="pb-2rpx">
        <view class="schedule-date">{{ item.name }}</view>
        <view
          v-for="(o, idx) in item.scheduleData"
          :key="idx"
          class="class-list"
          :class="handleScheduleBgImgClass(o)"
        >
          <view class="schedule-info">
            <text class="subject">{{ o.subjectsName }}</text>
            <text class="mx-16rpx leading-28rpx">/</text>
            <text class="teacherName">{{ o.teacherName }}</text>
          </view>
          <view class="time">
            <text v-if="o.classScheduleType != 3">{{ handleDateFn(o) }}</text>
            <text class="substitute" v-if="o.classScheduleType == 2">代课</text>
            <text class="completedTempCourses" v-if="o.classScheduleType == 3">{{
              o.labelName
            }}</text>
          </view>
          <div v-if="handleClassCoursesFn(o.classCoursesId, o.date)" class="status">
            <span v-if="remainingTime == '-'"></span>
            <span v-else-if="!remainingTime">进行中</span>
            <span v-else>倒计时 {{ remainingTime }}</span>
          </div>
          <div v-else>
            <text class="status" v-if="o.classCoursesHistoryId">已上课</text>
            <text class="status" v-else-if="handleEndFn(o)">已结束</text>
            <text class="status" v-else-if="handleNotOperableFn(o)">未开始</text>
            <text class="status" v-else-if="handleInProgressFn(o)">进行中</text>
          </div>

          <!--state 1进行中 2未开始 3已完成 4已过期-->
          <view v-if="o.liveBroadcastClassId && (o.broadcastState == 1 || o.broadcastState == 2)">
            <span>加入直播</span>
            <!-- <el-button type="primary" v-if="o.broadcastState == 1" @click="handleLive(o)"
                >加入直播</el-button
              >
              <el-button plain v-else-if="o.broadcastState == 2" @click="handleLive(o)"
                >加入直播</el-button
              > -->
          </view>
          <view class="course-review-btn" v-else-if="o.classCoursesHistoryId">
            <!-- @click="goCourseDetail(o.classCoursesHistoryId)" -->
            <text>课堂回顾</text>
            <img class="w-10rpx h-24rpx" src="@/static/home/right-arrow-active.png" alt="" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import dayjs from 'dayjs'
  import { http } from '@/utils'
  import { defineProps, watch, ref, onMounted } from 'vue'
  const props = defineProps({
    isShowMore: Boolean, // 是否显示更多
    dayClassCoursesByStudentPropsList: Array, // 课表数据
  })

  const userInfo = JSON.parse(uni.getStorageSync('userInfo'))

  let remainingTime = ref('-')
  let countdownTimer = ref(null)
  let nextCoureseData = ref(null) // 下节课信息
  let nextClassCoursesId = ref(null) // 下节课id

  // 下节课信息
  const getNextCoursesAndLessonsByTeacher = async () => {
    const res = await http.get({
      url: '/app-teach/student/getNextCoursesAndLessonsByClass',
      data: {
        schoolId: userInfo.userInfo.orgId,
        semesterId: userInfo.semesterInfo.id,
        classId: userInfo.classInfo.id,
      },
    })
    if (res.obj) {
      nextClassCoursesId = res.obj.classCoursesId
      nextCoureseData = res.obj.date
    }
  }

  onMounted(async () => {
    await getNextCoursesAndLessonsByTeacher()
  })

  console.log(dayjs().format('YYYY-MM-DD HH:mm:ss'))

  let dayClassCoursesByStudentList = []

  // 使用watch来观察props的变化
  watch(
    () => props.dayClassCoursesByStudentPropsList,
    (newData, oldData) => {
      dayClassCoursesByStudentList = [
        { name: '上午', scheduleData: [] },
        { name: '下午', scheduleData: [] },
        { name: '晚上', scheduleData: [] },
        { name: '其他', scheduleData: [] },
      ]

      // 循环处理课程表不同时间段的数据
      props.dayClassCoursesByStudentPropsList.forEach((item) => {
        if (item.classScheduleType !== 3) {
          const index = dayClassCoursesByStudentList.findIndex(
            (period) => period.name === item.periodTime,
          )
          if (index !== -1) {
            dayClassCoursesByStudentList[index].scheduleData.push(item)
          }
        } else {
          dayClassCoursesByStudentList[3].scheduleData.push(item)
        }
      })
      dayClassCoursesByStudentList = dayClassCoursesByStudentList.filter(
        (period) => period.scheduleData.length > 0,
      )
      if (props.dayClassCoursesByStudentPropsList.length != 0) {
        handlerNextClassnAndClassEnded(props.dayClassCoursesByStudentPropsList)
      }
    },
  )

  /** 判断是否有下节课，并且判断今日课程是否已结束 */
  const handlerNextClassnAndClassEnded = (list) => {
    if (list.length == 0) return
    if (nextClassCoursesId) {
      for (const item of list) {
        if (item.classCoursesId == nextClassCoursesId) {
          handleNextClassCoursesFn(item)
          break // 跳出循环
        }
      }
    }
  }
  /** 定时器 */
  const handleNextClassCoursesFn = (item) => {
    clearInterval(countdownTimer.value)
    countdownTimer.value = setInterval(() => {
      const currentTime = new Date()
      const targetDate = new Date(item.date + ' ' + item.startTime + ':00')
      const timeDiff = targetDate - currentTime
      if (timeDiff > 0) {
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((timeDiff / 1000 / 60) % 60)
        const seconds = Math.floor((timeDiff / 1000) % 60)
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
        if (days > 0) {
          remainingTime.value = `${days}天`
        } else {
          remainingTime.value = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
        }
      } else {
        remainingTime.value = ''
        clearInterval(countdownTimer.value)
        if (dayjs().format('YYYY-MM-DD HH:mm:ss') > item.date + ' ' + item.endTime + ':00') {
          handlerNextClassnAndClassEnded(props.dayClassCoursesByStudentPropsList)
        }
      }
    }, 1000)
  }

  // 判断列表上课状态----已结束
  const handleEndFn = (item) => {
    return dayjs().format('YYYY-MM-DD HH:mm:ss') > item.date + ' ' + item.endTime + ':00'
  }
  // 判断列表上课状态----未开始
  const handleNotOperableFn = (item) => {
    return dayjs().format('YYYY-MM-DD HH:mm:ss') < item.date + ' ' + item.startTime + ':00'
  }
  // 判断列表上课状态----进行中
  const handleInProgressFn = (item) => {
    if (
      item.classScheduleType == 3 &&
      !item.classCoursesHistoryId &&
      dayjs().format('YYYY-MM-DD HH:mm:ss') > item.date + ' ' + item.startTime + ':00' &&
      dayjs().format('YYYY-MM-DD HH:mm:ss') < item.date + ' ' + item.endTime + ':00'
    ) {
      return true
    } else {
      return (
        dayjs().format('YYYY-MM-DD HH:mm:ss') > item.date + ' ' + item.startTime + ':00' &&
        dayjs().format('YYYY-MM-DD HH:mm:ss') < item.date + ' ' + item.endTime + ':00'
      )
    }
  }
  // 处理课表日期回显
  const handleDateFn = (o) => {
    const numList = [
      '',
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十',
      '十一',
      '十二',
      '十三',
      '十四',
      '十五',
    ]
    return `第${numList[o.section]}节（${o.startTime}-${o.endTime}）`
  }
  const pad = (value) => {
    return value.toString().padStart(2, '0')
  }
  // 下节课高亮
  const handleClassCoursesFn = (classCoursesId, date) => {
    if (date == nextCoureseData) {
      return nextClassCoursesId == classCoursesId
    }
  }
  // 处理课表不同类型的背景图片
  const handleScheduleBgImgClass = (item) => {
    if (handleEndFn(item)) {
      return 'end-class'
    }
    if (handleClassCoursesFn(item.classCoursesId, item.date)) {
      return 'next-class'
    }
    if (handleNotOperableFn(item) || item.classScheduleType == 3) {
      return 'not-class'
    }

    // if (item.classScheduleType == 3) {
    //   return 'not-class'
    // }
    // if (e == 0) {
    //   return 'end-class'
    // } else if (e == 1) {
    //   return 'next-class'
    // } else {
    //   return 'not-class'
    // }
  }
  // 查看更多课表
  const handleMoreScheduleClick = () => {
    uni.navigateTo({
      url: '/pages/schedule/index',
    })
  }
</script>
<style scoped lang="scss">
  .schedule {
    background: #fff;
    padding: 0 32rpx;
    position: relative;
    .more {
      display: flex;
      align-items: center;
      position: absolute;
      right: 28rpx;
      top: 40rpx;
      text {
        color: #474747;
        font-size: 30rpx;
        line-height: 32rpx;
        margin-right: 6rpx;
      }
    }
    .schedule-date {
      color: #333;
      font-weight: bold;
      font-size: 36rpx;
      line-height: 56rpx;
      margin-bottom: 30rpx;
      padding-top: 30rpx;
    }
    .class-list {
      height: 176rpx;
      display: flex;
      justify-content: center;
      flex-direction: column;
      position: relative;
      padding-left: 32rpx;
      box-sizing: border-box;
      margin-bottom: 32rpx;
      background-size: 100% 100% !important;
      .schedule-info {
        display: flex;
        align-items: center;
        color: #666;
        .subject {
          font-weight: bold;
          font-size: 44rpx;
          line-height: 56rpx;
        }
        .teacherName {
          font-size: 30rpx;
          line-height: 40rpx;
        }
      }
      .time {
        margin-top: 24rpx;
        font-size: 24rpx;
        color: #666;
        line-height: 32rpx;
        font-weight: bold;
        display: flex;
        align-items: center;
        .substitute {
          width: 80rpx;
          height: 40rpx;
          font-size: 24rpx;
          line-height: 24rpx;
          font-weight: bold;
          color: #ff9500;
          background: #f9f3e2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 16rpx;
        }
        .completedTempCourses {
          height: 40rpx;
          font-size: 24rpx;
          line-height: 24rpx;
          font-weight: bold;
          color: #4cbe99;
          background: #e7f7f1;
          display: flex;
          align-items: center;
          padding: 0 16rpx;
        }
      }
      .status {
        position: absolute;
        right: 32rpx;
        top: 32rpx;
        color: #b0b8c7;
        font-size: 24rpx;
        line-height: 32rpx;
      }
      .course-review-btn {
        width: 158rpx;
        height: 56rpx;
        background: #fff;
        border-radius: 32rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: absolute;
        right: 32rpx;
        bottom: 24rpx;
        text {
          color: #00a0ff;
          font-size: 24rpx;
          line-height: 24rpx;
          margin-right: 12rpx;
        }
      }
    }
    .end-class {
      background: url('@/static/home/end-status.png') no-repeat;
    }
    .next-class {
      background: url('@/static/home/next-status.png') no-repeat;
      .schedule-info {
        color: #ff9500;
      }
      .time {
        color: #ff9500;
      }
      .status {
        color: #ff9500;
      }
    }
    .not-class {
      background: url('@/static/home/not-status.png') no-repeat;
      .schedule-info {
        color: #388c7e;
      }
      .time {
        color: #388c7e;
      }
      .status {
        color: #4cbe99;
      }
    }
  }
</style>
