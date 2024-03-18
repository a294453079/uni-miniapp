/* 注册模型参数 */
export interface RegisterParams {
  /* 小程序登录返回的code */
  code: string
  /* 手机号码 */
  mobile: string
  /* 用户姓名 */
  realName?: string
  /* 租户Id */
  tenantId?: string
  /* 微信appid */
  wxAppId: string
  /* 应用code */
  appCode: string
}

/** 小程序账户登录接口请求参数模型 */
export interface LoginParams {
  /* appCode,系统定义的应用code */
  appCode?: string
  /* 登录方式：1-账号密码登录；2-第三方授权登录；3-选择租户后登录 */
  loginType?: 1 | 2 | 3
  /**
   * 短信验证码
   */
  smsCode?: string
  /**
   * 租户id
   */
  tenantId?: string
  /* 第三方授权登录请求参数 */
  thirdLoginReq?: {
    /* 小程序登录返回的code */
    code: string
    /* 小程序的AppId */
    miniAppId: string
    /* 1-微信,2-企业微信 */
    thirdAppType: string
  }
  /* 账号密码登录请求参数 */
  userNameLoginReq?: {
    /* 账号 */
    username: string
    /* 密码 */
    password: string
  }
}

export type SilenceLoginParams = Pick<
  LoginParams,
  'appCode' | 'loginType' | 'thirdLoginReq'
>

export type UserRoleLevel = 0 | 1 | 2 | 3

export type AuthInfo = MiniappAuthInfo

/**
 * 小程序登录返回信息
 * @export
 * @interface MiniappAuthInfo
 */
export interface MiniappAuthInfo {
  /**
   * 当前ip
   */
  currentIp?: string
  /**
   * 临期时间，单位为秒
   */
  expiration: number
  /**
   * 过期时间
   */
  expiresIn?: number
  /**
   * 是否强制修改密码,0-否，1-是
   */
  forcedUpdPwd?: number
  /**
   * 是否短信验证码确认登录，0-不需要；1-需要
   */
  isSmsCodeConfirm?: number
  /**
   * 小程序用户id
   */
  miniAppUserId?: number
  /**
   * 默认租户id，上次选择的租户
   */
  tenantId?: string
  /**
   * 可选租户，账号密码登录的时候可能返回
   */
  tenantList?: PaasTenant[]
  /**
   * 默认租户名称，上次选择的租户
   */
  tenantName?: string
  /**
   * 令牌
   */
  token?: string
  /**
   * token类型，1-长期token，可直接使用；2-须选择租户后使用
   */
  tokenType?: number
  /**
   * 用户id
   */
  userId?: number
}

/**
 * PaasTenant，租户表
 */
export interface PaasTenant {
  /**
   * 联系地址
   */
  address?: string
  /**
   * 管理员用户id
   */
  adminUserId?: number
  /**
   * 市id
   */
  cityId?: number
  /**
   * 联系人
   */
  contact?: string
  /**
   * 联系电话
   */
  contactNumber?: string
  /**
   * 县市区id
   */
  countyId?: number
  /**
   * 创建时间
   */
  createTime?: Date
  /**
   * 创建人
   */
  createUserId?: number
  /**
   * 主键id
   */
  id: string
  /**
   * 是否已删除
   */
  isDeleted?: number
  /**
   * 位置描述，请严格按照完整的省市区来写，比如”江西省赣州市信丰县“
   */
  locationDesc?: string
  /**
   * 父级租户id
   */
  pid?: number
  /**
   * 省id
   */
  provinceId?: number
  /**
   * 租户名称(简称)
   */
  shortName?: string
  /**
   * 状态
   */
  state?: number
  /**
   * 租户名称
   */
  tenantName?: string
  /**
   * 租户编码
   */
  tenantNo?: string
  /**
   * 乡镇id
   */
  townId?: number
  /**
   * 更新时间
   */
  updateTime?: Date
  /**
   * 更新人
   */
  updateUserId?: number
  /**
   * 乡村id
   */
  villageId?: number
}
