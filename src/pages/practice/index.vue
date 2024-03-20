<template>
  <view class="practice">
    <calendar @changeDay="changeDay" />
    <view>
      <view v-for="(item, index) in 2" :key="index" class="practice-list">
        <view class="practice-box">
          <img class="w-104rpx h-102rpx mr-30rpx" src="@/static/practice/practice-icon.png" alt="" />
          <view class="info">
            <text class="practice-name">二次函数课后作业</text>
            <view>今日练习：2 </view>
          </view>
        </view>
        <view v-for="(j, idx) in 2" :key="idx" class="homework-list">
          <view class="homework-info">
            <!-- <img class="w-80rpx h-80rpx mr-24rpx" :src="getModuleTypeIcon(j.contentType, j.fileFormat)" alt="" /> -->
            <img class="w-80rpx h-80rpx mr-24rpx" src="@/static/practice/fileIcon/discuss-icon.png" alt="" />
            <view class="info">
              <text class="homework-name">二次函数课后作业</text>
              <view>
                <text class="font-bold leading-32rpx text-24rpx">第二节</text>
                <text class="ml-20rpx font-bold leading-32rpx text-24rpx">语文</text>
              </view>
            </view>
            <img class="w-104rpx h-74rpx right-0 top-0 absolute" src="@/static/practice/online-icon.png" alt="">
          </view>
          <view class="homework-btn">
            <text>查看详情</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import calendar from './calendar.vue'
  export default {
    components: {
      calendar,
    },
    data() {
      return {}
    },
    created() {},
    mounted() {},
    methods: {
      /** 选中日期 */
      changeDay(e) {
        console.log('根据选中的日期获取最新数据', e);
      },
      getModuleTypeIcon(moduleType, fileFormat) {
        const moduleTypeIcons = {
          1: require('@/static/practice/fileIcon/paper-icon.png'),
          2: require('@/static/practice/fileIcon/web-icon.png'),
          5: require('@/static/practice/fileIcon/vote-icon.png'),
          6: require('@/static/practice/fileIcon/questioning-icon.png'),
          7: require('@/static/practice/fileIcon/discuss-icon.png'),
          8: require('@/static/practice/fileIcon/questionnaire-icon.png'),
        }

        if (moduleType in moduleTypeIcons) {
          return moduleTypeIcons[moduleType]
        } else {
          return this.imgUrl(fileFormat)
        }
      },
      imgUrl(type) {
        let urlList = this.formatList.filter((item) => item.formats.indexOf(type) !== -1)
        if (urlList.length > 0) {
          return require('@/static/practice/fileIcon/' + urlList[0].imgUrl)
        }
      },
    },
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
