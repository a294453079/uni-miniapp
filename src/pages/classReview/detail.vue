<template>
  <view class="class-review-detail">
    <image src="/static/blueBg2.png" class="bg-image" mode="top" />
    <navbar title="课堂回顾详情" :titleStyle="{
      color: '#fff',
      fontSize: '36rpx',
    }"></navbar>
    <view class="content">
      <moduleTitle title="基本信息" />
      <view class="class-review-info" v-if="homeworkDetailInfo != null">
        <view class="name">
          <text>{{ homeworkDetailInfo.courseName }}</text>
          <text>/</text>
          <text>{{ homeworkDetailInfo.teacherName }}</text>
        </view>
        <div class="time"> 课节：{{ homeworkDetailInfo.name || '--' }} </div>
        <div class="chapter">教材章节：{{ homeworkDetailInfo.versionChapterNameLink || '--' }}</div>
      </view>
      <view class="mt-68rpx">
        <moduleTitle title="课堂资源" />
        <view v-if="resourceList.length">
          <view v-for="(item, index) in resourceList" :key="index" class="classroom-resources">
            <view>
              <img class="w-48rpx h-48rpx" :src="getModuleTypeIcon(item.contentType, item.fileFormat)" alt="" />
              <text class="w-336rpx truncate">{{ item.title }}</text>
            </view>
            <text class="btn" @click="previewResources">查看</text>
          </view>
        </view>
        <view v-else>
          <hEmpty text="暂无课堂资源" />
        </view>

        <view class="mt-60rpx">
          <moduleTitle title="课堂实录" />
        </view>
        <div class="course-video" v-if="reachResourcesDetailList.filter(i => i.type == 1).length">
          <view v-for="(item, index) in reachResourcesDetailList.filter(i => i.type == 1)" :key="index"
            class="course-video-list">
            <video class="video" :src="item.url" object-fit="cover" alt=""></video>
            <text class="truncate">{{ item.realFileName }}</text>
          </view>
        </div>
        <div v-else>
          <hEmpty text="暂无课堂实录" />
        </div>
        <moduleTitle title="课堂板书" />
        <div class="course-video" v-if="reachResourcesDetailList.filter(i => i.type == 2).length">
          <view v-for="(item, index) in reachResourcesDetailList.filter(i => i.type == 2)" :key="index"
            class="course-video-list">
            <image class="img" :src="item.url" alt="" @tap="preview(index)" />
            <text class="truncate">{{ item.realFileName }}</text>
          </view>
        </div>
        <div v-else>
          <hEmpty text="暂无课堂板书" />
        </div>
      </view>
    </view>
  </view>
</template>
<script setup>
import hEmpty from '@/components/common/h-empty.vue'
import moduleTitle from '@/components/moduleTitle.vue'
import navbar from '@/components/navbar/navbar.vue'
import { getModuleTypeIcon, downloadFile, getEncryptFilePathURL } from '@/utils/tools'
import { onLoad } from '@dcloudio/uni-app'
import { http } from '@/utils'
import { ref } from 'vue'

import { getClassCoursesBaseData, getClassCoursesHistoryResourceList, getTeachResources } from './service'
const homeworkDetailInfo = ref(null)
const resourceList = ref([])
const reachResourcesDetailList = ref([])

onLoad(async (e) => {
  await getResourceList(e.classCoursesHistoryId)
  await getTeachResourcesDetail(e.classCoursesHistoryId)
  await getBaseData(e.classCoursesHistoryId)
})
// 获取课堂资源数据
const getResourceList = async (classCoursesHistoryId) => {
  const res = await getClassCoursesHistoryResourceList({ classCoursesHistoryId })
  resourceList.value = res?.obj
}
// 获取课堂实录、板书数据
const getTeachResourcesDetail = async (chId) => {
  const res = await getTeachResources({ chId })
  const list = await Promise.all(res?.obj.map(async (item) => ({
    ...item,
    url: await getEncryptFilePathURL(item.url),
  })))

  reachResourcesDetailList.value = list
  console.log('==00=======', reachResourcesDetailList.value);
}
// 获取详情基本信息数据
const getBaseData = async (chId) => {
  const res = await getClassCoursesBaseData({ chId })
  console.log(3333333333, res)
  homeworkDetailInfo.value = res.obj
}

// 图片组
const preview = (idx) => {
  uni.previewImage({
    current: idx,
    urls: reachResourcesDetailList.value.filter(item => item.type == 2).map(e => e.url),
  })
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
.class-review-detail {
  .bg-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -1;
    pointer-events: none;
  }

  .content {
    padding: 48rpx 32rpx 48rpx 0;
    height: calc(100vh - 168rpx);
    box-sizing: border-box;
    background: #f8f8f8;
    overflow: auto;

    .class-review-info {
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 252rpx;
      border-radius: 32rpx;
      margin-left: 32rpx;
      padding: 0 40rpx;
      box-sizing: border-box;
      margin-top: 32rpx;

      .name {
        display: flex;
        align-content: center;

        text:nth-child(1) {
          font-size: 40rpx;
          color: #333;
          line-height: 34rpx;
          font-weight: bold;
        }

        text:nth-child(2) {
          margin: 0 12rpx;
          line-height: 40rpx;
          font-size: 30rpx;
          color: #b0b8c7;
        }

        text:nth-child(3) {
          font-size: 30rpx;
          color: #b0b8c7;
          line-height: 40rpx;
        }
      }

      .time {
        font-size: 28rpx;
        color: #666;
        line-height: 32rpx;
        margin-top: 32rpx;
      }

      .chapter {
        font-size: 28rpx;
        color: #666;
        line-height: 32rpx;
        margin-top: 20rpx;
      }
    }

    .classroom-resources {
      background: #fff;
      height: 112rpx;
      border-radius: 32rpx;
      margin-top: 32rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-left: 32rpx;
      padding: 0 40rpx;
      box-sizing: border-box;

      view {
        display: flex;
        align-items: center;

        text {
          font-size: 30rpx;
          color: #253b63;
          line-height: 32rpx;
          margin-left: 16rpx;
        }
      }

      .btn {
        font-size: 30rpx;
        color: #00a0ff;
        line-height: 32rpx;
        font-weight: bold;
      }
    }

    .course-video {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 64rpx;

      .course-video-list {
        width: 328rpx;
        display: flex;
        flex-direction: column;
        margin-left: 30rpx;
        margin-top: 32rpx;

        .img {
          width: 100%;
          height: 183rpx;
          border-radius: 16rpx;
        }

        .video {
          width: 100%;
          height: 183rpx;
          border-radius: 16rpx;
        }

        text {
          font-size: 30rpx;
          color: #333;
          line-height: 32rpx;
          margin-top: 18rpx;
        }
      }
    }
  }
}
</style>
