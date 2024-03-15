"use strict";
const common_vendor = require("../../common/vendor.js");
const settings_system = require("../../settings/system.js");
if (!Array) {
  const _easycom_up_button2 = common_vendor.resolveComponent("up-button");
  const _easycom_fui_button2 = common_vendor.resolveComponent("fui-button");
  const _easycom_fui_tag2 = common_vendor.resolveComponent("fui-tag");
  const _easycom_u_rate2 = common_vendor.resolveComponent("u-rate");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_radio2 = common_vendor.resolveComponent("u-radio");
  const _easycom_u_radio_group2 = common_vendor.resolveComponent("u-radio-group");
  (_easycom_up_button2 + _easycom_fui_button2 + _easycom_fui_tag2 + _easycom_u_rate2 + _easycom_u_tag2 + _easycom_u_radio2 + _easycom_u_radio_group2)();
}
const _easycom_up_button = () => "../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_fui_button = () => "../../node-modules/firstui-uni/firstui/fui-button/fui-button.js";
const _easycom_fui_tag = () => "../../node-modules/firstui-uni/firstui/fui-tag/fui-tag.js";
const _easycom_u_rate = () => "../../node-modules/uview-plus/components/u-rate/u-rate.js";
const _easycom_u_tag = () => "../../node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_radio = () => "../../node-modules/uview-plus/components/u-radio/u-radio.js";
const _easycom_u_radio_group = () => "../../node-modules/uview-plus/components/u-radio-group/u-radio-group.js";
if (!Math) {
  (_easycom_up_button + _easycom_fui_button + _easycom_fui_tag + _easycom_u_rate + _easycom_u_tag + _easycom_u_radio + _easycom_u_radio_group)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const radiolist1 = common_vendor.shallowReactive([
      {
        name: "苹果",
        disabled: false
      },
      {
        name: "香蕉",
        disabled: false
      },
      {
        name: "橙子",
        disabled: false
      },
      {
        name: "榴莲",
        disabled: false
      }
    ]);
    const radiovalue1 = common_vendor.shallowRef("苹果");
    const groupChange = (n) => {
      console.log("groupChange", n);
    };
    const radioChange = (n) => {
      console.log("radioChange", n);
    };
    common_vendor.ref([
      {
        text: "点赞",
        color: "blue",
        fontSize: 28
      },
      {
        text: "分享"
      },
      {
        text: "评论"
      }
    ]);
    const showRef = common_vendor.ref(true);
    const count = common_vendor.ref(4);
    const value = common_vendor.ref(2);
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
        h: common_vendor.o(handleQuery),
        i: common_vendor.p({
          type: "primary",
          text: "确定",
          ["u-reset-button"]: true
        }),
        j: common_vendor.o(($event) => showRef.value = true),
        k: common_vendor.p({
          text: "标签一"
        }),
        l: common_vendor.o(($event) => value.value = $event),
        m: common_vendor.p({
          count: count.value,
          modelValue: value.value
        }),
        n: common_vendor.p({
          text: "标签",
          plain: true,
          size: "large",
          type: "warning"
        }),
        o: common_vendor.f(common_vendor.unref(radiolist1), (item, index, i0) => {
          return {
            a: index,
            b: common_vendor.o(radioChange, index),
            c: "83a5a03c-6-" + i0 + ",83a5a03c-5",
            d: common_vendor.p({
              customStyle: {
                marginBottom: "8px"
              },
              label: item.name,
              name: item.name
            })
          };
        }),
        p: common_vendor.o(groupChange),
        q: common_vendor.o(($event) => common_vendor.isRef(radiovalue1) ? radiovalue1.value = $event : null),
        r: common_vendor.p({
          placement: "column",
          modelValue: common_vendor.unref(radiovalue1)
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-83a5a03c"], ["__file", "D:/program/uni-ztsz/src/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
