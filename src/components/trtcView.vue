<template>
  <view>
    <web-view :src="url"></web-view>
  </view>
</template>
<script setup>
  import { onLoad } from '@dcloudio/uni-app'
  import { ref } from 'vue'
  const url = ref('')
  const { authInfo } = JSON.parse(uni.getStorageSync('userInfo'))
  onLoad((e) => {
    url.value = `${import.meta.env.VITE_APP_DEV_STUDENT_URL}trtcH5?token=${
      authInfo.access_token
    }&liveBroadcastClassId=${e.liveBroadcastClassId}`
  })
</script>

<style lang="scss" scoped></style>
