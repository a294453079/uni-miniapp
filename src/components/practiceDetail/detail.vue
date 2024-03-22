<template>
  <view class="practice-detail">
    <image src="/static/blueBg2.png" class="bg-image" mode="top" />
    <navbar
      title="练习内容"
      :titleStyle="{
        color: '#fff',
        fontSize: '36rpx',
      }"
    ></navbar>
    <view class="content">
      <view class="header" v-if="homeworkDetailInfo != null">
        <view class="info">
          <img
            class="w-84rpx h-84rpx mr-44rpx"
            :src="getModuleTypeIcon(homeworkDetailInfo.contentType, homeworkDetailInfo.fileFormat)"
            alt=""
          />
          <view>
            <text class="text-ellipsis">{{
              homeworkDetailInfo.resourceName || homeworkDetailInfo.webName
            }}</text>
            <text v-if="homeworkDetailInfo.submitType">{{
              getSubmitType(homeworkDetailInfo.submitType)
            }}</text>
          </view>
        </view>
        <view class="btn">
          <text @click="previewResources">预览</text>
          <text v-if="homeworkDetailInfo.contentType != 2"></text>
          <text v-if="homeworkDetailInfo.contentType != 2" @click="downloadFile(homeworkDetailInfo.resourceUrl)">下载</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
  import navbar from '@/components/navbar/navbar.vue'
  import { getModuleTypeIcon, downloadFile } from '@/utils/tools'
  import { onLoad } from '@dcloudio/uni-app'
  import { http } from '@/utils'
  import { ref } from 'vue'
  const homeworkDetailInfo = ref(null)
  onLoad(async (e) => {
    // 获取练习列表
    await getHomeworkDetail(e.id)
  })
  // 获取练习详情
  const getHomeworkDetail = async (homeworkStudentId) => {
    const res = await http.get({
      url: '/app-teach/samples/homeworkStudent/queryHomeworkDetail',
      data: {
        homeworkStudentId,
      },
    })
    console.log(res)
    if (res.code == 0) {
      homeworkDetailInfo.value = res.obj
    }
  }

  const getSubmitType = (type) => {
    let submitType = ['附件上传', '线下提交', '线上学习']
    return submitType[type - 1] || ''
  }
  // 预览
  const previewResources = () => {
    let obj = {}
    let type = 1
    // 网址
    if (homeworkDetailInfo.value.resourceType === 2) {
      obj = { webUrl: homeworkDetailInfo.value.webUrl }
      type = 3
    } else {
      // 课件文件
      obj = {
        resourceUrl: homeworkDetailInfo.value.resourceUrl,
        fileFormat: homeworkDetailInfo.value.fileFormat,
      }
    }
    let data = JSON.stringify(obj)
    uni.navigateTo({
      url: '/components/fileView?data=' + encodeURIComponent(data) + '&type=' + type,
    })
  }
</script>

<style lang="scss" scoped>
  .practice-detail {
    .bg-image {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 408rpx !important;
      z-index: -1;
      pointer-events: none;
    }
    .content {
      border-radius: 40rpx 40rpx 0 0;
      background: #fff;
      .header {
        box-sizing: border-box;
        padding: 50rpx 44rpx;
        height: 240rpx;
        .info {
          display: flex;
          align-items: center;
          view {
            display: flex;
            flex-direction: column;
            text:nth-child(1) {
              font-size: 34rpx;
              color: #333;
              line-height: 30rpx;
              font-weight: bold;
              overflow: hidden;
              white-space: nowrap;
              width: 500rpx;
            }
            text:nth-child(2) {
              margin-top: 20rpx;
              font-size: 24rpx;
              color: #666;
              line-height: 24rpx;
            }
          }
        }
        .btn {
          margin-top: 40rpx;
          display: flex;
          align-items: center;
          margin-left: 128rpx;
          text {
            font-size: 26rpx;
            color: #00a0ff;
            line-height: 28rpx;
            font-weight: bold;
          }
          text:nth-child(2) {
            width: 2rpx;
            height: 28rpx;
            background: #e5e5e5;
            margin: 0 30rpx;
          }
        }
      }
    }
  }
</style>
