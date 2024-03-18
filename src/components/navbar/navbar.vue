<template>
  <view class="nav-container" :class="{ border }" :style="[navStyle, navbarStyle]" v-show="sysInfo.statusBarHeight">
    <!--    <view class="h-sb"></view>-->
    <slot name="main">
      <view v-if="title" class="title-container" :style="[titleStyle]">
        {{ title }}

        <view class="nav-btn-back">
          <u-icon name="arrow-left" size="36rpx" color="#1f1f1f" @click="handleNavBack" />
        </view>
      </view>
      <view v-else class="nav-content" :style="[navContent, contentStyle]">
        <slot name="default"></slot>
      </view>
    </slot>
  </view>
</template>

<script setup>

import {
  getMenuButtonBoundingRect,
  getSystemSetting
} from '@/utils/helper/cacheQueryHelper'
import { shallowRef, computed, watch, defineProps, ref } from 'vue';
const props = defineProps({
  title: { type: String, default: '' },
  // 整个自定义nanvbar的样式
  navbarStyle: { type: Object, default: () => ({}) },
  // 不包含状态栏的样式
  contentStyle: { type: Object, default: () => ({}) },
  // 显示标题时，标题的样式
  titleStyle: { type: Object, default: () => ({}) },
  // 显示底部边框
  border: { type: Boolean, default: false },

})
/* 顶部胶囊的相关信息 */
const capsule = ref(getMenuButtonBoundingRect())
/* 系统相关信息 */
const sysInfo = shallowRef(getSystemSetting())

/* 导航栏的样式（不包含状态栏） */
const navStyle = computed(() => {
  const { top = 24, bottom = 56 } = capsule.value
  const { statusBarHeight = 20 } = sysInfo.value

  const offset = top - statusBarHeight

  return {
    height: `${offset + bottom}px`,
    paddingTop: `${statusBarHeight}px`
  }

})

const navContent = computed(() => {
  const { left = 320 } = capsule.value
  return {
    paddingRight: `calc(100vw - ${left}px)`
  }
})


const handleNavBack = () => {
  uni.navigateBack()
}

</script>

<style lang="scss" scoped>
.nav-container {
  width: 100vw;
  background-color: transparent;

  &.border {
    box-shadow: 0 1rpx 0 0 rgba(0, 0, 0, 0.1);
    border-bottom: 1rpx solid rgba(245, 245, 245, 0.7);
  }
}

.nav-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.title-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: $uni-font-size-base;
  color: $uni-text-color;

  position: relative;

  .nav-btn-back {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding-left: $space-sm;
  }
}
</style>
