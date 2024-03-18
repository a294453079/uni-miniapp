<template>
  <view class="user-info">
    <view class="info">
      <view>
        <text>账号类型</text>
        <text>学生账号</text>
      </view>
      <view>
        <text>账号</text>
        <text>18751234578</text>
      </view>
    </view>
    <view class="info mt-16px">
      <view>
        <text>姓名</text>
        <text>常晓明</text>
      </view>
      <view>
        <text>性别</text>
        <text>未设置</text>
      </view>
    </view>
    <view class="info mt-16px">
      <view>
        <text>学校</text>
        <text>广东省广州中学</text>
      </view>
      <view>
        <text>班级</text>
        <text>七年级2班</text>
      </view>
      <view>
        <text>学号</text>
        <text>002</text>
      </view>
      <view>
        <text>考号</text>
        <text>未设置</text>
      </view>
      <view>
        <text>学籍号</text>
        <text>G20220928010110</text>
      </view>
    </view>
  </view>
</template>

<script setup></script>

<style scoped lang="scss">
  .user-info {
    padding: 16px;
    box-sizing: border-box;
    background: #f9faff;
    height: 100vh;
    .info {
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
        text:nth-child(1) {
          color: #B0B8C7;
          font-size: 15px;
          line-height: 16px;
        }
        text:nth-child(2) {
          color: #333;
          font-size: 15px;
          line-height: 16px;
        }
      }
      view:last-child {
        border: none;
      }
    }
  }
</style>
