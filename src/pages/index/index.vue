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
      <daySchedule :dayClassCoursesByStudentList="dayClassCoursesByStudentList" :isShowMore="true" />
    </view>
  </view>
</template>

<script setup>
  import moduleTitle from '@/components/moduleTitle.vue'
  import daySchedule from '@/components/daySchedule.vue'
  import { requestInstance as http } from '@/utils/http/instance'
  import { ref, onMounted } from 'vue'
  const uToastRef = ref(null)
  let dayClassCoursesByStudentList = ref([])


  // 获取首页课表
  const getListDayClassCoursesByClass = async () => {
    const res = await http.get({
      url: '/app-teach/classCourses/listDayClassCoursesByClass',
      params: {
        schoolId: '64428937560064000',
        semesterId: '376447209173975053',
        classId: '449227900294791393',
        date: '2024-03-19',
      }
    })
    console.log(11111111, res.obj);
    if(res.code == 0) {
      dayClassCoursesByStudentList.value = res.obj
    }
  }

  onMounted(() => {
    // 调用方法
    getListDayClassCoursesByClass()
  })



  
  // 跳转详情
  const handleDetailClick = (type) => {
    if (type == 'live-broadcast') {
      uToastRef.value.show({
        message: '程序猿们已经在加紧开发，请期待此功能',
      })
    } else if (type == 'school-timetable') {
      uni.navigateTo({
        url: '/pages/index/schedule/index',
      })
    } else {
      uni.navigateTo({
        url: '/pages/practice/detail',
      })
    }
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
  }
</style>
