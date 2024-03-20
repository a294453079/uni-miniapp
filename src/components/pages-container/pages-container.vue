<template>
  <view class="pages-container" :style="[containerStyle]">
    <Loading :loading="pageLoading" :type="loadingType" :text="loadingText" :text-style="loadingTextStyle"
      :context-style="loadingContextStyle" :is-full="scrollContainer">
      <scroll-view v-if="scrollContainer" scroll-y class="scroll-container" :style="[scrollStyle]" scroll-anchoring
        :refresher-enabled="scrollRefresher" :refresher-triggered="scrollState.refreshStatus"
        @refresherrefresh="refresherRefresh" @scrolltolower="scrollToLower" @scrolltoupper="scrollToUpper">
        <slot></slot>
      </scroll-view>
      <slot v-else></slot>
    </Loading>
    <!--  todo: 扩展出顶部提示  -->
  </view>
</template>

<script setup>
import { computed, defineProps, ref, onBeforeMount, defineEmits } from 'vue'
import Loading from '@/components/loading/loading.vue'
import { sleep } from '@/utils/helper/uniHelper'
import {
  getMenuButtonBoundingRect,
  getSystemSetting
} from '@/utils/helper/cacheQueryHelper'
const props = defineProps({
  hasCustomNavbar: {
    type: Boolean,
    default: false
  },
  // 开启 loading 动画
  loading: {
    type: Boolean,
    default: false
  },
  loadingType: {
    type: Number,
    default: 1
  },
  loadingText: {
    type: String,
    default: null
  },
  loadingTextStyle: {
    type: Object,
    default: () => ({})
  },
  loadingContextStyle: {
    type: Object,
    default: () => ({})
  },
  // 启用滚动容器
  scrollContainer: {
    type: Boolean,
    default: false
  },
  scrollStyle: {
    type: Object,
    default: () => ({})
  },
  // 启用下拉刷新
  scrollRefresher: {
    type: Boolean,
    default: false
  },
  scrollToUpperAllow: {
    type: Boolean,
    default: false
  },
  scrollToLowerAllow: {
    type: Boolean,
    default: false
  },
  scrollLoadMoreOptions: {
    type: Object,
    default: () => ({})
  },
})

const pageLoading = computed(() => {
  return this.loading
})

const containerStyle = ref({
  minHeight: '100vh'
})

onBeforeMount(() => {
  if (this.hasCustomNavbar) {
    const { statusBarHeight = 24 } = getSystemSetting()
    const { top, bottom } = getMenuButtonBoundingRect()
    // this.containerStyle = {
    //   height: `calc(100vh - ${top - statusBarHeight + bottom}px)`
    // }
  }
})

const scrollState = ref({
  // 当前下拉刷新状态
  refreshStatus: false,
  // 是否正在操作
  isHandle: false
})
const emit = defineEmits(['onRefresh', 'scrollToUpper', 'scrollToLower'])
const refresherRefresh = (() => {
  if (scrollState.value.isHandle) return
  scrollState.value.isHandle = true
  scrollState.value.refreshStatus = true

  emit('onRefresh', async () => {
    await sleep(300)
    scrollState.value.refreshStatus = false
    scrollState.value.isHandle = false
  })
})

const scrollToUpper = (() => {
  if (!this.scrollToUpperAllow) return
  if (scrollState.value.isHandle) return
  scrollState.value.isHandle = true

  emit('scrollToUpper', async () => {
    await sleep(300)
    scrollState.value.isHandle = false
  })
})

const scrollToLower = (() => {
  if (!this.scrollToLowerAllow) return
  if (scrollState.value.isHandle) return
  scrollState.value.isHandle = true

  emit('scrollToLower', async () => {
    await sleep(300)
    scrollState.value.isHandle = false
  })
}) 
</script>

<style lang="scss">
.pages-container {
  width: 100vw;
  position: relative;
  padding: 0;
}

.scroll-container {
  box-sizing: border-box;
  height: 100%;
}
</style>
