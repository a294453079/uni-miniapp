import pkg from '/package.json'
export const useGlobalSetting = () => {
  const { name, version } = pkg
  let tmpIds
  try {
    tmpIds = JSON.parse(import.meta.env.VITE_APP_APP_TMPIDS)
  } catch (e) {
    tmpIds = []
  }

  return {
    isDev: import.meta.env.NODE_ENV === 'development',
    name,
    version,
    appCode: import.meta.env.VITE_APP_APP_CODE,
    apiUrl: import.meta.env.NODE_ENV === 'development'
      ? import.meta.env.VITE_APP_DEV_API_URL
      : import.meta.env.VITE_APP_PRO_API_URL,
    locationKey: import.meta.env.VITE_APP_LOCATIONKEY,
    wxAppId: import.meta.env.VITE_APP_WXAPPID,
    alipayId: import.meta.env.VITE_APP_ALIPAYID,
    checkAuth: import.meta.env.VUE_APP_NEED_LOGIN,
    tmpIds,
    basisId: import.meta.env.VITE_APP_BASIS_NUM,
  }
}
