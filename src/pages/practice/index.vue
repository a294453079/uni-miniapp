<template>
  <view class="practice">
    <image
      src="/static/blueBg2.png"
      :style="{ height: isShowExpandCalendar ? '800rpx !important' : '428rpx !important' }"
      class="bg-image"
      mode="aspectFill"
    />
    <calendar @changeDay="changeDay" @expandCalendarClick="expandCalendarClick" />
    <PagesContainer
      :loading="pageLoading"
      hasCustomNavbar
      :customHeight="isShowExpandCalendar ? 304 : 120"
      scrollContainer
      scrollRefresher
      scrollToLowerAllow
      @onRefresh="onRefreshPage"
    >
      <view class="content" :style="{
        height: isShowExpandCalendar ? 'calc(100vh - 388px)' : 'calc(100vh - 204px)',
      }">
        <u-toast ref="uToastRef"></u-toast>
        <view v-if="practiceList.length != 0" class="w-full">
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
                  <text class="homework-name">{{
                    j.questionnaireName ||
                    j.resourceName ||
                    j.webName ||
                    j.questionnaireActivityName ||
                    j.voteModuleSnapshotName ||
                    j.questionIllustrateName ||
                    j.discussStem
                  }}</text>
                  <view>
                    <text class="font-bold leading-32rpx text-24rpx mr-20rpx" v-if="j.section"
                      >第{{ ToChinese(j.section) }}节</text
                    >
                    <text class="font-bold leading-32rpx text-24rpx">{{ item.courseName }}</text>
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
                  v-else-if="j.submitType == 1"
                  class="w-104rpx h-74rpx right-0 top-0 absolute"
                  src="@/static/practice/attachment-upload-icon.png"
                  alt=""
                />
                <!-- 线下提交 -->
                <img
                  v-else-if="j.submitType == 2"
                  class="w-104rpx h-74rpx right-0 top-0 absolute"
                  src="@/static/practice/offline-icon.png"
                  alt=""
                />
                <!-- 线上学习 -->
                <img
                  v-else-if="j.submitType == 3"
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
        <div v-else class="empty">
          <hEmpty text="暂无练习" />
        </div>
      </view>
    </PagesContainer>
  </view>
  <tabbarShadow />
</template>
<script setup>
  import tabbarShadow from '@/components/tabbar-shadow/tabbar-shadow.vue'
  import PagesContainer from '@/components/pages-container/pages-container.vue'
  import calendar from './calendar.vue'
  import hEmpty from '@/components/common/h-empty.vue'
  import dayjs from 'dayjs'
  import { ToChinese, getModuleTypeIcon } from '@/utils/tools'
  import { http } from '@/utils'
  import { ref, shallowRef, onMounted } from 'vue'
  const { userInfo } = JSON.parse(uni.getStorageSync('userInfo'))
  const practiceList = ref([]) // 练习列表
  const uToastRef = ref(null) // 提示
  const date = ref(dayjs().format('YYYY-MM-DD')) // 传入日期
  const isShowExpandCalendar = ref(false)
  const pageLoading = shallowRef(false)
  // 获取练习列表数据
  const getPageStudentWorkRelease = async (date) => {
    const res = await http.post({
      url: '/app-teach/samples/workRelease/pageStudentWorkRelease',
      data: {
        studentId: userInfo.id,
        endDate: date,
        startDate: date,
        current: 1,
        pageSize: 100,
      },
    })
    if (res.code == 0) {
      practiceList.value = res.obj.records
    }
  }
  const onRefreshPage = () => {
    uni.showLoading({
      title: '加载中'
    })
    getPageStudentWorkRelease(date.value)
  }
  onMounted(async () => {
    await getPageStudentWorkRelease(date.value)
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
  }
  /** 选中日期 */
  const changeDay = async (e) => {
    date.value = e.time
    await getPageStudentWorkRelease(date.value)
  }
  /** 展开日历改变头部背景图片高度 */
  const expandCalendarClick = (e) => {
    isShowExpandCalendar.value = e
  }
</script>

<style lang="scss" scoped>
  .bg-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -1;
    pointer-events: none;
  }
  .practice {
    height: calc(100vh - 2rpx);
    padding-bottom: 2rpx;
    display: flex;
    flex-direction: column;
    .content {
      height: 100%;
      // overflow: auto;
      flex: 1;
      display: flex;
      .practice-list {
        padding-bottom: 1rpx;
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
      .empty {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  ::v-deep .scroll-container {
    background: #f8f8f8;
    padding-bottom: 0rpx !important;
  }
</style>
