import { defineStore } from 'pinia'
import { get, merge, set, cloneDeep } from 'lodash-es'
import { reqUrlMatch, useGlobalSetting } from '@/settings'
import { getBaseInfo, loginByAccount, logout } from '@/api/sys/auth'
import { currentPageMatch } from '@/settings'
import { toPromise } from '@/utils'
import { JSEncrypt } from 'jsencrypt'
import { getPublicKey } from '@/api/sys/service'
import { getUserInfo, getStudentClassInfo, getSemesterInfo } from '@/api/sys/model/user'
export const userInfoStore = defineStore(
  'userInfo',
  {
    unistorage: true, // 是否持久化到内存
    state: () => {
      return {
        // 测试
        appIndex: 999,
        publicKey: '',
        /**是否已登录 hasLogin */
        hasLogin: false,
        /**token */
        // getToken: '2df167e8-2b56-4c6c-a34d-fdf923e1b02e',
        /**用户信息 token*/
        authInfo: {},
        /**学生信息 */
        userInfo: {},
        /**班级信息 */
        classInfo: {},
        /**学期信息 */
        semesterInfo: {},
        /**角色列表 */
        userPartRroList: {},
        /**详细用户信息 */
        authUserInfo: {},
        lastUpdateTime: 0,
      }
    },
    getters: {
      getToken() {
        return this.authInfo?.access_token ?? ''
      },
      getUserInfo() {
        return this.userInfo
      },
      getClassInfo() {
        return this.classInfo
      },
      getSemesterInfo() {
        return this.semesterInfo
      },
      getUserPartRroList() {
        return this.userPartRroList
      },
    },
    actions: {
      async Login(params) {
        console.log('登录', params)
        const { wxAppId, checkAuth, appCode } = useGlobalSetting()
        let token = ''
        // 合并默认参数
        params = merge(
          {
            // appCode,
            // loginType: 2,
            // thirdLoginReq: { thirdAppType: 1, miniAppId: wxAppId }
          },
          params,
        )
        console.log(params, '-----')
        /**企微专用 */
        // const isQyWxLogin = get(params, 'thirdLoginReq.thirdAppType') === 2
        const { code } = await toPromise(uni.login)
        // set(params, 'thirdLoginReq.code', code) 设置第三方授权登录请求参数所用
        if (Object.keys(params?.userNameLoginReq).length) {
          const { userName, password } = params.userNameLoginReq
          console.log('password', password)
          await this.getPublicKeyInfo()
          params.userNameLoginReq.password = this.encryptDate(this.publicKey, password)
          console.log('参数', this.publicKey, password)
        }
        /**账号登录 */
        const result = await loginByAccount(params, token)
        console.log('登录信息返回', result)
        this.authInfo = result.data

        await this.requestUserInfo()
        console.log('账号登录信息', this.authInfo)
        // 当账号密码登录时，设置用户为已登录状态
        if (!checkAuth || params?.userNameLoginReq) {
          this.hasLogin = true
        }

        if (this.authInfo?.tokenType === 1) {
          return this.afterLogin(true)
        }
        return {}
      },
      async Logout() {
        if (this.getToken) {
          try {
            await logout({ token: this.getToken })
          } catch (e) {
            console.warn('登出失败', e)
          }
        }

        this.resetState()

        const { checkAuth } = useGlobalSetting() //白名单时使用

        checkAuth && !currentPageMatch() && uni.reLaunch({ url: '/pages/login/index' })
      },
      async afterLogin(isRest = false) {
        const checkExpireTime = Date.now() - this.lastUpdateTime > 24 * 3600
        if (checkExpireTime || isRest) {
          return this.getAuthUserInfo()
        } else {
          return this.authUserInfo
        }
      },
      async getAuthUserInfo() {
        const baseInfo = await getBaseInfo()
        this.authUserInfo = baseInfo
        this.lastUpdateTime = Date.now()
        return baseInfo
      },
      resetState() {
        console.log('清空用户信息')
        this.authInfo = null
      },

      // 加密
      encryptDate(publicKey, data) {
        if (publicKey) {
          const encrypt = new JSEncrypt() // 1.实例化对象
          encrypt.setPublicKey(publicKey) // 2. 设置公钥
          return encrypt.encrypt(data) // 3. 返回加密的字符串
        } else {
          return ''
        }
      },

      /**获取公共key */
      async getPublicKeyInfo() {
        console.log('执行')
        const res = await getPublicKey()
        if (res.code == 0) {
          this.publicKey = res.data
          uni.setStorageSync('publicKey', JSON.stringify(res.data))
        }
      },

      async requestUserInfo() {
        const { data } = await getUserInfo({ token: this.getToken })
        console.log(data, '用户信息')
        /**储存角色列表 */
        this.userPartRroList = data.userPartRroList
        let userInfoClone = cloneDeep(data)
        console.log('复制', userInfoClone)
        delete userInfoClone.userPartRroList
        /**角色列表中匹配 */
        const studentInfo = data.userPartRroList.find((item) => item.id == data.studentId)
        this.userInfo = { ...studentInfo, ...userInfoClone }
        /**查询班级信息 */
        const classRes = await getStudentClassInfo({ studentId: this.userInfo.studentId })
        console.log('班级信息', classRes)
        this.classInfo = classRes.obj
        /**查询学期信息 */
        const semester = await getSemesterInfo({ schoolId: this.userInfo?.orgId })
        const currentSemester = semester.obj.find((item) => item.current == 1)
        this.semesterInfo = currentSemester
        return data
      },
    },
  },
  /**持久化方式2*/
  // {
  //   // 配置持久化
  //   persist: {
  //     // 调整为兼容多端的API
  //     storage: {
  //       setItem(key, value) {
  //         uni.setStorageSync(key, value) // [!code warning]
  //       },
  //       getItem(key) {
  //         return uni.getStorageSync(key) // [!code warning]
  //       },
  //     },
  //   },
  // },
)
