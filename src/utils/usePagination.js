import { ref ,reactive} from 'vue'

export function usePagination(func, options = {}) {
  const { current, pageSize, data, ...otherParams } = options
  const payload = reactive({
      error: null,
    finish: false,
    empty: false,
    loading: false,
    total: 0,
    current: current ?? 1,
    pageSize: pageSize ?? 15,
    data: data ?? ([]),
  })

  let flag = false

  const run = (reset = false, args) =>
    new Promise((resolve, reject) => {
      if (flag) return
      flag = true

      if ((payload.empty && !reset) || (payload.finish && !reset)) {
        flag = false
        return
      }

      if (reset) payload.current = 1
      payload.loading = true
      payload.error = null

      func({
        current: payload.current,
        pageSize: payload.pageSize,
        ...otherParams,
        ...args,
      })
        .then((res) => {
          const { obj: { pages, records, total} } = res
          resolve(records)
          if (reset) payload.data = [...records]
          else payload.data.push(...records)

          payload.current++
          payload.finish = Number(pages) < payload.current
          payload.empty = Number(pages) <= 0
          payload.total = Number(total)
        })
        .catch(e => {
          payload.error = e
          reject(e)
        })
        .finally(() => {
          payload.loading = false
          flag = false
        })
    })

  return { run, payload }
}