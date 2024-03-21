<template>
  <view class="user-info" v-if="studentInfo != null">
    <view class="info">
      <view>
        <text>账号类型</text>
        <text>学生账号</text>
      </view>
      <view>
        <text>账号</text>
        <text>{{ studentInfo.account || '未设置' }}</text>
      </view>
    </view>
    <view class="info mt-32rpx">
      <view>
        <text>姓名</text>
        <text>{{ studentInfo.userName || '未设置' }}</text>
      </view>
      <view>
        <text>性别</text>
        <text>{{ studentInfo.sex == 1 ? '男' : studentInfo.sex == 2 ? '女' : '未设置' }}</text>
      </view>
    </view>
    <view class="info mt-32rpx">
      <view>
        <text>学校</text>
        <text>{{ studentInfo.orgName || '未设置' }}</text>
      </view>
      <view>
        <text>班级</text>
        <text>{{ studentInfo.className || '未设置' }}</text>
      </view>
      <view>
        <text>学号</text>
        <text>{{ studentInfo.studentNumber || '未设置'}}</text>
      </view>
      <!-- <view>
        <text>考号</text>
        <text>{{ userInfo.examNumber || '未设置'}}</text>
      </view> -->
      <view>
        <text>学籍号</text>
        <text>{{ studentInfo.countryUniqueCode || '未设置' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { http } from '@/utils'
  import { onMounted, ref } from 'vue'
  const { userInfo } = JSON.parse(uni.getStorageSync('userInfo'))
  let studentInfo = ref(null)
  // 下节课信息
  const getBasicInfo = async () => {
    const res = await http.get({
      url: '/user-server/users/getBasicInfo',
      data: {},
    })
    if (res.code == 0) {
      studentInfo.value = res.data
    }
  }

  onMounted(async () => {
    await getBasicInfo()
  })
</script>

<style scoped lang="scss">
  .user-info {
    padding: 32rpx;
    box-sizing: border-box;
    background: #f9faff;
    height: 100vh;
    .info {
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
        text:nth-child(1) {
          color: #b0b8c7;
          font-size: 30rpx;
          line-height: 32rpx;
        }
        text:nth-child(2) {
          color: #333;
          font-size: 30rpx;
          line-height: 32rpx;
        }
      }
      view:last-child {
        border: none;
      }
    }
  }
</style>
