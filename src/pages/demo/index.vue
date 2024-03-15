<template>
  <view>
    <fui-radio-group>
      <fui-label v-for="(item, index) in mock" :key="index">
        <fui-list-cell>
          <view class="fui-align__center">
            <fui-radio :checked="item.checked" :value="item.value"> </fui-radio>
            <text class="fui-text">{{ item.name }}</text>
          </view>
        </fui-list-cell>
      </fui-label>
    </fui-radio-group>

    <view>
      <fui-button @click="showRef = true">默认按钮</fui-button>
    </view>

    <fui-bottom-popup :show="showRef">
      <view class="fui-scroll__wrap">
        <view class="fui-title">测试标题二</view>
        <scroll-view scroll-y class="fui-scroll__view">
          <fui-list-cell v-for="(item, index) in mockList" :key="index"
            >{{ item }}{{ index + 1 }}</fui-list-cell
          >
        </scroll-view>
        <view class="fui-icon__close" @tap="closePopup">
          <fui-icon name="close" :size="48"></fui-icon>
        </view>
      </view>
    </fui-bottom-popup>
  </view>
</template>

<script setup>
  import { ref, shallowRef } from 'vue'

  import { onLoad } from '@dcloudio/uni-app'

  const mock = ref([
    {
      name: '小于18岁',
      value: '1',
      checked: true,
    },
    {
      name: '18~28岁',
      value: '2',
      checked: false,
    },
    {
      name: '29~40岁',
      value: '3',
      checked: false,
    },
  ])

  const showRef = shallowRef(false)

  const mockList = shallowRef(
    Array.from(
      {
        length: 24,
      },
      () => 'hi',
    ),
  )

  onLoad(() => {
    console.log(mockList.value)
  })
</script>

<style scoped lang="scss">
  .fui-scroll__wrap {
    padding-top: 30rpx;
    position: relative;
  }
  .fui-title {
    font-size: 30rpx;
    font-weight: bold;
    text-align: center;
    padding-bottom: 24rpx;
  }
  .fui-icon__close {
    position: absolute;
    top: 24rpx;
    left: 24rpx;
  }

  .fui-scroll__view {
    width: 100%;
    height: 600rpx;
  }
</style>
