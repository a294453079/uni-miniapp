export class AsyncPromise{
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  loading = false

  promise
  resolve
  reject
}
