import { defineStore } from 'pinia'
import { get, merge, set, cloneDeep } from 'lodash-es'
import { reqUrlMatch, useGlobalSetting } from '@/settings'
import { getBaseInfo, loginByAccount, logout } from '@/api/sys/auth'
import { currentPageMatch } from '@/settings'
import { toPromise } from '@/utils'
import { JSEncrypt } from 'jsencrypt'
import { getPublicKey } from '@/api/sys/service'
import { getUserInfo, getStudentClassInfo, getSemesterInfo } from '@/api/sys/model/user'
import { http } from '@/utils'
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
        /**是否记住密码 */
        rememberMe: false,
        /**账号名称 */
        username: '',
        /** 用户密码 */
        password: '',
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
        formatList: [], // 文件格式列表
        fileStorageInfo: {}, // 文件存储信息
        uploadMethodInfo: {}, // 文件上传方式
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
        let userNamePassword = {}
        /**企微专用 */
        // const isQyWxLogin = get(params, 'thirdLoginReq.thirdAppType') === 2
        const { code } = await toPromise(uni.login)
        // set(params, 'thirdLoginReq.code', code) 设置第三方授权登录请求参数所用
        if (Object.keys(params?.userNameLoginReq).length) {
          const { username, password } = params.userNameLoginReq
          await this.getPublicKeyInfo()
          const encryptedPassword = this.encryptDate(this.publicKey, password)
          userNamePassword = {
            ...params,
            userNameLoginReq: {
              username,
              password: encryptedPassword,
            },
          }
        }
        /**账号登录 */
        const result = await loginByAccount(userNamePassword, token)
        this.rememberMe = params.rememberMe
        /**记住密码 */
        if (this.rememberMe) {
          this.username = params.userNameLoginReq.username
          this.password = params.userNameLoginReq.password
        } else {
          this.username = ''
          this.password = ''
        }
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
        this.hasLogin = false
        /**学生信息 */
        this.userInfo = {}
        /**班级信息 */
        this.classInfo = {}
        /**学期信息 */
        this.semesterInfo = {}
        /**角色列表 */
        this.userPartRroList = []
        /**详细用户信息 */
        this.authUserInfo = {}
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
        const res = await getPublicKey()
        if (res.code == 0) {
          this.publicKey = res.data
          uni.setStorageSync('publicKey', JSON.stringify(res.data))
        }
      },

      async requestUserInfo() {
        const { data } = await getUserInfo({ token: this.getToken })
        /**储存角色列表 */
        this.userPartRroList = data.userPartRroList
        let userInfoClone = cloneDeep(data)
        delete userInfoClone.userPartRroList
        /**角色列表中匹配 */
        const studentInfo = data.userPartRroList.find((item) => item.id == data.studentId)
        this.userInfo = { ...studentInfo, ...userInfoClone }
        /**查询班级信息 */
        const classRes = await getStudentClassInfo({ studentId: this.userInfo.studentId })
        this.classInfo = classRes.obj
        /**查询学期信息 */
        const semester = await getSemesterInfo({ schoolId: this.userInfo?.orgId })
        const currentSemester = semester.obj.find((item) => item.current == 1)
        this.semesterInfo = currentSemester
        await this.getFormatList()
        await this.getUploadMethod()
        return data
      },
      /** 获取文件格式列表 */
      async getFormatList() {
        const res = await http.post({
          url: '/resource-center/fileFormats/list',
          data: {
            id: '',
            name: '',
            formats: '',
            imgUrl: '',
            status: 1,
            sort: '',
          },
        })
        if (res.code == 0) {
          this.formatList = res.data
        }
      },
      /** 获取文件上传方式 */
      async getUploadMethod() {
        const res = await http.get({
          url: '/file-server/fileUpload/getUploadMethod',
          data: {},
        })
        if (res.code == 0) {
          this.uploadMethodInfo = res.data
          if(res.data == 'cos') {
            await this.getCosInfo()
          } else if(res.data == 'minio') {
            await this.getMinioInfo()
          }
        }
      },
      /** 获取cos存储信息 */
      async getCosInfo() {
        const res = await http.get({
          url: '/file-server/cos/getCosInfo',
          data: {},
        })
        if (res.code == 0) {
          this.fileStorageInfo = res.data
        }
      },
      /** 获取minio存储信息 */
      async getMinioInfo() {
        const res = await http.get({
          url: '/file-server/minio/getMinioInfo',
          data: {},
        })
        if (res.code == 0) {
          this.fileStorageInfo = res.data
        }
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
