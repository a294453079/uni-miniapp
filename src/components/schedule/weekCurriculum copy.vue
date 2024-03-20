<template>
  <view class="content">
    <view class="kebiao">
      <view class="shiduan"> 时段 </view>
      <view class="shiduan">节数</view>
      <view v-for="(data, idx) in datas" :key="idx" class="xingqi">
        <view>
          <view class="xingqiName"> 星期{{ numToChinese(index + 1) }}</view>
          <view class="date">{{ data }}</view>
        </view>
      </view>
    </view>

    <tbody class="kebiao">
      <uni-tr v-for="(o1, idx1) in morning" :key="idx1">
        <uni-td v-if="o1 === 1" class="shiduanName" :style="{ height: morningHeight }">上午</uni-td>
        <uni-td class="jieshu">
          {{ numToChinese(idx1 + 1) }}
        </uni-td>
        <uni-td v-for="(o2, idx2) in 7" class="td" :key="idx2"> name{{ idx2 + 1 }} </uni-td>
      </uni-tr>

      <uni-tr v-for="(o1, idx1) in afternoon" :key="idx1">
        <uni-td v-if="o1 === 1" class="shiduanName" :style="{ height: afternoonHeight }"
          >中午</uni-td
        >
        <uni-td class="jieshu">
          {{ numToChinese(idx1 + 1) }}
        </uni-td>
        <uni-td v-for="(o, idx) in 7" class="td" :key="idx"> name{{ idx + 1 }} </uni-td>
      </uni-tr>

      <uni-tr v-for="(o1, idx1) in night" :key="idx1">
        <uni-td v-if="o1 === 1" class="shiduanName" :style="{ height: nightHeight }">晚上</uni-td>
        <uni-td class="jieshu">
          {{ numToChinese(idx1 + 1) }}
        </uni-td>
        <uni-td v-for="(o, idx) in 7" class="td" :key="idx"> name{{ idx + 1 }} </uni-td>
      </uni-tr>
    </tbody>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        datas: [
          '2021-04-01',
          '2021-04-02',
          '2021-04-03',
          '2021-04-04',
          '2021-04-05',
          '2021-04-06',
          '2021-04-07',
        ],
        morning: 4,
        afternoon: 3,
        night: 2,
        morningHeight: 4 * 80 - 2 + 'px',
        afternoonHeight: 3 * 80 - 2 + 'px',
        nightHeight: 2 * 80 - 2 + 'px',
      }
    },

    watch: {},
    mounted() {},

    methods: {
      numToChinese(num) {
        const chineseNums = [
          '零',
          '一',
          '二',
          '三',
          '四',
          '五',
          '六',
          '七',
          '八',
          '九',
          '十',
          '十一',
          '十二',
          '十三',
        ]
        const strNum = num.toString()
        let result = ''

        for (let i = 0; i < strNum.length; i++) {
          const digit = parseInt(strNum[i])
          result += chineseNums[digit]
        }

        return result
      },
    },
  }
</script>

<style scoped lang="scss">
  .content {
    height: 100vh;
    background: #f8f8f8;
    padding: 10px;
    display: visible;
    overflow-x: auto;

    .kebiao {
      margin-top: 18px;
      width: 880px;
      .shiduan {
        display: flex;
        width: 38px;
        height: 68px;
        float: left;
        color: #080808;
        border-style: solid;
        border-width: 1px;
        justify-content: center;
        align-items: center;
        writing-mode: vertical-rl;
      }
    }

    .xingqi {
      height: 58px;
      float: left;
      text-align: center;
      border-style: solid;
      border-width: 1px;
      justify-content: center;
      align-items: center;
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 10px;
      width: 88px;

      .xingqiName {
        padding-top: 4px;
        color: #080808;
      }

      .date {
        font-size: 14px;
        color: #7c7777;
      }
    }

    .shiduanName {
      float: left;
      border-style: solid;
      border-width: 1px;
      display: flex;
      justify-content: center;
      align-items: center;
      writing-mode: vertical-rl;
      width: 38px;
      // height: 100%;
    }

    .jieshu {
      float: left;
      border-style: solid;
      border-width: 1px;
      display: flex;
      justify-content: center;
      align-items: center;
      writing-mode: vertical-rl;
      width: 38px;
      height: 78px;
    }

    .td {
      float: left;
      width: 108px;
      height: 78px;
      border-style: solid;
      border-width: 1px;
      display: flex;
    }
  }
</style>
