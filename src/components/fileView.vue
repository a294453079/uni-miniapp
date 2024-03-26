<template>
  <image src="/static/blueBg2.png" class="bg-image" mode="top" />
  <navbar
    :title="title"
    :titleStyle="{
      color: '#fff',
      fontSize: '36rpx',
    }"
  ></navbar>
  <view class="file-view" v-if="resourceInfo != null">
    <web-view v-if="resourceType == 3" class="web-view" :src="resourceInfo.webUrl"></web-view>

    <view class="view-box" v-else>
      <!-- 网页预览 -->
      <web-view
        v-if="viewType(resourceInfo.fileFormat) == 1"
        class="web-view"
        :src="resourceUrl"
      ></web-view>
      <!-- 图片预览 -->
      <image
        class="w-full"
        v-if="viewType(resourceInfo.fileFormat) == 4"
        :src="resourceUrl"
        @tap="preview"
        mode="scaleToFill"
      ></image>
      <!-- 视频预览 -->
      <!-- 无法预览格式rmvb -->
      <view v-if="viewType(resourceInfo.fileFormat) == 2 && isVideoView !== null">
        <video
          v-if="isVideoView"
          class="w-full"
          ref="videos"
          id="myVideo"
          :src="resourceUrl"
          initial-time="initial_time"
          autoplay
        ></video>
        <view v-if="!isVideoView">该视频资源格式无法预览</view>
      </view>
      <!-- 音频预览 -->
      <audio
        id="myAudio"
        class="w-full"
        @tap="audioClick"
        :src="resourceUrl"
        v-if="viewType(resourceInfo.fileFormat) == 3"
        controls
        autoplay
      ></audio>
    </view>
  </view>
</template>
<script setup>
  import { onLoad } from '@dcloudio/uni-app'
  import { defineProps, ref } from 'vue'
  import { getEncryptFilePathURL } from '@/utils/tools.js'
  const { formatList } = JSON.parse(uni.getStorageSync('userInfo'))
  defineProps({
    text: {
      type: String,
      default: '暂无数据',
    },
  })
  const imgList = ref([]) // 图片组
  const unVideoViewList = ref(['rm', 'rmvb', 'flv', 'wmv', 'avi', 'swf', 'qlv', 'qsv', 'kux']) // 不兼容的视频格式列表
  const isVideoView = ref(null) // 判断视频能否播放
  const resourceType = ref(0) // 资源类型
  const resourceInfo = ref(null) // 资源信息
  const resourceUrl = ref('') // 资源地址
  const title = ref('练习内容') // 资源名称

  onLoad(async (e) => {
    title.value = e.title
    resourceType.value = e.type
    resourceInfo.value = JSON.parse(decodeURIComponent(e.data))
    isVideoView.value = unVideoViewList.value.indexOf(resourceInfo.value.fileFormat) === -1 || false
    if (resourceType.value != 3) {
      await getResourceUrl()
    }
  })

  // 获取练习详情
  const getResourceUrl = async () => {
    const data = await getEncryptFilePathURL(resourceInfo.value.resourceUrl) // 获取文件全路径
    resourceUrl.value = data
    if (viewType(resourceInfo.value.fileFormat) == 4) {
      imgList.value.push(resourceUrl.value)
    }
  }

  // 类型判断
  const viewType = (type) => {
    let url = formatList.filter((item) => item.formats.indexOf(type) !== -1)
    if (url.length > 0) {
      return url[0].viewType
    }
  }
  // 图片组
  const preview = () => {
    uni.previewImage({
      current: resourceUrl.value,
      urls: imgList.value,
    })
  }
</script>

<style lang="scss" scoped>
  .bg-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 392rpx !important;
    z-index: -1;
    pointer-events: none;
  }
  .file-view {
    background: #fff;
    .web-view {
      position: absolute;
    }

    .view-box audio {
      margin: 20rpx 74rpx;
    }
  }
</style>
