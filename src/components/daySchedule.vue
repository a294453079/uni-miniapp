<template>
  <view class="mt-16px" style="background: #fff; border-radius: 16px">
    <view v-for="(item, index) in filteredTimePeriodsData" :key="index" class="schedule">
      <!-- 更多 -->
      <view class="more" v-show="index == 0 && isShowMore" @click="handleMoreScheduleClick">
        <text>更多</text>
        <img class="w-12px h-12px" src="@/static/my/arrow-right.png" alt="" />
      </view>
      <view class="pb-1px">
        <view class="schedule-date">{{ item.name }}</view>
        <view
          v-for="(o, idx) in 4"
          :key="idx"
          class="class-list"
          :class="handleScheduleBgImgClass(idx)"
        >
          <view class="schedule-info">
            <text class="subject">体育与健康</text>
            <text class="mx-8px leading-14px">/</text>
            <text class="teacherName">蒙太奇</text>
          </view>
          <view class="time"
            >第一节（08:00-08:40）
            <text class="substitute">代课</text>
          </view>
          <text class="status">已结束</text>
          <div class="course-review-btn">
            <text>课堂回顾</text>
            <img class="w-5px h-12px" src="@/static/home/right-arrow-active.png" alt="" />
          </div>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { computed, defineProps, onBeforeMount } from 'vue'
  const props = defineProps({
    isShowMore: Boolean, // 是否显示更多
    dayClassCoursesByStudentList: Array, // 课表数据
  })
  const timePeriodsData = [
    { name: '上午', scheduleData: [] },
    { name: '下午', scheduleData: [] },
    { name: '晚上', scheduleData: [] },
    { name: '其他', scheduleData: [] },
  ]

  onBeforeMount(() => {
    const dayClassCoursesByStudentList = computed(() => {
      if (props.dayClassCoursesByStudentList) {
        return props.dayClassCoursesByStudentList
      }
    })

    console.log(9999999999, dayClassCoursesByStudentList.value)

    // 循环处理课程表不同时间段的数据
    dayClassCoursesByStudentList.value.forEach((item) => {
      if (item.classScheduleType !== 3) {
        const index = timePeriodsData.findIndex((period) => period.name === item.periodTime)
        if (index !== -1) {
          timePeriodsData[index].scheduleData.push(item)
        }
      } else {
        timePeriodsData[3].scheduleData.push(item)
      }
    })

    const filteredTimePeriodsData = timePeriodsData.filter(
      (period) => period.scheduleData.length > 0,
    )
  })

  // 处理课表不同类型的背景图片
  const handleScheduleBgImgClass = (e) => {
    if (e == 0) {
      return 'end-class'
    } else if (e == 1) {
      return 'next-class'
    } else {
      return 'not-class'
    }
  }
  // 查看更多课表
  const handleMoreScheduleClick = () => {
    uni.navigateTo({
      url: '/pages/index/schedule/index',
    })
  }
</script>
<style scoped lang="scss">
  .schedule {
    background: #fff;
    padding: 0 16px;
    position: relative;
    .more {
      display: flex;
      align-items: center;
      position: absolute;
      right: 14px;
      top: 20px;
      text {
        color: #474747;
        font-size: 15px;
        line-height: 16px;
        margin-right: 3px;
      }
    }
    .schedule-date {
      color: #333;
      font-weight: bold;
      font-size: 18px;
      line-height: 28px;
      margin-bottom: 15px;
      padding-top: 15px;
    }
    .class-list {
      height: 88px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      position: relative;
      padding-left: 16px;
      box-sizing: border-box;
      margin-bottom: 16px;
      background-size: 100% 100% !important;
      .schedule-info {
        display: flex;
        align-items: center;
        color: #666;
        .subject {
          font-weight: bold;
          font-size: 22px;
          line-height: 28px;
        }
        .teacherName {
          font-size: 15px;
          line-height: 20px;
        }
      }
      .time {
        margin-top: 12px;
        font-size: 12px;
        color: #666;
        line-height: 16px;
        font-weight: bold;
        display: flex;
        align-items: center;
        .substitute {
          width: 40px;
          height: 20px;
          font-size: 12px;
          line-height: 12px;
          font-weight: bold;
          color: #ff9500;
          background: #f9f3e2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 8px;
        }
      }
      .status {
        position: absolute;
        right: 16px;
        top: 16px;
        color: #b0b8c7;
        font-size: 12px;
        line-height: 16px;
      }
      .course-review-btn {
        width: 79px;
        height: 28px;
        background: #fff;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: absolute;
        right: 16px;
        bottom: 12px;
        text {
          color: #00a0ff;
          font-size: 12px;
          line-height: 12px;
          margin-right: 6px;
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
