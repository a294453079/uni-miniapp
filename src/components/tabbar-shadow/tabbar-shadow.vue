<template>
  <view>
    <view class="tabbar-shadow"></view>
  </view>
</template>
<script setup></script>

<style scoped lang="scss">
  .tabbar-shadow {
    position: fixed;
    bottom: -14px;
    z-index: 3333;
    left: 0;
    width: 100%;
    height: 12px;
    background-color: #fff;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2); // 根据需求自定义阴影颜色大小
  }
</style>
