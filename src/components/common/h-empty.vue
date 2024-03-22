<template>
  <view class="h-empty">
    <img class="w-310rpx h-215rpx" src="@/static/empty.png" alt="" />
    <text>{{ text }}</text>
  </view>
</template>
<script setup>
  import { defineProps } from 'vue'

  defineProps({
    text: {
      type: String,
      default: '暂无数据',
    },
  })
</script>

<style lang="scss" scoped>
  .h-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    text {
      font-size: 28rpx;
      color: #999;
      line-height: 44rpx;
    }
  }
</style>
