<template>
  <view :class="{ isFull }">
    <view v-if="loading" class="loading-container">
      <view class="loading-ani" :style="[textStyle]">
        <slot name="icon">
          <view v-if="type === 1" class="spinner-1">
            <view v-for="i in 5" :key="i" class="rect" />
          </view>
        </slot>
        <slot name="text">
          <view v-if="text" class="loading-text" :style="[textStyle]">
            {{ text }}
          </view>
        </slot>
      </view>
    </view>
    <slot v-else name="default"></slot>
  </view>
</template>

<script setup>
import { computed, defineProps, ref } from 'vue'
const props = defineProps({
  type: {
    type: Number,
    default: 1
  },
  loading: {
    type: Boolean,
    default: false
  },
  isFull: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: '加载中...'
  },
  textStyle: {
    type: Object,
    default: () => ({})
  },
  contextStyle: {
    type: Object,
    default: () => ({})
  }
})

</script>

<style lang="scss" scoped>
.isFull {
  height: 100%;
}

.container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.loading-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
}

.loading-ani {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}

.loading-text {
  color: $color-primary-light;
  font-size: $font-size-xl;
  line-height: 48rpx;
  margin-top: 16rpx;
}

.spinner-1 {
  .rect {
    width: 10rpx;
    height: 80rpx;
    background-color: $color-primary;
    margin: 0 5rpx;
    display: inline-block;
    animation: stretchDelay 1.2s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: -1.1s;
    }

    &:nth-child(3) {
      animation-delay: -1s;
    }

    &:nth-child(4) {
      animation-delay: -0.9s;
    }

    &:nth-child(5) {
      animation-delay: -0.8s;
    }
  }
}

@keyframes stretchDelay {

  0%,
  40%,
  100% {
    transform: scaleY(0.45);
  }

  20% {
    transform: scaleY(1);
  }
}
</style>
