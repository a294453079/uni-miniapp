"use strict";
const name = "uni-preset-vue";
const version = "0.0.0";
const scripts = {
  "dev:app": "uni -p app",
  "dev:app-android": "uni -p app-android",
  "dev:app-ios": "uni -p app-ios",
  "dev:custom": "uni -p",
  "dev:h5": "uni",
  "dev:h5:ssr": "uni --ssr",
  "dev:mp-alipay": "uni -p mp-alipay",
  "dev:mp-baidu": "uni -p mp-baidu",
  "dev:mp-jd": "uni -p mp-jd",
  "dev:mp-kuaishou": "uni -p mp-kuaishou",
  "dev:mp-lark": "uni -p mp-lark",
  "dev:mp-qq": "uni -p mp-qq",
  "dev:mp-toutiao": "uni -p mp-toutiao",
  "dev:mp-weixin": "uni -p mp-weixin",
  "dev:quickapp-webview": "uni -p quickapp-webview",
  "dev:quickapp-webview-huawei": "uni -p quickapp-webview-huawei",
  "dev:quickapp-webview-union": "uni -p quickapp-webview-union",
  "build:app": "uni build -p app",
  "build:app-android": "uni build -p app-android",
  "build:app-ios": "uni build -p app-ios",
  "build:custom": "uni build -p",
  "build:h5": "uni build",
  "build:h5:ssr": "uni build --ssr",
  "build:mp-alipay": "uni build -p mp-alipay",
  "build:mp-baidu": "uni build -p mp-baidu",
  "build:mp-jd": "uni build -p mp-jd",
  "build:mp-kuaishou": "uni build -p mp-kuaishou",
  "build:mp-lark": "uni build -p mp-lark",
  "build:mp-qq": "uni build -p mp-qq",
  "build:mp-toutiao": "uni build -p mp-toutiao",
  "build:mp-weixin": "uni build -p mp-weixin",
  "build:quickapp-webview": "uni build -p quickapp-webview",
  "build:quickapp-webview-huawei": "uni build -p quickapp-webview-huawei",
  "build:quickapp-webview-union": "uni build -p quickapp-webview-union"
};
const dependencies = {
  "@dcloudio/uni-app": "3.0.0-3080420230531001",
  "@dcloudio/uni-app-plus": "3.0.0-3080420230531001",
  "@dcloudio/uni-components": "3.0.0-3080420230531001",
  "@dcloudio/uni-h5": "3.0.0-3080420230531001",
  "@dcloudio/uni-mp-alipay": "3.0.0-3080420230531001",
  "@dcloudio/uni-mp-baidu": "3.0.0-3080420230531001",
  "@dcloudio/uni-mp-jd": "3.0.0-3080420230531001",
  "@dcloudio/uni-mp-kuaishou": "3.0.0-3080420230531001",
  "@dcloudio/uni-mp-lark": "3.0.0-3080420230531001",
  "@dcloudio/uni-mp-qq": "3.0.0-3080420230531001",
  "@dcloudio/uni-mp-toutiao": "3.0.0-3080420230531001",
  "@dcloudio/uni-mp-weixin": "3.0.0-3080420230531001",
  "@dcloudio/uni-quickapp-webview": "3.0.0-3080420230531001",
  clipboard: "^2.0.11",
  dayjs: "^1.11.10",
  "firstui-uni": "^2.0.1",
  "lodash-es": "^4.17.21",
  "uview-plus": "^3.1.45",
  vue: "^3.2.45",
  "vue-i18n": "^9.1.9"
};
const devDependencies = {
  "@dcloudio/types": "^3.3.2",
  "@dcloudio/uni-automator": "3.0.0-3080420230531001",
  "@dcloudio/uni-cli-shared": "3.0.0-3080420230531001",
  "@dcloudio/uni-stacktracey": "3.0.0-3080420230531001",
  "@dcloudio/vite-plugin-uni": "3.0.0-3080420230531001",
  prettier: "^2.8.8",
  sass: "^1.63.6",
  "sass-loader": "10",
  vite: "4.1.5",
  "vite-plugin-windicss": "^1.9.3",
  "vue-cli-plugin-windicss": "^1.1.6",
  windicss: "^3.5.6"
};
const pkg = {
  name,
  version,
  scripts,
  dependencies,
  devDependencies
};
const useGlobalSetting = () => {
  const { name: name2, version: version2 } = pkg;
  let tmpIds;
  try {
    tmpIds = JSON.parse("[]");
  } catch (e) {
    tmpIds = [];
  }
  return {
    isDev: true,
    name: name2,
    version: version2,
    appCode: "af_plat",
    apiUrl: "https://teacher.sce.test.zhongteng.tech/",
    locationKey: "",
    wxAppId: "wxf97536376ab02675",
    alipayId: "",
    tmpIds,
    basisId: "2307"
  };
};
exports.useGlobalSetting = useGlobalSetting;
