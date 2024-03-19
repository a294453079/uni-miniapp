<template>
  <view class="page">
    <image src="/static/blueBg2.png" class="bg-image" mode="widthFix" />
    <navbar></navbar>
    <view class="page-container">
      <view class="page__title">你好，</view>
      <view class="page__desc">欢迎来到<span class="page__desc__titles">常态课堂</span></view>
      <view class="loginContainer">
        <view>

        </view>
        <img src="@/static/login/account.png" class="login_icon" alt="" />
        <img src="@/static/login/password.png" class="login_icon" alt="" />
        <img src="@/static/login/seePassword.png" class="see_icon" alt="" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { requestInstance as http } from '@/utils/http/instance'
import navbar from '@/components/navbar/navbar.vue';
const getDataList = async () => {
  const res = await http.get({
    url: '/app-teach/classCourses/listDayClassCoursesByClass',
    params: {
      schoolId: '64428937560064000',
      semesterId: '376447209173975053',
      classId: '449227900294791393',
      date: '2024-03-19',
    },
  })
  console.log('-------', res);
}
getDataList()
// uni.request({
//   url: 'https://portal.dev.zhongteng.tech/api/app-teach/classCourses/listDayClassCoursesByClass',
//   header: {
//     authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDI4MzY0MjksImp0aSI6IjIyYjU4ZjY3LWY1ZjEtNGY0Zi1hZjU0LWYyZjYyZjUyZ',
//   },
//   method: 'GET',
//   data: {
//     schoolId: '64428937560064000',
//     semesterId: '376447209173975053',
//     classId: '449227900294791393',
//     date: '2024-03-19',
//   }
// })

</script>

<style scoped lang="scss">
.page {
  .bg-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    z-index: -1;
    pointer-events: none;
  }

  .loginContainer {
    background: #fff;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    padding: 120rpx 60rpx 100rpx 60rpx;

    .login_icon {
      width: 32rpx;
      height: 32rpx;
    }

    .see_icon {
      width: 28rpx;
      height: 17rpx;
    }
  }

  &__title {
    @apply text-52rpx text-[#FFFFFF];
  }

  &__desc {
    @apply mt-40rpx text-52rpx mb-108px text-[#FFFFFF];

    &__titles {
      @apply text-[#FFFFFF];
      @apply mt-40rpx text-52rpx font-bold;
    }
  }
}
</style>
