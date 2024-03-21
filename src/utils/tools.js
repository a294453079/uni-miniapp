import dayjs from 'dayjs'
import { compact, map } from 'lodash-es'

/**
 * 将字符串转对象
 * @param inputStr 处理字符串
 * @param mark 分割符
 * @param connector 连接符
 * @returns {Record<string, string>>}
 * eg:
 *  let obj = 'gId=3608300022&e=1&eb=1&tId=9'
 *  let mark = &
 *  parseStrObjByFor(obj, mark)
 *  ==>{gId:3608300022,e:1,ed:1,tId:9}
 */
export function parseStrToObj(
  inputStr,
  mark = '&',
  connector = '='
) {
  if (!inputStr.includes(mark) || !inputStr.includes(connector)) {
    try {
      return JSON.parse(inputStr)
    } catch (e) {
      return {}
    }
    // throw Error('解析失败！')
  }

  return decodeURIComponent(inputStr)
    .split(mark)
    .reduce((pre, cur) => {
      const [key, value] = cur.split(connector)
      key && (pre[key] = value)
      return pre
    }, {} )
}

/** 获取当前页面地址 */
export function getCurrentPage() {
  const pages = getCurrentPages()
  const lastIndex = pages.length - 1
  return pages[lastIndex]
}

/**
 * 生成随机字符串
 * @param len 生成长度
 * @param noNum 是否不含数字
 * @returns {string} 随机字符串
 */
export function randomUUid(len = 12, noNum = false){
  const chars = `ABCDEFGHIJKMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz${
    noNum ? '' : '0123456789'
  }`
  let str = ''
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return str
}



/**
 * 回调函数转 promise 函数
 * @param {function} fn uni 函数
 * @param options 参数
 * @returns {Promise<SuccessFnParameter<F>>} uni函数执行成功返回值，如果执行失败直接抛出错误
 * @example
 * const { code } = await toPromise(uni.login, { timeout: 1000 });
 * console.log(code);
 */
export function toPromise(
  fn,
  options
) {
  return new Promise((resolve, reject) => {
    fn.call(null, { ...options, success: resolve, fail: reject })
  })
}

/**
 * 批量检查订阅模板状态
 * @param {string | string[]} TmpIds 要检查的模板消息Id
 * @returns {Promise<boolean[]>}
 */
export async function checkTmpSubscriptionStatus(
  TmpIds
) {
  if (typeof TmpIds === 'string') {
    TmpIds = [TmpIds]
  }
  const {
    subscriptionsSetting: { mainSwitch, itemSettings }
  } = await toPromise(uni.getSetting, {
    withSubscriptions: true
  })
  if (!mainSwitch || !itemSettings) return Array(TmpIds.length).fill(false)

  return map(TmpIds, (v) => itemSettings[v] === 'accept')
}

/**
 * 批量拉起模板订阅提示
 * @param TmpIds
 * @returns {Promise<SuccessFnParameter<(option: UniNamespace.RequestSubscribeMessageOption) => void>>}
 */
export async function requestTmpSubscriptionShow(TmpIds) {
  if (!TmpIds.length) return
  const status = await checkTmpSubscriptionStatus(TmpIds)
  TmpIds = compact(map(status, (v, k) => (!v ? TmpIds[k] : null))).slice(0, 3)
  if (!TmpIds.length) return
  return toPromise(uni.requestSubscribeMessage, { tmplIds: TmpIds })
}

export function buildUrl(url, queryObject) {
  const queryStr = map(queryObject, (v, k) => `${k}=${v}`).join('&')
  if (url.indexOf('?') !== -1) return `${url}&${queryStr}`
  else return `${url}?${queryStr}`
}

export function delPathPrefix(path) {
  return path.startsWith('/') ? delPathPrefix(path.substring(1)) : path
}

export function delPathSuffix(path) {
  return path.endsWith('/')
    ? delPathSuffix(path.substring(0, path.length - 2))
    : path
}

export function buildRoutePath(...paths) {
  return paths
    .map((path) => delPathPrefix(delPathSuffix(path)))
    .filter(Boolean)
    .join('/')
}

/**
 * 语义化时间显示
 * @param date
 * @param noTime
 * @returns {string}
 */
export function semanticTime(
  date,
  noTime = false
) {
  const instance = dayjs(date)
  const nowInstance = dayjs()
  if (instance.year() !== nowInstance.year()) {
    return instance.format(!noTime ? 'YYYY年MM月DD日 HH:mm' : 'YYYY年MM月DD日')
  } else if (instance.day() !== nowInstance.day()) {
    return instance.format(!noTime ? 'MM月DD日 HH:mm' : 'MM月DD日')
  } else {
    return instance.format('HH:mm')
  }
}

export function getThisInstance(Recordable, name) {
  let parent = Recordable.$parent

  if (!parent) return Recordable

  // 通过while历遍，这里主要是为了H5需要多层解析的问题
  while (parent) {
    // 父组件
    if (parent.$options && parent.$options.name !== name) {
      // 如果组件的name不相等，继续上一级寻找
      parent = parent.$parent
    } else {
      return parent
    }
  }
  return false
}

export function ToChinese(num) {
  let currNum = num;
  var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
  var chnUnitChar = ["", "十", "百", "千"];

  function SectionToChinese(section) {
    var strIns = "",
      chnStr = "";
    var unitPos = 0;
    var zero = true;

    if (currNum >= 10 && currNum < 20) {
      var v = section % 10;
      if (v == 0) {
        chnStr = chnUnitChar[1];
      } else {
        chnStr = chnUnitChar[1] + chnNumChar[v];
      }
      return chnStr;
    }
    while (section > 0) {
      var v = section % 10;
      if (v === 0) {
        if (!zero) {
          zero = true;
          chnStr = chnNumChar[v] + chnStr;
        }
      } else {
        zero = false;
        strIns = chnNumChar[v];
        strIns += chnUnitChar[unitPos];
        chnStr = strIns + chnStr;
      }
      unitPos++;
      section = Math.floor(section / 10);
    }
    return chnStr;
  }

  function NumberToChinese(num) {
    var unitPos = 0;
    var strIns = "",
      chnStr = "";
    var needZero = false;

    if (num === 0) {
      return chnNumChar[0];
    }

    while (num > 0) {
      var section = num % 10000;
      if (needZero) {
        chnStr = chnNumChar[0] + chnStr;
      }
      strIns = SectionToChinese(section);
      strIns += section !== 0 ? chnUnitSection[unitPos] : chnUnitSection[0];
      chnStr = strIns + chnStr;
      needZero = section < 1000 && section > 0;
      num = Math.floor(num / 10000);
      unitPos++;
    }

    return chnStr;
  }
  return NumberToChinese(num);
}

export function getFileImgUrl(fileFormat) {
  const { formatList } = JSON.parse(uni.getStorageSync('userInfo'))
  let urlList = formatList.filter((item) => item.formats.indexOf(fileFormat) !== -1)
  if (urlList.length > 0) {
    return '/static/practice/fileIcon/' + urlList[0].imgUrl
  }
}
