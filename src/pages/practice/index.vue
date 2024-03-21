<template>
  <view class="practice">
    <u-toast ref="uToastRef"></u-toast>
    <calendar @changeDay="changeDay" />
    <view>
      <view v-for="(item, index) in practiceList" :key="index" class="practice-list">
        <view class="practice-box">
          <img
            class="w-104rpx h-102rpx mr-30rpx"
            src="@/static/practice/practice-icon.png"
            alt=""
          />
          <view class="info">
            <text class="practice-name">{{ item.name }}</text>
            <view>今日练习：{{ item.workReleaseOutDTOList.length }}</view>
          </view>
        </view>
        <view v-for="(j, idx) in item.workReleaseOutDTOList" :key="idx" class="homework-list">
          <view class="homework-info">
            <img
              class="w-80rpx h-80rpx mr-24rpx"
              :src="getModuleTypeIcon(j.contentType, j.fileFormat)"
              alt=""
            />
            <view class="info">
              <text class="homework-name">{{ j.name }}</text>
              <view>
                <text class="font-bold leading-32rpx text-24rpx" v-if="j.section"
                  >第{{ ToChinese(j.section) }}节</text
                >
                <text class="ml-20rpx font-bold leading-32rpx text-24rpx">{{
                  item.courseName
                }}</text>
              </view>
            </view>
            <!-- 作答 -->
            <img
              v-if="j.contentType == 1"
              class="w-104rpx h-74rpx right-0 top-0 absolute"
              src="@/static/practice/questionnaire-icon.png"
              alt=""
            />
            <!-- 附件上传 -->
            <img
              v-if="j.submitType == 1"
              class="w-104rpx h-74rpx right-0 top-0 absolute"
              src="@/static/practice/attachment-upload-icon.png"
              alt=""
            />
            <!-- 线下提交 -->
            <img
              v-if="j.submitType == 2"
              class="w-104rpx h-74rpx right-0 top-0 absolute"
              src="@/static/practice/offline-icon.png"
              alt=""
            />
            <!-- 线上学习 -->
            <img
              v-if="j.submitType == 3"
              class="w-104rpx h-74rpx right-0 top-0 absolute"
              src="@/static/practice/online-icon.png"
              alt=""
            />
          </view>
          <view class="homework-btn" @click="handleSeePracticeDetail(j)">
            <text>{{
              j.contentType == 1
                ? '开始作答'
                : j.submitType == 1 || j.submitType == 3
                ? '去完成'
                : '查看详情'
            }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
  // app-teach/samples/workRelease/pageStudentWorkRelease
  import calendar from './calendar.vue'
  import dayjs from 'dayjs'
  import { ToChinese, getFileImgUrl } from '@/utils/tools'
  import { http } from '@/utils'
  import { ref, onMounted } from 'vue'
  const { userInfo } = JSON.parse(uni.getStorageSync('userInfo'))
  const practiceList = ref([])
  const formatList = ref([])
  const uToastRef = ref(null)
  // 获取练习列表数据
  const getPageStudentWorkRelease = async (date) => {
    const res = await http.post({
      url: '/app-teach/samples/workRelease/pageStudentWorkRelease',
      data: {
        studentId: userInfo.id,
        endDate: date,
        startDate: date,
        current: 1,
        pageSize: 10,
      },
    })
    console.log(res.obj)
    if (res.code == 0) {
      practiceList.value = res.obj.records
    }
  }
  // 获取图片类型数据
  const getFileFormatsList = async (date) => {
    const res = await http.post({
      url: '/resource-center/fileFormats/list',
      data: {
        id: '',
        name: '',
        formats: '',
        imgUrl: '',
        status: 1,
        sort: '',
      },
    })
    console.log(res)
    if (res.code == 0) {
      formatList.value = res.data
    }
  }

  onMounted(async () => {
    await getFileFormatsList()
    await getPageStudentWorkRelease(dayjs().format('YYYY-MM-DD'))
  })

  /** 查看练习详情 */
  const handleSeePracticeDetail = (item) => {
    const urgentContentTypes = ['1', '5', '6', '7', '8']
    if (urgentContentTypes.includes(item.contentType)) {
      uToastRef.value.show({
        message: '详情页已经在加急开发中了哟',
      })
    } else {
      uni.navigateTo({
        url: `/components/practiceDetail/detail?id=${item.homeworkStudentId}`,
      })
    }
    console.log(item)
  }

  /** 选中日期 */
  const changeDay = (e) => {
    console.log('根据选中的日期获取最新数据', e)
  }

  const getModuleTypeIcon = (moduleType, fileFormat) => {
    const moduleTypeIcons = {
      1: '/static/practice/fileIcon/paper-icon.png',
      2: '/static/practice/fileIcon/web-icon.png',
      5: '/static/practice/fileIcon/vote-icon.png',
      6: '/static/practice/fileIcon/questioning-icon.png',
      7: '/static/practice/fileIcon/discuss-icon.png',
      8: '/static/practice/fileIcon/questionnaire-icon.png',
    }

    if (moduleType in moduleTypeIcons) {
      return moduleTypeIcons[moduleType]
    } else {
      return getFileImgUrl(fileFormat)
    }
  }
</script>

<style lang="scss" scoped>
  .practice {
    background: #f8f8f8;
    padding-bottom: 2rpx;
    .practice-list {
      .practice-box {
        height: 200rpx;
        background: #fff;
        display: flex;
        align-items: center;
        padding: 0 60rpx;
        box-sizing: border-box;
        .info {
          display: flex;
          flex-direction: column;
          .practice-name {
            font-weight: bold;
            font-size: 34rpx;
            color: #474747;
            line-height: 36rpx;
            margin-bottom: 20rpx;
          }
          view {
            width: 210rpx;
            height: 60rpx;
            font-size: 28rpx;
            color: #ff9500;
            line-height: 24rpx;
            font-weight: bold;
            background: #fff6f0;
            border-radius: 60rpx;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
      .homework-list {
        background: #fff;
        margin: 32rpx 32rpx 0 32rpx;
        height: 180rpx;
        border-radius: 32rpx;
        padding: 0 20rpx 0 40rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        .homework-info {
          display: flex;
          align-items: center;
          .info {
            display: flex;
            flex-direction: column;
            .homework-name {
              font-size: 30rpx;
              font-weight: bold;
              line-height: 32rpx;
              color: #474747;
              margin-bottom: 12rpx;
              width: 320rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            view {
              display: flex;
              align-items: center;
              color: #6a6a6a;
              .section {
              }
            }
          }
        }
        .homework-btn {
          width: 160rpx;
          height: 64rpx;
          background: #00a0ff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 32rpx;
          cursor: pointer;
          text {
            font-size: 28rpx;
            color: #fff;
            line-height: 32rpx;
            font-weight: bold;
          }
        }
      }
      .homework-list:last-of-type {
        margin-bottom: 26rpx;
      }
    }
  }
</style>
