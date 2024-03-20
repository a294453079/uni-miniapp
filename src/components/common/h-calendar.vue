<template>
  <view class="calendar">
    <view class="calendar-cont">
      <view class="calendar-header">
        <view class="close">
          <text>选择日期</text>
          <img class="w-40rpx h-40rpx" @click="closeDay" src="@/static/calendar/close-icon.png" alt="" />
        </view>
        <view class="switch-date">
          <view class="flex">
            <img
              @click="prev('year')"
              class="switch-icon mr-48rpx"
              src="@/static/calendar/switch-prev-year-icon.png"
              alt=""
            />
            <img
              @click="prev('month')"
              class="switch-icon"
              src="@/static/calendar/switch-prev-month-icon.png"
              alt=""
            />
          </view>
          <text
            >{{ currentYear }}-{{ month < 10 ? '0' + month : month }}-{{
              day < 10 ? '0' + day : day
            }}</text
          >
          <view class="flex">
            <img
              @click="next('month')"
              class="switch-icon mr-48rpx"
              src="@/static/calendar/switch-next-month-icon.png"
              alt=""
            />
            <img
              @click="next('year')"
              class="switch-icon"
              src="@/static/calendar/switch-next-year-icon.png"
              alt=""
            />
          </view>
        </view>
      </view>
      <view class="calendar-body">
        <view class="calendar-table">
          <view class="thead">
            <view width="30" v-for="(item, index) in week" :key="index" class="th">
              <text>{{ item.date }}</text>
            </view>
          </view>
          <view class="tbody">
            <view v-for="(val, inx) in datas" :key="inx" class="tr">
              <view class="td" v-for="(item, index) in val" :key="index" @click="changeDay(item)">
                <div
                  :class="[
                    item.isMonth,
                    { 'is-today': item.isToday },
                    { 'is-selected': selectTimeStep == item.timeStamp },
                  ]"
                  class="flex items-center justify-center"
                >
                  <text class="text-30rpx leading-32rpx">{{ item.day }}</text>
                  <!-- <text
                      v-if="item.name"
                      class="text-24rpx w-100rpx absolute bottom-4rpx"
                      style="transform: scale(0.8); background: #00a0ff"
                      >{{ item.name }}</text
                    >
                    <text
                      :style="{
                        top: item.name ? '-4rpx' : '',
                        right: item.name ? '6rpx' : '',
                      }"
                      v-if="item.isXiu || item.isWork"
                      :class="[{ xiu: item.isXiu }, { work: item.isWork }]"
                      >{{ item.isXiu ? '休' : '班' }}</text
                    > -->
                </div>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        year: null, // 当前正在查阅年份（翻到2022年那就是2022）
        month: null, // 当前正在查阅月份
        day: null, // 当前正在查阅天
        today: null, // 今日日期
        datas: [], // 数据格式
        isToday: [], // 今天日期 拆分为数组
        selectTimeStep: null, // 选中日期时间戳
        times: null,
        selectShow: false,
        years: [],
        currentYear: new Date().getFullYear(), // 年份
        week: [
          {
            date: '一',
            day: 'Mon',
          },
          {
            date: '二',
            day: 'Tue',
          },
          {
            date: '三',
            day: 'Wed',
          },
          {
            date: '四',
            day: 'Thu',
          },
          {
            date: '五',
            day: 'Fri',
          },
          {
            date: '六',
            day: 'Sat',
          },
          {
            date: '日',
            day: 'Sun',
          },
        ],
        holidayData: [
          {
            date: '2023-01-01',
            start: '2022-12-31',
            end: '2023-01-02',
            name: '元旦',
            supplementaryShift: null,
          },
          {
            date: '2023-01-22',
            start: '2023-01-21',
            end: '2023-01-27',
            name: '春节',
            supplementaryShift: '2023-01-28、2023-01-29',
          },
          {
            date: '2023-04-05',
            start: '2023-04-05',
            end: '2023-04-05',
            name: '清明节',
            supplementaryShift: null,
          },
          {
            date: '2023-05-01',
            start: '2023-04-29',
            end: '2023-05-03',
            name: '劳动节',
            supplementaryShift: '2023-04-23、2023-05-06',
          },
          {
            date: '2023-06-22',
            start: '2023-06-22',
            end: '2023-06-24',
            name: '端午节',
            supplementaryShift: '2023-06-25',
          },
          {
            date: '2023-09-29',
            start: '2023-09-29',
            end: '2023-09-30',
            name: '中秋节',
            supplementaryShift: null,
          },
          {
            date: '2023-10-01',
            start: '2023-10-01',
            end: '2023-10-06',
            name: '国庆节',
            supplementaryShift: '2023-10-07、2023-10-08',
          },
        ],
      }
    },
    created() {
      this.int()
    },
    mounted() {
      this.generateYearList()
    },
    methods: {
      getCurrentDate() {
        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1
        const date = currentDate.getDate()
        const day = currentDate.toLocaleDateString('zh-CN', { weekday: 'long' })
        const formattedDate = `${year}年${month}月${date}日${day}`
        return formattedDate
      },
      int() {
        const date = new Date()
        this.isToday[0] = this.year = date.getFullYear()
        this.isToday[1] = this.month = date.getMonth() + 1
        this.isToday[2] = this.day = date.getDate()
        this.today = `${this.year}-${this.month}-${this.day}`
        this.selectTimeStep = new Date(
          `${this.isToday[0]}/${this.isToday[1]}/${this.isToday[2]}`,
        ).getTime()
        this.initDate()
      },
      /** 回到当前日期 */
      handleCurrentDate() {
        this.int()
      },

      /** 切换日历月份&年份 上 */
      prev(type) {
        console.log(type)
        if (type == 'year') {
          this.year = this.year - 1
          this.currentYear = this.currentYear - 1
          this.initDate()
        } else {
          this.changeMonth()
        }
      },
      /** 切换日历月份&年份 下 */
      next(type) {
        console.log(type)
        if (type == 'year') {
          this.year = this.year + 1
          this.currentYear = this.currentYear + 1
          this.initDate()
        } else {
          this.changeMonth(1)
        }
      },

      /** 处理切换日历月份数据 */
      changeMonth(increment) {
        if (increment === 1) {
          if (this.currentYear === this.years[this.years.length - 1] && this.month === 12) return

          this.month = this.month === 12 ? 1 : this.month + 1
          this.currentYear = this.month === 1 ? this.currentYear + 1 : this.currentYear
        } else {
          if (this.currentYear === this.years[0] && this.month === 1) return

          this.month = this.month === 1 ? 12 : this.month - 1
          this.currentYear = this.month === 12 ? this.currentYear - 1 : this.currentYear
        }
        this.initDate()
      },

      /** 选择年份 */
      handleYears(e) {
        this.year = e
      },
      /** 选择月份 */
      handleMonth(e) {
        this.month = e
        this.currentYear = this.year
        this.initDate()
      },
      /** 初始化日历数据 */
      initDate() {
        this.selectShow = false
        let lastMonth = []
        let calendarMonth = []
        let isWeek =
          new Date(this.year, this.month - 1, 1).getDay() == 0
            ? 6
            : new Date(this.year, this.month - 1, 1).getDay() - 1 //当月开始是周几

        let isMonthDay = new Date(this.year, this.month, 0).getDate() //当月多少天
        let isPrevMonthDay = new Date(this.year, this.month - 1, 0).getDate() //上个月是多少天
        let isNotFirstMonday = isWeek + 1 < 7

        /** 当月数据 */
        for (let i = 1; i < isMonthDay + 1; i++) {
          calendarMonth.push({
            day: i,
            timeStamp: new Date(`${this.year}/${this.month}/${i}`).getTime(),
            isWork: false,
            isXiu: false,
            isMonth: '',
            isToday:
              this.isToday[0] == this.year && this.isToday[1] == this.month && this.isToday[2] == i,
            time: `${this.year}-${this.month > 9 ? this.month : '0' + this.month}-${
              i > 9 ? i : '0' + i
            }`,
          })
        }

        /** 上月数据 */
        if (isNotFirstMonday) {
          for (let k = isPrevMonthDay - isWeek; k < isPrevMonthDay + 1; k++) {
            lastMonth.push({
              day: k,
              timeStamp: new Date(
                `${this.month == 12 ? this.year - 1 : this.year}/${this.month - 1}/${k}`,
              ).getTime(),
              isWork: false,
              isXiu: false,
              isMonth: 'prev',
              isToday: false,
              time: `${this.month == 12 ? this.year - 1 : this.year}-${
                this.month - 1 > 9 ? this.month - 1 : '0' + (this.month - 1)
              }-${k > 9 ? k : '0' + k}`,
            })
          }
        }

        /** 判断当月是否从周一开始 */
        let pageTotalDay = !isNotFirstMonday ? 49 : 42

        /** 下月数据 */
        for (let y = 1; y < pageTotalDay - (isMonthDay + isWeek); y++) {
          calendarMonth.push({
            day: y,
            timeStamp: new Date(
              `${this.month == 12 ? this.year + 1 : this.year}/${this.month + 1}/${y}`,
            ).getTime(),
            isWork: false,
            isXiu: false,
            isMonth: 'current',
            isToday: false,
            time: `${this.month == 12 ? this.year + 1 : this.year}-${
              this.month + 1 > 9 ? this.month + 1 : '0' + (this.month + 1)
            }-${y > 9 ? y : '0' + y}`,
          })
        }

        calendarMonth = [...lastMonth, ...calendarMonth]
        this.datas = this.spArr(calendarMonth, 7)

        // 循环遍历a数组的每个子数组
        for (let i = 0; i < this.datas.length; i++) {
          let subArray = this.datas[i]

          // 循环遍历子数组中的对象
          for (let j = 0; j < subArray.length; j++) {
            let item = subArray[j]

            // 遍历this.holidayData数组进行匹配和判断
            for (let k = 0; k < this.holidayData.length; k++) {
              let holiday = this.holidayData[k]

              if (item.time === holiday.date) {
                item.name = holiday.name
                item.isXiu = true
              } else if (item.time >= holiday.start && item.time <= holiday.end) {
                item.isXiu = true
              }

              if (
                holiday.supplementaryShift &&
                holiday.supplementaryShift.includes(item.time.split('T')[0])
              ) {
                item.isWork = true
              }
            }
          }
        }

        console.log(this.datas)
      },
      /** 格式化数据 */
      spArr(arr, num) {
        if (num < 1) {
          return newArr
        }
        let newArr = []
        for (let i = 0; i < arr.length; ) {
          newArr.push(arr.slice(i, (i += num)))
        }
        return newArr
      },
      /** 点击上个月 */
      prevMonth() {
        if (this.month < 2) {
          this.month = 12
          this.year -= 1
        } else {
          this.month -= 1
        }
        this.initDate()
      },
      /** 点击下个月 */
      nextMonth() {
        if (this.month > 11) {
          this.month = 1
          this.year += 1
        } else {
          this.month += 1
        }
        this.initDate()
      },
      /** 点击日历 */
      changeDay(item) {
        if (item.isMonth == 'prev') {
          this.prevMonth()
        } else if (item.isMonth == 'current') {
          this.nextMonth()
        }
        this.selectTimeStep = item.timeStamp
        this.day = item.day
        this.$emit('changeDay', item)
      },
      /** 关闭弹框 */
      closeDay() {
        this.$emit('closeDay', false)
      },
      /** 移入切换年份 */
      yearsMouseenter() {
        this.selectShow = true
        clearTimeout(this.times)
        this.year = this.currentYear
        /** 高亮定位中间 */
        this.$nextTick(() => {
          document.querySelector('.year-box').scrollTop =
            document.querySelector('.year').offsetTop - 80
          document.querySelector('.month-box').scrollTop =
            document.querySelector('.month').offsetTop - 80
        })
      },
      /** 移出切换科年份*/
      yearsMouseout() {
        this.times = setTimeout(() => {
          this.selectShow = false
        }, 200)
      },
      /** 获取前后50年数据 */
      generateYearList() {
        for (let i = this.currentYear - 50; i <= this.currentYear + 50; i++) {
          this.years.push(i)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .u-popup__content {
    border-radius: 40rpx !important;
  }
  .calendar {
    .calendar-cont {
      position: relative;
      .calendar-header {
        .close {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32rpx;
          box-sizing: border-box;
          background: #f9faff;
          text {
            font-size: 34rpx;
            color: #333;
            line-height: 48rpx;
            font-weight: bold;
          }
        }
        .switch-date {
          height: 104rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 50rpx;
          box-sizing: border-box;
          background: #f9faff;
          .switch-icon {
            width: 64rpx;
            height: 64rpx;
          }
          text {
            font-size: 40rpx;
            color: #333;
            line-height: 32rpx;
          }
        }
      }
      .calendar-body {
        background: #fff;
        border-radius: 20rpx;
        box-sizing: border-box;
        .calendar-table {
          width: 100%;
          .thead {
            background: #f9faff;
            display: flex;
            justify-content: space-between;
            padding: 0 24rpx;
            .th {
              font-size: 30rpx;
              color: #666;
              line-height: 32rpx;
              width: 96rpx;
              height: 96rpx;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          .tbody {
            padding: 0 24rpx;
            box-sizing: border-box;
            .tr {
              display: flex;
              justify-content: space-between;
              .is-selected {
                width: 80rpx;
                height: 80rpx;
                color: #fff !important;
                background: linear-gradient(124deg, #65de86 6%, #5bc7a4 100%) !important;
                border-radius: 16rpx !important;
              }
              .prev {
                color: #a6b2c9 !important;
              }
              .current {
                color: #a6b2c9 !important;
              }
              .td {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                height: 96rpx;
                width: 96rpx;
                text-align: center;
                view {
                  height: 80rpx;
                  width: 80rpx;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  box-sizing: border-box;
                  position: relative;
                  margin: 0 auto;
                  color: #333;
                  .xiu {
                    color: #81c885;
                    position: absolute;
                    font-size: 24rpx;
                    right: -4rpx;
                    top: -6rpx;
                    transform: scale(0.5);
                  }
                  .work {
                    position: absolute;
                    color: #ff9c6e;
                    font-size: 24rpx;
                    right: -4rpx;
                    top: -6rpx;
                    transform: scale(0.5);
                  }
                }
                div:hover {
                  border-radius: 50%;
                  background: rgba(216, 216, 216, 0.2);
                }
              }
            }
          }
        }
      }
    }
  }
</style>
