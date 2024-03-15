if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_LOAD = "onLoad";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
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
    "firstui-uni": "^2.0.1",
    "lodash-es": "^4.17.21",
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
    vite: "4.1.5"
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
      tmpIds = JSON.parse({}.VITE_APP_APP_TMPIDS);
    } catch (e) {
      tmpIds = [];
    }
    return {
      isDev: true,
      name: name2,
      version: version2,
      appCode: {}.VITE_APP_APP_CODE,
      apiUrl: {}.VITE_APP_DEV_API_URL,
      locationKey: {}.VITE_APP_LOCATIONKEY,
      wxAppId: {}.VITE_APP_WXAPPID,
      alipayId: {}.VITE_APP_ALIPAYID,
      tmpIds,
      basisId: {}.VITE_APP_BASIS_NUM
    };
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$2 = {
    __name: "index",
    setup(__props) {
      const { basisId, apiUrl, alipayId } = useGlobalSetting();
      const loading = vue.shallowRef(false);
      const form = vue.shallowReactive({ number: "", idCard: "", year: 2023 });
      const verifyNumber = vue.computed(() => {
        if (!form.number)
          return true;
        return new RegExp("^" + basisId + "\\d{10}$|^07\\d{7}$").test(form.number);
      });
      const numberMaxLength = vue.computed(() => /^07/.test(form.number) ? 9 : 14);
      onLoad(async () => {
        const { code, authSuccessScopes } = await uni.login({
          provider: "alipay",
          scopes: ["auth_base", "auth_user", "auth_zhima"]
        });
        formatAppLog("log", "at pages/index/index.vue:59", code, authSuccessScopes);
        const { data } = await uni.request({
          url: `${apiUrl}/paas/userAuth/login/alipay`,
          method: "POST",
          data: { authCode: code, appId: alipayId }
        });
        uni.setStorageSync("USER_INFO", data.data);
      });
      const handleQuery = async () => {
        var _a;
        if (loading.value)
          return;
        try {
          loading.value = true;
          if (!new RegExp("^" + basisId + "\\d{10}$|^07\\d{7}$").test(form.number)) {
            return uni.showModal({
              title: "温馨提示",
              content: `请输入以"${basisId}"开头正确的报名序号`,
              showCancel: false
            });
          }
          if (!/.{4}/.test(form.idCard)) {
            return uni.showModal({
              title: "温馨提示",
              content: "请输入正确的身份证后四位",
              showCancel: false
            });
          }
          const { data } = await uni.request({
            url: `${apiUrl}/wec-hsees/v2/exam/score/read`,
            header: {
              authorization: uni.getStorageSync("USER_INFO").token
            },
            method: "GET",
            data: { idcardLast: form.idCard, serialNumber: form.number }
          });
          uni.setStorageSync("SCORE", data.data);
          await uni.navigateTo({ url: "/pages/queryResults/index" });
        } catch (e) {
          if (((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.code) !== 200) {
            uni.showToast({ title: `查询错误: ${e.data.msg}` });
          }
        } finally {
          loading.value = false;
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
          vue.createElementVNode("view", { class: "title" }, " 赣州市普通高中录取查询 "),
          vue.createElementVNode("view", { class: "px-30rpx" }, [
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.withDirectives(vue.createElementVNode("input", {
                class: "input-item",
                type: "number",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(form).number = $event),
                placeholder: "请输入考生的报名序号",
                "placeholder-style": "color: #BFBFBF",
                maxlength: vue.unref(numberMaxLength),
                style: vue.normalizeStyle({ color: vue.unref(verifyNumber) ? "#333" : "red" })
              }, null, 12, ["maxlength"]), [
                [vue.vModelText, vue.unref(form).number]
              ]),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input-item",
                  type: "idcard",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(form).idCard = $event),
                  maxlength: "4",
                  placeholder: "请输入身份证后四位",
                  "placeholder-style": "color: #BFBFBF"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, vue.unref(form).idCard]
              ])
            ]),
            vue.createElementVNode("button", {
              class: "button",
              type: "primary",
              loading: vue.unref(loading),
              onClick: handleQuery
            }, "查询", 8, ["loading"])
          ]),
          vue.createElementVNode("view", { class: "tips" }, "查询系统将于2023年7月1日 09:00 开启"),
          vue.createElementVNode("view", { class: "footer" }, "本服务由赣州市教育局提供")
        ]);
      };
    }
  };
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-83a5a03c"], ["__file", "D:/program/uni-ztsz/src/pages/index/index.vue"]]);
  const _sfc_main$1 = {
    __name: "index",
    setup(__props) {
      const scoreInfo = vue.ref({});
      const isSecondGrade = vue.computed(() => {
        var _a, _b, _c;
        if ((_a = scoreInfo.value) == null ? void 0 : _a.serial_number) {
          return Number((_c = (_b = scoreInfo.value) == null ? void 0 : _b.serial_number) == null ? void 0 : _c.slice(9, 10)) === 8;
        }
        return false;
      });
      onLoad(() => {
        scoreInfo.value = uni.getStorageSync("SCORE");
      });
      const formatScore = (e) => e ? String((+e).toFixed(2)) : "";
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", null, [
          vue.createElementVNode("view", { class: "watermark" }),
          vue.createElementVNode("view", { class: "header" }, [
            vue.createElementVNode(
              "view",
              { class: "title" },
              vue.toDisplayString(scoreInfo.value.realname) + "的学考成绩及录取结果：",
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "realname" }, [
              vue.createElementVNode(
                "text",
                { class: "label" },
                " 报名序号：" + vue.toDisplayString(scoreInfo.value.serial_number),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "value" },
                "身份证号后四位：" + vue.toDisplayString(scoreInfo.value.idcard),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.unref(isSecondGrade) ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "main"
          }, [
            vue.createElementVNode("view", { class: "results" }, [
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 地理： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.geography)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 生物： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.organism)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 生物实验： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.biological_experiment)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("text", { class: "item" }, "\\n")
            ])
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "main"
          }, [
            vue.createElementVNode("view", { class: "results" }, [
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 政治： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.political)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 语文： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.language)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 数学： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.mathematics)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 物理： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.physics)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 化学： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.chemistry)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 英语： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.english)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 历史： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.history)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 地理： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.geography)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 生物： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.organism)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 体育： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.sports)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 物理实验： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.physics_operate)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 化学实验： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.chemistry_operate)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 生物实验： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.biological_experiment)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createTextVNode(" 优惠加分： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.bonus_points)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item total" }, [
                vue.createTextVNode(" 综合总分： "),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(formatScore(scoreInfo.value.total_score)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "item1" }, [
                vue.createElementVNode("text", null, "录取学校："),
                vue.createTextVNode(),
                vue.createElementVNode(
                  "text",
                  { class: "score" },
                  vue.toDisplayString(scoreInfo.value.school_name),
                  1
                  /* TEXT */
                )
              ])
            ])
          ])),
          vue.createElementVNode("view", { class: "footer" }, "本服务由赣州市教育局提供")
        ]);
      };
    }
  };
  const PagesQueryResultsIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-cfd2182b"], ["__file", "D:/program/uni-ztsz/src/pages/queryResults/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/queryResults/index", PagesQueryResultsIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/program/uni-ztsz/src/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
