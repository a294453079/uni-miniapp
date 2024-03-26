<template>
  <view class="page">
    <view class="pt-310rpx flex justify-center">
      <!-- <u-icon name="/static/logo.png" size="200rpx" :label="appConfig.name" space="20rpx" label-size="32rpx"
        label-pos="bottom" /> -->
      <Loading :loading="pageLoading" :text-style="{ color: '#00A0FF' }" :type="1" text="加载中"></Loading>
    </view>
  </view>
</template>

<script setup>
import Loading from '@/components/loading/loading.vue'
import { useGlobalSetting } from '@/settings'
import userStore from "@/stores/index.js"
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const appConfig = computed(() => {
  return useGlobalSetting()
})
const pageLoading = ref(true)

onLoad(() => {
  uni.hideHomeButton()
  if (!appConfig.value.checkAuth) {
    uni.switchTab({
      url: '/pages/index/index'
    })
  }
  else {
    setTimeout(() => {
      const { userInfoStore } = userStore()
      console.log('app', userInfoStore.hasLogin);
      if (userInfoStore.hasLogin) {
        uni.switchTab({
          url: '/pages/index/index'
        })
      } else {
        uni.reLaunch({
          url: '/pages/login/index'
        })
      }
    }, 1500)
  }
}) 
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  background-color: #ffffff;
}
</style>
