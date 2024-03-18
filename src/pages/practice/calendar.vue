<template>
    <view class="calendar">
      <view class="calendar-cont">
        <view class="calendar-header">
          <view class="ehader-left">
            <text class="month text-22px">{{ month }}月</text>
            <text class="year text-12px ml-10px">{{ currentYear }}</text>
          </view>
          <view class="text-16px flex items-center" v-show="isShowExpandCalendar">
            <img
              @click="prev"
              class="cursor-pointer w-16px h-16px"
              src="@/static/practice/prev-icon.png"
              alt=""
            />
            <img
              @click="next"
              class="cursor-pointer w-16px h-16px ml-15px"
              src="@/static/practice/next-icon.png"
              alt=""
            />
          </view>
        </view>
        <view class="calendar-body" :class="isShowExpandCalendar ? '' : 'h-60px overflow-hidden'">
          <view class="calendar-table">
            <view class="thead">
              <view width="30" v-for="(item, index) in week" :key="index" class="th">
                <view class="text-12px">{{ item.date }}</view>
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
                    <text class="text-15px">{{ item.day }}</text>
                    <!-- <text
                      v-if="item.name"
                      class="text-12px w-50px absolute bottom-2px"
                      style="transform: scale(0.8); background: #00a0ff"
                      >{{ item.name }}</text
                    >
                    <text
                      :style="{
                        top: item.name ? '-2px' : '',
                        right: item.name ? '3px' : '',
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
        <view class="unfold-board" @click="expandCalendarClick"></view>
      </view>
    </view>
  </template>
  
  <script>
    export default {
      data() {
        return {
          isShowExpandCalendar: false, // 是否展开日历
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
          // https://www.gov.cn/zhengce/content/2022-12/08/content_5730844.htm
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
        /** 展开日历 */
        expandCalendarClick() {
          this.isShowExpandCalendar = !this.isShowExpandCalendar
        },
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
  
        /** 切换日历月份 上一月 */
        prev() {
          this.changeMonth()
        },
        /** 切换日历月份 下一月 */
        next() {
          this.changeMonth(1)
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
          this.$emit('changeDay', item)
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
    .calendar {
      .calendar-cont {
        background: #00a0ff;
        position: relative;
        padding: 60px 20px 10px 20px;
        .calendar-header {
          height: 54px;
          display: flex;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .ehader-left {
            display: flex;
            align-items: center;
            .month {
              color: #fff;
              font-weight: bold;
            }
            .year {
              color: #fff;
            }
          }
          .ehader-right {
            .select-month {
              display: flex;
              > div {
                border: 1px solid rgb(235, 238, 245);
                cursor: pointer;
              }
              :nth-child(2) {
                border-left: 0;
                border-right: 0;
              }
            }
          }
        }
        .calendar-body {
          background: #00a0ff;
          border-radius: 10px 10px 10px 10px;
          box-sizing: border-box;
          .calendar-table {
            width: 100%;
            .thead {
              display: flex;
              justify-content: space-between;
            }
            .th {
              padding: 0;
              color: #fff;
              width: 22px;
              height: 22px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 2px;
            }
            .tr {
              height: 30px;
              margin: 4px 0 6px 0;
              display: flex;
              justify-content: space-between;
              // .is-today {
              //   color: rgb(64, 158, 255) !important;
              // }
              .is-selected {
                width: 22px;
                height: 22px;
                background: #fff !important;
                border-radius: 50% !important;
                box-shadow: 1px 1px 1px 0px rgba(48, 17, 63, 0.25);
                color: #00a0ff !important;
              }
              .prev {
                color: #7dcfff !important;
              }
              .current {
                color: #7dcfff !important;
              }
              .td {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                height: 22px;
                width: 22px;
                text-align: center;
                cursor: pointer;
                font-weight: bold;
                view {
                  height: 22px;
                  width: 22px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  box-sizing: border-box;
                  position: relative;
                  margin: 0 auto;
                  color: #fff;
                  .xiu {
                    color: #81c885;
                    position: absolute;
                    font-size: 12px;
                    right: -2px;
                    top: -3px;
                    transform: scale(0.5);
                  }
                  .work {
                    position: absolute;
                    color: #ff9c6e;
                    font-size: 12px;
                    right: -2px;
                    top: -3px;
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
        .unfold-board {
          width: 34px;
          height: 4px;
          background: #bcdfff;
          border-radius: 18px;
          cursor: pointer;
          position: absolute;
          bottom: 3px;
          left: 50%;
          margin-left: -17px;
        }
      }
    }
  </style>
  