<template>
  <u-toast ref="uToastRef"></u-toast>

  <view class="content flex flex-col">
    <image src="/static/blueBg2.png" :style="{ height: '297rpx !important' }" class="bg-image" mode="aspectFill" />
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
    <view class="mt-16px flex-1 flex flex-col z-2">
      <PagesContainer :loading="pageLoading" hasCustomNavbar :customHeight="160" scrollContainer scrollRefresher
        scrollToLowerAllow @onRefresh="onRefreshPage">
        <moduleTitle title="学生课表" />
        <div class="px-32rpx mt-32rpx flex-1" style="border-radius: 32rpx 32rpx 0 0;"
          :style="{ background: dayClassCoursesByStudentPropsList.length != 0 ? '#fff' : '' }">
          <daySchedule :dayClassCoursesByStudentPropsList="dayClassCoursesByStudentPropsList" :isShowMore="true" />
        </div>
      </PagesContainer>
    </view>
  </view>
</template>

<script setup>
import PagesContainer from '@/components/pages-container/pages-container.vue'
import moduleTitle from '@/components/moduleTitle.vue'
import daySchedule from '@/components/schedule/daySchedule.vue'
import dayjs from 'dayjs'
import { http } from '@/utils'
import { ref, shallowRef, onMounted, onBeforeMount } from 'vue'
import { refreshToken } from '@/api/sys/auth'

const uToastRef = ref(null)
let dayClassCoursesByStudentPropsList = ref([])
const pageLoading = shallowRef(false)
const { semesterInfo, classInfo, userInfo, authInfo, username } = JSON.parse(uni.getStorageSync('userInfo'))

const onRefreshPage = () => {
  console.log('刷新页面')
  uni.showLoading()
  getListDayClassCoursesByClass(true)
}

// 获取首页课表
const getListDayClassCoursesByClass = async () => {
  const res = await http.get({
    url: '/app-teach/classCourses/listDayClassCoursesByClass',
    data: {
      schoolId: userInfo.orgId,
      semesterId: semesterInfo.id,
      classId: classInfo.id,
      date: dayjs().format('YYYY-MM-DD'),
    },
  })
  if (res.code == 0) {
    dayClassCoursesByStudentPropsList.value = res.obj
  }
}

onMounted(async () => {
  await getListDayClassCoursesByClass()
})

// 跳转详情
const handleDetailClick = (type) => {
  if (type == 'live-broadcast') {
    uToastRef.value.show({
      message: '程序猿们已经在加紧开发，请期待此功能',
    })
  } else if (type == 'school-timetable') {
    uni.navigateTo({
      url: '/pages/schedule/index',
    })
  } else {
    uni.navigateTo({
      url: '/pages/classReview/index',
    })
  }
}
</script>
<style scoped lang="scss">
.content {
  // height: 100vh;
  background: #f8f8f8;

  .bg-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    pointer-events: none;
  }

  .heater {
    height: 149px;
    color: #fff;
    font-size: 20px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    z-index: 1;
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
    z-index: 2;

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
}

::v-deep .scroll-container {
  padding-bottom: 0rpx !important;
}
</style>
