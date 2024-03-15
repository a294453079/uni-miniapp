"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const scoreInfo = common_vendor.ref({});
    const isSecondGrade = common_vendor.computed(() => {
      var _a, _b, _c;
      if ((_a = scoreInfo.value) == null ? void 0 : _a.serial_number) {
        return Number((_c = (_b = scoreInfo.value) == null ? void 0 : _b.serial_number) == null ? void 0 : _c.slice(9, 10)) === 8;
      }
      return false;
    });
    common_vendor.onLoad(() => {
      scoreInfo.value = common_vendor.index.getStorageSync("SCORE");
    });
    const formatScore = (e) => e ? String((+e).toFixed(2)) : "";
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(scoreInfo.value.realname),
        b: common_vendor.t(scoreInfo.value.serial_number),
        c: common_vendor.t(scoreInfo.value.idcard),
        d: common_vendor.unref(isSecondGrade)
      }, common_vendor.unref(isSecondGrade) ? {
        e: common_vendor.t(formatScore(scoreInfo.value.geography)),
        f: common_vendor.t(formatScore(scoreInfo.value.organism)),
        g: common_vendor.t(formatScore(scoreInfo.value.biological_experiment))
      } : {
        h: common_vendor.t(formatScore(scoreInfo.value.political)),
        i: common_vendor.t(formatScore(scoreInfo.value.language)),
        j: common_vendor.t(formatScore(scoreInfo.value.mathematics)),
        k: common_vendor.t(formatScore(scoreInfo.value.physics)),
        l: common_vendor.t(formatScore(scoreInfo.value.chemistry)),
        m: common_vendor.t(formatScore(scoreInfo.value.english)),
        n: common_vendor.t(formatScore(scoreInfo.value.history)),
        o: common_vendor.t(formatScore(scoreInfo.value.geography)),
        p: common_vendor.t(formatScore(scoreInfo.value.organism)),
        q: common_vendor.t(formatScore(scoreInfo.value.sports)),
        r: common_vendor.t(formatScore(scoreInfo.value.physics_operate)),
        s: common_vendor.t(formatScore(scoreInfo.value.chemistry_operate)),
        t: common_vendor.t(formatScore(scoreInfo.value.biological_experiment)),
        v: common_vendor.t(formatScore(scoreInfo.value.bonus_points)),
        w: common_vendor.t(formatScore(scoreInfo.value.total_score)),
        x: common_vendor.t(scoreInfo.value.school_name)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cfd2182b"], ["__file", "/Users/liyizhen/Desktop/project/zzt-mini-program-ali/src/pages/queryResults/index.vue"]]);
my.createPage(MiniProgramPage);
