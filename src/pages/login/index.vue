<template>
  <view class="page">
    <image src="/static/blueBg2.png" class="bg-image" mode="widthFix" />
    <navbar></navbar>
    <view class="page-container">
      <view class="page__title">你好，</view>
      <view class="page__desc">欢迎来到<span class="page__desc__titles">常态课堂</span></view>
      <view class="loginContainer">
        12
      </view>

    </view>

  </view>
</template>

<script setup>
import navbar from '@/components/navbar/navbar.vue';
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
    padding: 120rpx 60rpx 0rpx 60rpx
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
