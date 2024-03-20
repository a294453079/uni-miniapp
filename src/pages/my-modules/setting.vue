<template>
  <view class="setting-card">
    <view class="setting">
      <view>
        <text>用户协议</text>
        <img class="w-28rpx h-28rpx cursor-pointer" src="@/static/my/arrow-right.png" alt="" />
      </view>
      <view>
        <text>隐私政策</text>
        <img class="w-28rpx h-28rpx cursor-pointer" src="@/static/my/arrow-right.png" alt="" />
      </view>
    </view>
    <view class="logout" @click="handleLogout">退出登录</view>
  </view>
</template>

<script setup>
import userStore from "@/stores/index.js"
const handleLogout = async () => {
  const { userInfoStore } = userStore();
  await userInfoStore.Logout()
}
</script>

<style scoped lang="scss">
.setting-card {
  padding: 32rpx;
  box-sizing: border-box;
  background: #f9faff;
  height: 100vh;

  .setting {
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 0 24rpx;
    box-sizing: border-box;
    border-radius: 16rpx;

    view {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 96rpx;
      border-bottom: 2rpx solid #e5e5e5;

      text {
        color: #333;
        font-size: 30rpx;
        line-height: 32rpx;
      }
    }

    view:last-child {
      border: none;
    }
  }

  .logout {
    color: #333;
    font-size: 32rpx;
    line-height: 32rpx;
    cursor: pointer;
    border-radius: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    height: 112rpx;
    position: fixed;
    width: 91.5%;
    bottom: 132rpx;
  }
}
</style>
