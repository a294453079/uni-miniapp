<template>
  <view class="page">
    <view style="background:url('/static/blueBg2.png') no-repeat">
      <navbar title="课堂回顾" :titleStyle="{
        color: '#fff',
        fontSize: '36rpx',
        fontWeight: 'bold',
      }"></navbar>
    </view>
    <view>
      全部学科
    </view>
  </view>
</template>

<script setup>
import navbar from '@/components/navbar/navbar.vue';
</script>

<style scoped lang="scss">
.page {
  .bg-image {
    background: url('/static/blueBg2.png') no-repeat top #f9f9f9;
  }
}
</style>
