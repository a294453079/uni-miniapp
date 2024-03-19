<template>
  <u-toast ref="uToastRef"></u-toast>
  <view class="content">
    <view class="heater">智慧课堂</view>
    <view class="tabs">
      <view @click="handleDetailClick('live-broadcast')">
        <img src="@/static/home/live-broadcast-icon.png" alt="" />
        <text>点播课</text>
      </view>
      <view @click="handleDetailClick('school-timetable')">
        <img src="@/static/home/school-timetable-icon.png" alt="" />
        <text>课程表</text>
      </view>
      <view @click="handleDetailClick('classroom-review')">
        <img src="@/static/home/classroom-review-icon.png" alt="" />
        <text>课堂回顾</text>
      </view>
    </view>
    <view class="mt-16px">
      <moduleTitle title="学生课表" />
      <view class="mt-16px">
        <view v-for="(item, index) in 3" :key="index" class="schedule">
          <!-- 更多 -->
          <view class="more" v-show="index == 0" @click="handleMoreScheduleClick">
            <text>更多</text>
            <img class="w-12px h-12px" src="@/static/my/arrow-right.png" alt="" />
          </view>
          <view>
            <view class="schedule-date">{{ timePeriodsData[index] }}</view>
            <view v-for="(o, idx) in 4" :key="idx" class="class-list" :class="handleScheduleBgImgClass(idx)">
              <view class="schedule-info">
                <text class="subject">体育与健康</text>
                <text class="mx-8px leading-14px">/</text>
                <text class="teacherName">蒙太奇</text>
              </view>
              <view class="time">第一节（08:00-08:40）</view>
              <text class="status">已结束</text>
              <div class="course-review-btn">
                <text>课堂回顾</text>
                <img class="w-5px h-12px" src="@/static/home/right-arrow-active.png" alt="" />
              </div>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import moduleTitle from '@/components/moduleTitle.vue'
import { ref } from 'vue'
const uToastRef = ref(null)
const timePeriodsData = ['上午', '下午', '晚上']
import { requestInstance as http } from '@/utils/http/instance'
http.get({
  url: '/app-teach/classCourses/listDayClassCoursesByClass',
  params: {
    schoolId: '64428937560064000',
    semesterId: '376447209173975053',
    classId: '449227900294791393',
    date: '2024-03-19',
  },
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
// 跳转详情
const handleDetailClick = (type) => {
  if (type == 'live-broadcast') {
    uToastRef.value.show({
      message: '程序猿们已经在加紧开发，请期待此功能',
    })
  } else {
    uni.navigateTo({
      url: '/pages/practice/detail',
    })
  }
}
// 查看更多课表
const handleMoreScheduleClick = () => {
  uni.navigateTo({
    url: '/pages/practice/detail',
  })
}
</script>
<style scoped lang="scss">
.content {
  height: 100vh;
  background: #f8f8f8;

  .heater {
    height: 149px;
    color: #fff;
    font-size: 20px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    background: #00a0ff;
  }

  .tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 118px;
    border-radius: 16px;
    background: #fff;
    padding: 0 20px;
    box-sizing: border-box;
    margin: -43px 16px 0 16px;

    view {
      display: flex;
      align-items: center;
      flex-direction: column;
      cursor: pointer;

      image {
        width: 55px;
        height: 55px;
      }

      text {
        color: #474747;
        font-size: 15px;
        line-height: 16px;
        margin-top: 6px;
      }
    }
  }

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
      border-radius: 8px;
      box-sizing: border-box;
      margin-bottom: 16px;

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
}
</style>
