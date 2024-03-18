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
    padding-left: 16px;
    .title {
      color: #474747;
      margin-left: 5px;
      line-height: 25px;
    }
    .borders {
      width: 3px;
      height: 15px;
      background: #00a0ff;
    }
  }
</style>
