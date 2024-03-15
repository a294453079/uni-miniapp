<template>
  <view>
    <view class="watermark"></view>

    <view class="header">
      <view class="title">{{ scoreInfo.realname }}的学考成绩及录取结果：</view>
      <view class="realname">
        <text class="label"> 报名序号：{{ scoreInfo.serial_number }}</text>
        <text class="value">身份证号后四位：{{ scoreInfo.idcard }}</text>
      </view>
    </view>

    <view class="main" v-if="isSecondGrade">
      <view class="results">
        <view class="item">
          地理：
          <text class="score">{{ formatScore(scoreInfo.geography) }}</text>
        </view>
        <view class="item">
          生物：
          <text class="score">{{ formatScore(scoreInfo.organism) }}</text>
        </view>

        <view class="item">
          生物实验：
          <text class="score">{{ formatScore(scoreInfo.biological_experiment) }}</text>
        </view>

        <text class="item">\n</text>
      </view>
    </view>
    <view v-else class="main">
      <view class="results">
        <view class="item">
          政治：
          <text class="score">{{ formatScore(scoreInfo.political) }}</text>
        </view>
        <view class="item">
          语文：
          <text class="score">{{ formatScore(scoreInfo.language) }}</text>
        </view>
        <view class="item">
          数学：
          <text class="score">{{ formatScore(scoreInfo.mathematics) }}</text>
        </view>
        <view class="item">
          物理：
          <text class="score">{{ formatScore(scoreInfo.physics) }}</text>
        </view>
        <view class="item">
          化学：
          <text class="score">{{ formatScore(scoreInfo.chemistry) }}</text>
        </view>
        <view class="item">
          英语：
          <text class="score">{{ formatScore(scoreInfo.english) }}</text>
        </view>
        <view class="item">
          历史：
          <text class="score">{{ formatScore(scoreInfo.history) }}</text>
        </view>
        <view class="item">
          地理：
          <text class="score">{{ formatScore(scoreInfo.geography) }}</text>
        </view>
        <view class="item">
          生物：
          <text class="score">{{ formatScore(scoreInfo.organism) }}</text>
        </view>
        <view class="item">
          体育：
          <text class="score">{{ formatScore(scoreInfo.sports) }}</text>
        </view>
        <view class="item">
          物理实验：
          <text class="score">{{ formatScore(scoreInfo.physics_operate) }}</text>
        </view>
        <view class="item">
          化学实验：
          <text class="score">{{ formatScore(scoreInfo.chemistry_operate) }}</text>
        </view>
        <view class="item">
          生物实验：
          <text class="score">{{ formatScore(scoreInfo.biological_experiment) }}</text>
        </view>
        <view class="item">
          优惠加分：
          <text class="score">{{ formatScore(scoreInfo.bonus_points) }}</text>
        </view>
        <view class="item total">
          综合总分：
          <text class="score">{{ formatScore(scoreInfo.total_score) }}</text>
        </view>
        <view class="item1">
          <text>录取学校：</text> <text class="score">{{ scoreInfo.school_name }}</text>
        </view>
      </view>
    </view>
    <view class="footer">本服务由赣州市教育局提供</view>
  </view>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'

  const scoreInfo = ref({})

  const isSecondGrade = computed(() => {
    if (scoreInfo.value?.serial_number) {
      return Number(scoreInfo.value?.serial_number?.slice(9, 10)) === 8
    }

    return false
  })

  onLoad(() => {
    scoreInfo.value = uni.getStorageSync('SCORE')
  })

  const formatScore = (e) => (e ? String((+e).toFixed(2)) : '')
</script>

<style scoped lang="scss">
  .watermark {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: url('/static/watermark.png');
    pointer-events: none;
  }

  .header {
    margin: 49rpx 30rpx 43rpx;
    .title {
      color: #2b64ff;
      font-size: 38rpx;
    }
    .realname {
      display: flex;
      justify-content: space-between;
      margin-top: 30rpx;
      .label {
        color: #666666;
      }
      .value {
        color: #333;
      }
    }
  }

  .main {
    .results {
      display: flex;
      flex-wrap: wrap;
      margin: 0 30rpx 30rpx;
      background: white;
      box-shadow: 0 0 5rpx 0 rgba(0, 0, 0, 0.2);
      border-radius: 10rpx;
      overflow: hidden;
      .item {
        font-size: 34rpx;
        color: #666666;
        width: 50%;
        box-sizing: border-box;
        padding: 20rpx 27rpx;
        border-right: 1px solid #d8d8d8;
        border-bottom: 1px solid #d8d8d8;
        .score {
          color: #2b64ff;
        }
      }

      .item1 {
        font-size: 34rpx;
        color: #666666;
        width: 100%;
        box-sizing: border-box;
        padding: 20rpx 27rpx;
        border-right: 1px solid #d8d8d8;
        border-bottom: 1px solid #d8d8d8;
        .score {
          color: #2b64ff;
        }
      }

      .item2 {
        font-size: 34rpx;
        color: #666666;
        box-sizing: border-box;
        padding: 20rpx 27rpx;
        border-right: 1px solid #d8d8d8;
        border-bottom: 1px solid #d8d8d8;
        .score {
          color: #2b64ff;
        }
      }

      .total {
        width: 100%;
        text-align: right;
      }
    }
  }
</style>
