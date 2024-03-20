<template>
  <view class="page">
    <image src="/static/blueBg2.png" class="bg-image" mode="widthFix" />
    <navbar></navbar>
    <view class="page-container">
      <view class="page__title">你好，</view>
      <view class="page__desc">欢迎来到<span class="page__desc__titles">常态课堂</span></view>
      <view class="loginContainer">
        <view class="mb-60rpx">
          <up-input :prefixIconStyle="prefixIconStyle" prefix-icon="/static/login/account.png" placeholder="请输入账号"
            :customStyle="inputCustomStyle" shape='circle' v-model="account" @change="change"></up-input>
        </view>
        <view class="mb-50rpx">
          <up-input :prefixIconStyle="prefixIconStyle" prefix-icon="/static/login/password.png"
            suffixIcon="/static/login/seePassword.png" :suffixIconStyle="suffixIconStyle" placeholder="请输入密码"
            :customStyle="inputCustomStyle" shape='circle' :password="invisible" v-model="password"
            @change="change"></up-input>
        </view>
        <view class="mb-72rpx">
          <u-checkbox-group v-model="rememberMe" placement="column" @change="groupChange">
            <u-checkbox shape="circle" labelSize="28rpx" :customStyle="{ marginBottom: '8px' }" :key="index"
              :label="radioContent.label" :name="radioContent.name" @change="radioChange">
            </u-checkbox>
          </u-checkbox-group>
        </view>
        <view class="mb-50rpx">
          <up-button :custom-style="buttonCustomStyle" :throttle-time="600" type="primary" text="登录"
            @click="handleLogin"></up-button>
        </view>
        <view class="flex items-center">
          <view>
            <u-checkbox-group v-model="readValue" placement="column" @change="groupChange">
              <u-checkbox :customStyle="{ marginBottom: '8px' }" :key="index" label="" name="1" @change="radioChange">
              </u-checkbox>
            </u-checkbox-group>
          </view>
          <view class="mb-8rpx tips">我已阅读并同意<span class="subTips">用户协议</span>和<span class="subTips">隐私政策</span>
          </view>
        </view>
      </view>
    </view>
    <u-toast ref="uToastRef"></u-toast>
  </view>
</template>

<script setup>
import { shallowRef } from 'vue'
import { http } from '@/utils'
import navbar from '@/components/navbar/navbar.vue';
import userStore from "@/stores/index.js"

const radioContent = {
  label: '记住密码',
  name: '1'
}
const inputCustomStyle = {
  width: '630rpx',
  height: '96rpx',
  borderRadius: '103rpx 103rpx 103rpx 103rpx',
  padding: '32rpx 36rpx',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  background: '#F5F6F8',
  border: 'none',
  boxSizing: 'border-box',
}
const prefixIconStyle = {
  width: '32rpx',
  height: '32rpx',
  marginRight: '40rpx',
  display: 'flex',
  alignItems: 'center',
}
const suffixIconStyle = {
  width: '28rpx',
  height: '17rpx',
  // marginRight: '40rpx',
  display: 'flex',
  alignItems: 'center',
}
const buttonCustomStyle = {
  width: '632rpx',
  height: '88rpx',
  background: 'linear-gradient( 90deg, #0084FF 0%, #4ABCFF 100%)',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '148rpx',
  fontSize: '32rpx',
  color: '#ffffff',
}
let rememberMe = shallowRef([])
let readValue = shallowRef([])
let invisible = shallowRef(true)
let account = shallowRef('')
let password = shallowRef('')
let uToastRef = shallowRef('')

const { app } = userStore();

const groupChange = (params) => {
  readValue.value = params
}

const showToast = (params) => {
  uToastRef.value.show({
    type: 'default',
    message: "请先阅读并同意协议",
  })
}
const handleLogin = async () => {
  if (!readValue.value.length) {
    showToast()
  } else {
    console.log('登录');
    uni.showLoading({
      title: '登录中...'
    })
    try {
      await app.Login({
        userNameLoginReq: {
          username: account.value,
          password: password.value
        },
        loginType: 1
      })
      app.setHasLogin(false)
    } catch (e) {
      app.resetState()
    } finally {
      uni.hideLoading()
    }
  }
}
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

  .tips {
    color: #A8ABB2;
    font-size: 28rpx;

    .subTips {
      color: #00A0FF;
      font-size: 28rpx;
      margin: 0px 4rpx;
    }
  }

  &__title {
    @apply text-52rpx ml-40rpx text-[#FFFFFF];
  }

  &__desc {
    @apply mt-40rpx ml-40rpx text-52rpx mb-108px text-[#FFFFFF];

    &__titles {
      @apply text-[#FFFFFF];
      @apply mt-40rpx text-52rpx font-bold;
    }
  }
}
</style>
