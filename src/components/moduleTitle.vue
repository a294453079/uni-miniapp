<template>
  <view class="content">
    <text class="borders"></text>
    <text class="title">{{ title }}</text>
  </view>
</template>

<script setup>
  import { defineProps } from 'vue'
  const props = defineProps({
    // 子组件接收父组件传递过来的值
    title: String,
  })
</script>
<style scoped lang="scss">
  .content {
    display: flex;
    align-items: center;
    padding-left: 32rpx;
    .title {
      color: #474747;
      margin-left: 10rpx;
      line-height: 50rpx;
    }
    .borders {
      width: 6rpx;
      height: 30rpx;
      background: #00a0ff;
    }
  }
</style>
