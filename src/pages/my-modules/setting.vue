<template>
  <view class="setting-card">
    <view class="setting">
      <view>
        <text>用户协议</text>
        <img class="w-14px h-14px cursor-pointer" src="@/static/my/arrow-right.png" alt="" />
      </view>
      <view>
        <text>隐私政策</text>
        <img class="w-14px h-14px cursor-pointer" src="@/static/my/arrow-right.png" alt="" />
      </view>
    </view>
    <view class="logout">退出登录</view>
  </view>
</template>

<script setup></script>

<style scoped lang="scss">
  .setting-card {
    padding: 16px;
    box-sizing: border-box;
    background: #f9faff;
    height: 100vh;
    .setting {
      display: flex;
      flex-direction: column;
      background: #fff;
      padding: 0 12px;
      box-sizing: border-box;
      border-radius: 8px;
      view {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 48px;
        border-bottom: 1px solid #e5e5e5;
        text {
          color: #333;
          font-size: 15px;
          line-height: 16px;
        }
      }
      view:last-child {
        border: none;
      }
    }
    .logout {
      color: #333;
      font-size: 16px;
      line-height: 16px;
      cursor: pointer;
      border-radius: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      height: 56px;
      position: fixed;
      width: 91.5%;
      bottom: 66px;
    }
  }
</style>
