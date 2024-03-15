<template>
  <view class="content">
    <view class="px-30rpx">
      <view class="input-group">
        <input class="input-item" type="number" v-model="form.number" placeholder="请输入考生的报名序号"
          placeholder-style="color: #BFBFBF" :maxlength="numberMaxLength"
          :style="{ color: verifyNumber ? '#333' : 'red' }" />
        <input class="input-item" type="idcard" v-model="form.idCard" maxlength="4" placeholder="请输入身份证后四位"
          placeholder-style="color: #BFBFBF" />
      </view>

      <button class="button" type="primary" :loading="loading" @click="handleQuery">查询</button>
    </view>
    <view class="px-30rpx">看看2</view>
    <view class="px-30px">看看1</view>

    <view class="">
      <up-button type="primary" text="确定" u-reset-button></up-button>
    </view>
    <fui-button @click="showRef = true">默认按钮</fui-button>
    <fui-tag text="标签一"></fui-tag>
    <u-rate :count="count" v-model="value"></u-rate>
    <view>
      <u-tag text="标签" plain size="large" type="warning"></u-tag>
    </view>

    <u-radio-group v-model="radiovalue1" placement="column" @change="groupChange">
      <u-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index"
        :label="item.name" :name="item.name" @change="radioChange">
      </u-radio>
    </u-radio-group>
  </view>
</template>

<script setup>
import { computed, shallowReactive, shallowRef } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

import { useGlobalSetting } from '../../settings/system'
import { ref } from 'vue';


// 基本案列数据
const radiolist1 = shallowReactive([
  {
    name: '苹果',
    disabled: false,
  },
  {
    name: '香蕉',
    disabled: false,
  },
  {
    name: '橙子',
    disabled: false,
  },
  {
    name: '榴莲',
    disabled: false,
  },
]);

// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
const radiovalue1 = shallowRef('苹果');

const groupChange = (n) => {
  console.log('groupChange', n);
};

const radioChange = (n) => {
  console.log('radioChange', n);
};

const list = ref([
  {
    text: '点赞',
    color: 'blue',
    fontSize: 28
  },
  {
    text: '分享'
  },
  {
    text: '评论'
  }
]);

const showRef = ref(true);

const count = ref(4);
const value = ref(2);

const { basisId, apiUrl, alipayId } = useGlobalSetting()

const loading = shallowRef(false)

const form = shallowReactive({ number: '', idCard: '', year: 2023 })

const verifyNumber = computed(() => {
  if (!form.number) return true
  return new RegExp('^' + basisId + '\\d{10}$|^07\\d{7}$').test(form.number)
})

const numberMaxLength = computed(() => (/^07/.test(form.number) ? 9 : 14))

onLoad(async () => {
  // const { code, authSuccessScopes } = await uni.login({
  //   provider: 'alipay',
  //   scopes: ['auth_base', 'auth_user', 'auth_zhima'],
  // })
  // console.log(code, authSuccessScopes)
  // const { data } = await uni.request({
  //   url: `${apiUrl}/paas/userAuth/login/alipay`,
  //   method: 'POST',
  //   data: { authCode: code, appId: alipayId },
  // })

  // uni.setStorageSync('USER_INFO', data.data)
})

const handleQuery = async () => {
  if (loading.value) return

  try {
    loading.value = true

    if (!new RegExp('^' + basisId + '\\d{10}$|^07\\d{7}$').test(form.number)) {
      return uni.showModal({
        title: '温馨提示',
        content: `请输入以"${basisId}"开头正确的报名序号`,
        showCancel: false,
      })
    }
    const { data } = await uni.request({
      url: `${apiUrl}/wec-hsees/v2/exam/score/read`,
      header: {
        authorization: uni.getStorageSync('USER_INFO').token,
      },
      method: 'GET',
      data: { idcardLast: form.idCard, serialNumber: form.number },
    })
    uni.setStorageSync('SCORE', data.data)

    await uni.navigateTo({ url: '/pages/queryResults/index' })
  } catch (e) {
    if (e?.data?.code !== 200) {
      uni.showToast({ title: `查询错误: ${e.data.msg}` })
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.content {
  input {
    cursor: auto;
    display: block;
    height: 1.4rem;
    min-height: 1.4rem;
    overflow: hidden;
    text-overflow: clip;
    white-space: nowrap;
    padding-left: 20rpx;
  }

  .title {
    color: #2b64ff;
    margin: 80rpx 30rpx 50rpx;
    font-size: 38rpx;
    font-weight: bold;
    text-align: center;
  }

  .input-group {
    width: 690rpx;
    margin: 0 auto;
    background-color: white;
    border-radius: 10rpx;
    overflow: hidden;
    box-shadow: 0 5rpx 10rpx 0 rgba(0, 0, 0, 0.1);

    .input-item {
      margin: 0 30rpx;
      font-size: 34rpx;
      border-bottom: 1px solid #e5e5e5;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  // .px-30rpx {
  //   padding-left: 30rpx;
  //   padding-right: 30rpx;
  // }

  .button {
    background: linear-gradient(-90deg, rgba(43, 100, 255, 1), rgba(78, 149, 255, 1));
    margin: 50rpx 0 20rpx;
    border-radius: 44rpx;
  }

  .tips {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
  }
}
</style>
