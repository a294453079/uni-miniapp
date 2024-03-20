<template>
  <view>
    <u-toast ref="uToastRef"></u-toast>
    <view class="header">
      <img class="w-112rpx h-112rpx mr-20rpx" src="@/static/my/user-logo.png" alt="" />
      <view class="flex flex-col flex-1" style="color: #fff">
        <view class="flex items-center justify-between">
          <text class="text-44rpx font-bold">郑和美</text>
          <img
            class="w-40rpx h-40rpx"
            @click="settingDetail"
            src="@/static/my/setting_icon.png"
            alt=""
          />
        </view>
        <text class="mt-30rpx text-30rpx">广州市西关外国语学校-学生</text>
      </view>
    </view>
    <view class="user-info">
      <view
        class="card-list"
        v-for="(item, index) in cardList"
        :key="index"
        @click="showToast(index)"
      >
        <view>
          <img class="w-60rpx h-60rpx mr-20rpx" :src="item.icon" alt="" />
          <text>{{ item.name }}</text>
        </view>
        <img
          class="w-28rpx h-28rpx cursor-pointer"
          v-if="!item.phone"
          src="@/static/my/arrow-right.png"
          alt=""
        />
        <text v-else class="text-24rpx leading-32rpx mr-14rpx">{{ item.phone }}</text>
      </view>
    </view>
  </view>
</template>
<script setup>
  import { ref } from 'vue'
  const uToastRef = ref(null)
  // 卡片数据
  const cardList = [
    {
      name: '个人信息',
      icon: '/static/my/user-info-icon.png',
    },
    {
      name: '帮助中心',
      icon: '/static/my/help-icon.png',
    },
    {
      name: '用户反馈',
      icon: '/static/my/feedback-icon.png',
    },
    {
      name: '客服电话',
      icon: '/static/my/customer-service-icon.png',
      phone: '020-8090-8993',
    },
  ]
  // 点击卡片跳转详情
  const showToast = (index) => {
    if (index == 0) {
      uni.navigateTo({
        url: '/pages/my-modules/personalInfo',
      })
    } else if (index == 1 || index == 2) {
      uToastRef.value.show({
        message: '敬请期待此功能',
      })
    }
  }

  // 跳转设置详情
  const settingDetail = () => {
    uni.navigateTo({
      url: '/pages/my-modules/setting',
    })
  }

  console.log(11111111, cardList)
</script>

<style scoped lang="scss">
  .header {
    height: 472rpx;
    background: #00a0ff;
    display: flex;
    align-items: center;
    padding: 0 32rpx 0 40rpx;
    display: flex;
    align-items: center;
  }
  .user-info {
    background: #fff;
    border-radius: 16rpx;
    margin: -80rpx 40rpx 0 40rpx;
    box-shadow: 0rpx 6rpx 16rpx 0rpx rgba(11, 69, 111, 0.16);
    .card-list {
      height: 160rpx;
      padding: 0 28rpx 0 32rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      view {
        display: flex;
        align-items: center;
        text {
          color: #474747;
          font-size: 30rpx;
          line-height: 32rpx;
          font-weight: bold;
        }
      }
    }
  }
</style>
