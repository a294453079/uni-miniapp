"use strict";
const common_vendor = require("../../common/vendor.js");
const settings_system = require("../../settings/system.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const { basisId, apiUrl, alipayId } = settings_system.useGlobalSetting();
    const loading = common_vendor.shallowRef(false);
    const form = common_vendor.shallowReactive({ number: "", idCard: "", year: 2023 });
    const verifyNumber = common_vendor.computed(() => {
      if (!form.number)
        return true;
      return new RegExp("^" + basisId + "\\d{10}$|^07\\d{7}$").test(form.number);
    });
    const numberMaxLength = common_vendor.computed(() => /^07/.test(form.number) ? 9 : 14);
    common_vendor.onLoad(async () => {
      const { code } = await common_vendor.index.login({ provider: "alipay" });
      const { data } = await common_vendor.index.request({
        url: `${apiUrl}/paas/userAuth/login/alipay`,
        method: "POST",
        data: { authCode: code, appId: alipayId }
      });
      common_vendor.index.setStorageSync("USER_INFO", data.data);
    });
    const handleQuery = async () => {
      var _a;
      if (loading.value)
        return;
      try {
        loading.value = true;
        if (!new RegExp("^" + basisId + "\\d{10}$|^07\\d{7}$").test(form.number)) {
          return common_vendor.index.showModal({
            title: "温馨提示",
            content: `请输入以"${basisId}"开头正确的报名序号`,
            showCancel: false
          });
        }
        if (!/.{4}/.test(form.idCard)) {
          return common_vendor.index.showModal({
            title: "温馨提示",
            content: "请输入正确的身份证后四位",
            showCancel: false
          });
        }
        const { data } = await common_vendor.index.request({
          url: `${apiUrl}/wec-hsees/v2/exam/score/read`,
          header: {
            authorization: common_vendor.index.getStorageSync("USER_INFO").token
          },
          method: "GET",
          data: { idcardLast: form.idCard, serialNumber: form.number }
        });
        common_vendor.index.setStorageSync("SCORE", data.data);
        await common_vendor.index.navigateTo({ url: "/pages/queryResults/index" });
      } catch (e) {
        if (((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.code) !== 200) {
          common_vendor.index.showToast({ title: `查询错误: ${e.data.msg}` });
        }
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(numberMaxLength),
        b: common_vendor.unref(verifyNumber) ? "#333" : "red",
        c: common_vendor.unref(form).number,
        d: common_vendor.o(($event) => common_vendor.unref(form).number = $event.detail.value),
        e: common_vendor.unref(form).idCard,
        f: common_vendor.o(($event) => common_vendor.unref(form).idCard = $event.detail.value),
        g: common_vendor.unref(loading),
        h: common_vendor.o(handleQuery)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-83a5a03c"], ["__file", "/Users/liyizhen/Desktop/project/zzt-mini-program-ali/src/pages/index/index.vue"]]);
my.createPage(MiniProgramPage);
