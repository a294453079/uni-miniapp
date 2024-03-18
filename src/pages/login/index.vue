<template>
  <view class="page">
    <view class="page__title">你好，</view>
    <view class="page__desc">欢迎来到<span class="page__desc__titles">常态课堂</span></view>
  </view>
</template>

<script setup>

</script>

<style scoped lang="scss">
.page {

  @apply min-h-screen bg-white p-50rpx text-[#9e9e9e];

  &__title {
    @apply mt-26rpx text-52rpx text-[#333];
  }

  &__desc {
    @apply mt-26rpx text-52rpx text-[#333];

    &__titles {
      @apply text-[#999];
      @apply mt-26rpx text-52rpx font-bold;
    }
  }
}
</style>
