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
            <img @click="prev('year')" class="switch-icon mr-48rpx" src="@/static/calendar/switch-prev-year-icon.png"
              alt="" />
            <img @click="prev('month')" class="switch-icon" src="@/static/calendar/switch-prev-month-icon.png" alt="" />
          </view>
          <text>{{ currentYear }}年{{ month < 10 ? '0' + month : month }}月</text>
              <view class="flex">
                <img @click="next('month')" class="switch-icon mr-48rpx"
                  src="@/static/calendar/switch-next-month-icon.png" alt="" />
                <img @click="next('year')" class="switch-icon" src="@/static/calendar/switch-next-year-icon.png"
                  alt="" />
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
            <view v-for="(val, inx) in datas" :key="inx" class="tr"
              :style="{ background: selectCalendarCellDatas(val) ? '#EFFBF4' : pickerOptions(val) ? '#F5F7FA' : '' }">
              <view class="td" v-for="(item, index) in val" :key="index" @click="changeDay(item, val)" :style="{
            background: selectCalendarCellSonStyle(item)
              ? '#EFFBF4'
              : pickerSonOptions(item)
                ? '#F5F7FA'
                : '',
          }">
                <div :class="[
            item.isMonth,
            {
              'is-selected':
                scheduleTabsactive == 0
                  ? selectTimeStep == item.timeStamp
                  : selectCalendarCellSonStyle(item) &&
                  calendarRange(item, val),
            },
          ]" class="flex items-center justify-center flex-col">
                  <span v-if="selectCalendarCellSonStyle(item)" class="text-20rpx leading-20rpx mb-2rpx"
                    style="color: #fff">{{ showDateRange(val, item) }}</span>

                  <text class="text-30rpx leading-32rpx" :style="{
            color:
              selectCalendarCellSonStyle(item) && calendarRange(item, val)
                ? '#fff'
                : '',
          }">
                    {{ item.day }}
                  </text>
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
import { ToChinese } from '@/utils/tools'
import dayjs from 'dayjs'
export default {
  props: {
    scheduleTabsactive: {
      type: Number,
      default: 0,
    },
    selectedActiveList: {
      type: Array,
      default: () => [{
        timeStamp: '1711296000000'
      }, {
        timeStamp: '1711555200000'
      }],
    },

  },
  watch: {
    scheduleTabsactive: {
      handler (val) {
        this.int()
        if (val == 1) {
          this.termHappy(this.userInfo.semesterInfo)
        } else if (val == 2) {
        }
      }, immediate: true

    },
  },

  data () {
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
      weekList: [],
      scheduleDate: '',
      createdate: '',
      enddate: '',
      weekListIndex: 0,
      currentWeekStr: '',
      userInfo: null,
    }
  },
  created () {
    this.userInfo = JSON.parse(uni.getStorageSync('userInfo'))
    this.int()
  },
  mounted () {
    this.generateYearList()
  },
  methods: {
    calendarRange (item, list) {
      if (this.scheduleTabsactive == 2) {
        list = this.selectedActiveList
      }
      if (
        item.timeStamp == list[0].timeStamp ||
        item.timeStamp == list[list.length - 1].timeStamp
      ) {
        return true
      }
      return false
    },
    showDateRange (list, item) {
      if (this.scheduleTabsactive == 2) {
        list = this.selectedActiveList
      }
      let str = ''
      if (list[0].timeStamp == item.timeStamp) {
        str = '开始'
      } else if (list[list.length - 1].timeStamp == item.timeStamp) {
        str = '结束'
      }
      return str
    },
    pickerOptions (list) {
      let show = false
      if (this.scheduleTabsactive == 2) return false
      list.forEach((item) => {
        show = this.pickerSonOptions(item)
      })
      return show
    },
    pickerSonOptions (item) {
      if (this.scheduleTabsactive == 1) {
        let createday = new Date(this.createdate).getTime() // 开学当天
        let endday = new Date(this.enddate).getTime() // 结束当天
        return item.timeStamp > endday || item.timeStamp < createday
      }
      return false
    },
    termHappy (_currentSemester) {
      this.createdate = _currentSemester.createdate
      this.enddate = _currentSemester.enddate
      this.weekList = this.getWeeksConvertValue()
      if (
        new Date().getTime() >= new Date(_currentSemester.createdate).getTime() &&
        new Date().getTime() <= new Date(_currentSemester.enddate).getTime()
      ) {
        this.scheduleDate = dayjs().format('YYYY-MM-DD')
      } else {
        this.scheduleDate = _currentSemester.createdate
      }
      this.getCurrentWeekHappy(this.scheduleDate)
      this.weekIndex = this.getCurrentWeeks()
      if (this.scheduleDate) {
        let date = new Date(this.scheduleDate)
        // let curweek = this.yingmin.formatWeek(date)
        // this.curweek = curweek
      }
    },
    getCurrentWeeks () {
      return (this.getCurrentWeek() - this.getStartWeek()) / 604800000
    },
    getCurrentWeek () {
      let _currentDate = new Date(this.scheduleDate).getTime()
      let _currentGetDay =
        new Date(this.scheduleDate).getDay() == 0 ? 7 : new Date(this.scheduleDate).getDay()
      let _currentGetDays = 7 - _currentGetDay
      let _currentetDayTime = _currentGetDays * 8.64e7
      let _currentTime = _currentDate + _currentetDayTime + 3600000 * 16
      return _currentTime
    },
    getStartWeek () {
      let _createdate = new Date(this.createdate).getTime()
      let _startGetDay = new Date(_createdate).getDay() == 0 ? 7 : new Date(_createdate).getDay()
      let _startGetDays = 7 - (7 - _startGetDay)
      let _startGetDayTime = _startGetDays * 8.64e7
      let _startDate = _createdate - _startGetDayTime + 3600000 * 16
      return _startDate
    },
    getCurrentWeekHappy (date) {
      console.log('进了课表吗', date)
      this.weekList.forEach((item, index) => {
        if (item.days.join().indexOf(date) != -1) {
          this.weekListIndex = index
          this.currentWeekStr = this.weekList[this.weekListIndex].text
          this.$emit('weekChange', {
            ...item,
            time: `${item.text} ${item.value.slice(0, 4)}年 ${item.days[0].slice(
              5,
              10,
            )} 至 ${item.days[item.days.length - 1].slice(5, 10)}`,
          })
          // this.getClassCoursesByTeacher(item) // 获取老师课程
        }
      })
    },
    getWeeksConvertValue () {
      let _getWeeksForDayjs = this.getWeeksForDayjs(this.createdate, this.enddate)
      _getWeeksForDayjs.forEach((item) => {
        item.value = item.days[0]
        item.startDate = item.days[0]
        item.endDate = item.days[item.days.length - 1]
      })
      return _getWeeksForDayjs
    },
    getWeeksForDayjs (startTime, endTime) {
      let startDay = dayjs(startTime)
      let endDay = dayjs(endTime)
      let index = 0
      let temp = []
      this.initItem(temp, index)
      while (!startDay.isAfter(endDay)) {
        if (startDay.day() === 1 && temp[index].days.length) {
          index++
          this.initItem(temp, index)
        }
        temp[index].days.push(startDay.format('YYYY-MM-DD'))
        startDay = startDay.add(1, 'day')
      }
      return temp
    },
    initItem (arr, index) {
      arr[index] = {
        checked: false,
        disabled: false,
        text: `第${ToChinese(index + 1)}周`,
        weekNumber: index + 1,
        days: [],
      }
      return arr
    },
    /** 处理周课表组件高亮提示 */
    selectCalendarCellDatas (list) {
      let show = false
      list.forEach((item) => {
        show = this.selectCalendarCellSonStyle(item)
      })
      return show
    },
    selectCalendarCellSonStyle (item) {
      // console.log('高亮方法', this.scheduleTabsactive, item, this.selectedActiveList);
      if (this.scheduleTabsactive == 0) {
        return false
      } else if (this.scheduleTabsactive == 1) {
        if (
          item.timeStamp >= this.getWeek(new Date(this.selectTimeStep)).stime &&
          item.timeStamp <= this.getWeek(new Date(this.selectTimeStep)).etime
        ) {
          return true
        }
        return false
      } else if (this.scheduleTabsactive == 2) {
        if (
          item.timeStamp >= this.selectedActiveList[0].timeStamp &&
          item.timeStamp <= this.selectedActiveList[this.selectedActiveList.length - 1].timeStamp
        ) {
          return true
        }
        return false
      }
    },
    getWeek (date) {
      let one_day = 86400000
      let day = date.getDay()
      // 设置时间为当天的0点
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)
      let week_start_time = date.getTime() - (day - 1) * one_day
      let week_end_time = date.getTime() + (7 - day) * one_day
      let weekDays = []
      for (let i = 1; i <= 7; i++) {
        weekDays.push(date.getTime() + (i - day) * one_day)
      }
      let last = week_start_time - 2 * 24 * 60 * 60 * 1000
      let next = week_end_time + 24 * 60 * 60 * 1000
      let year1 = new Date(week_start_time).getFullYear()
      let year2 = new Date(week_end_time).getFullYear()
      let month1 = new Date(week_start_time).getMonth() + 1
      let month2 = new Date(week_end_time).getMonth() + 1
      let day1 = new Date(week_start_time).getDate()
      let day2 = new Date(week_end_time).getDate()
      if (month1 < 10) {
        month1 = '0' + month1
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      if (day1 < 10) {
        day1 = '0' + day1
      }
      if (day2 < 10) {
        day2 = '0' + day2
      }

      let time1 = year1 + '-' + month1 + '-' + day1
      let time2 = year2 + '-' + month2 + '-' + day2
      let thisWeekDays = []
      weekDays.forEach((element) => {
        year1 = new Date(element).getFullYear()
        month1 = new Date(element).getMonth() + 1
        day1 = new Date(element).getDate()
        if (month1 < 10) {
          month1 = '0' + month1
        }
        if (day1 < 10) {
          day1 = '0' + day1
        }
        let item = year1 + '-' + month1 + '-' + day1
        thisWeekDays.push(item)
      })
      let weekList = {
        stime: week_start_time,
        etime: week_end_time,
        stext: time1,
        etext: time2,
        last,
        next,
        text: time1 + ' ~ ' + time2,
        thisWeekDays,
      }
      // console.log(888888, weekList);
      return weekList
    },
    int () {
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
    /** 切换日历月份&年份 上 */
    prev (type) {
      if (type == 'year') {
        this.year = this.year - 1
        this.currentYear = this.currentYear - 1
        this.initDate()
      } else {
        this.changeMonth()
      }
    },
    /** 切换日历月份&年份 下 */
    next (type) {
      if (type == 'year') {
        this.year = this.year + 1
        this.currentYear = this.currentYear + 1
        this.initDate()
      } else {
        this.changeMonth(1)
      }
    },
    /** 处理切换日历月份数据 */
    changeMonth (increment) {
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
    /** 初始化日历数据 */
    initDate () {
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
          time: `${this.year}-${this.month > 9 ? this.month : '0' + this.month}-${i > 9 ? i : '0' + i
            }`,
        })
      }

      isWeek = isWeek - 1

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
            time: `${this.month == 12 ? this.year - 1 : this.year}-${this.month - 1 > 9 ? this.month - 1 : '0' + (this.month - 1)
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
          time: `${this.month == 12 ? this.year + 1 : this.year}-${this.month + 1 > 9 ? this.month + 1 : '0' + (this.month + 1)
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
    spArr (arr, num) {
      if (num < 1) {
        return newArr
      }
      let newArr = []
      for (let i = 0; i < arr.length;) {
        newArr.push(arr.slice(i, (i += num)))
      }
      return newArr
    },
    /** 点击上个月 */
    prevMonth () {
      if (this.month < 2) {
        this.month = 12
        this.year -= 1
      } else {
        this.month -= 1
      }
      this.initDate()
    },
    /** 点击下个月 */
    nextMonth () {
      if (this.month > 11) {
        this.month = 1
        this.year += 1
      } else {
        this.month += 1
      }
      this.initDate()
    },
    /** 点击日历 */
    changeDay (item, val) {
      if (this.pickerOptions(val)) {
        return
      }
      if (item.isMonth == 'prev') {
        this.prevMonth()
      } else if (item.isMonth == 'current') {
        this.nextMonth()
      }
      this.selectTimeStep = item.timeStamp
      this.day = item.day
      this.$emit('changeDay', {
        item,
        val,
      })
      this.getCurrentWeekHappy(item.time)
    },
    /** 关闭弹框 */
    closeDay () {
      this.$emit('closeDay', false)
    },
    /** 获取前后50年数据 */
    generateYearList () {
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
        border-radius: 32rpx 32rpx 0 0;

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
              height: 100rpx;
              width: 100rpx;
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
