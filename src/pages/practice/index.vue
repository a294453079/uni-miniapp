<template>
  <view class="practice">
    <calendar @changeDay="changeDay" />
    <view>
      <view v-for="(item, index) in 2" :key="index" class="practice-list">
        <view class="practice-box">
          <img class="w-52px h-51px mr-15px" src="@/static/practice/practice-icon.png" alt="" />
          <view class="info">
            <text class="practice-name">二次函数课后作业</text>
            <view>今日练习：2 </view>
          </view>
        </view>
        <view v-for="(j, idx) in 2" :key="idx" class="homework-list">
          <view class="homework-info">
            <!-- <img class="w-40px h-40px mr-12px" :src="getModuleTypeIcon(j.contentType, j.fileFormat)" alt="" /> -->
            <img class="w-40px h-40px mr-12px" src="@/static/practice/fileIcon/discuss-icon.png" alt="" />
            <view class="info">
              <text class="homework-name">二次函数课后作业</text>
              <view>
                <text class="font-bold leading-16px text-12px">第二节</text>
                <text class="ml-10px font-bold leading-16px text-12px">语文</text>
              </view>
            </view>
            <img class="w-52px h-37px right-0 top-0 absolute" src="@/static/practice/online-icon.png" alt="">
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
    padding-bottom: 1px;
    .practice-list {
      .practice-box {
        height: 100px;
        background: #fff;
        display: flex;
        align-items: center;
        padding: 0 30px;
        box-sizing: border-box;
        .info {
          display: flex;
          flex-direction: column;
          .practice-name {
            font-weight: bold;
            font-size: 17px;
            color: #474747;
            line-height: 18px;
            margin-bottom: 10px;
          }
          view {
            width: 105px;
            height: 30px;
            font-size: 14px;
            color: #ff9500;
            line-height: 12px;
            font-weight: bold;
            background: #fff6f0;
            border-radius: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
      .homework-list {
        background: #fff;
        margin: 16px 16px 0 16px;
        height: 90px;
        border-radius: 16px;
        padding: 0 10px 0 20px;
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
              font-size: 15px;
              font-weight: bold;
              line-height: 16px;
              color: #474747;
              margin-bottom: 6px;
              width: 160px;
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
          width: 80px;
          height: 32px;
          background: #00a0ff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          cursor: pointer;
          text {
            font-size: 14px;
            color: #fff;
            line-height: 16px;
            font-weight: bold;
          }
        }
      }
      .homework-list:last-of-type {
        margin-bottom: 13px;
      }
    }
  }
</style>
