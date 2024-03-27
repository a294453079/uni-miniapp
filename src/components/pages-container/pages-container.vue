<template>
  <view class="pages-container" :style="[containerStyle]">
    <Loading :loading="pageLoading" :type="loadingType" :text="loadingText" :text-style="loadingTextStyle"
      :context-style="loadingContextStyle" :is-full="scrollContainer">
      <scroll-view v-if="scrollContainer" scroll-y class="scroll-container" :style="[containerStyle]" scroll-anchoring
        :refresher-enabled="scrollRefresher" :refresher-triggered="scrollState.refreshStatus"
        refresher-background="#F7F7F8" @refresherrefresh="refresherRefresh" @scrolltolower="scrollToLower"
        @scrolltoupper="scrollToUpper">
        <slot></slot>
      </scroll-view>
      <slot v-else></slot>
    </Loading>
    <!--  todo: 扩展出顶部提示  -->
  </view>
</template>

<script setup>
import { computed, defineProps, ref, onBeforeMount, defineEmits, watch } from 'vue'
import Loading from '@/components/loading/loading.vue'
import { sleep } from '@/utils/helper/uniHelper'
import {
  getMenuButtonBoundingRect,
  getSystemSetting,
  getBgNavBarHeight
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
  /**滚动到底部加载下一页 */
  scrollToLowerAllow: {
    type: Boolean,
    default: false
  },
  scrollLoadMoreOptions: {
    type: Object,
    default: () => ({})
  },
  customHeight: {
    type: Number,
    default: 0
  }
})

const pageLoading = computed(() => {
  return props.loading
})

const containerStyle = ref({
  minHeight: '100vh'
})

// if (Object.keys(props.customHeight).length) {
//   containerStyle.value = { ...props.customHeight }
// }

const initCustomHeight = () => {
  if (props.hasCustomNavbar) {
    const { height, paddingTop } = getBgNavBarHeight()
    const bgHeight = (height + paddingTop)
    if (props.customHeight) {
      containerStyle.value = {
        height: `calc(100vh - ${bgHeight + props.customHeight + 8}px)`
      }
    } else {
      containerStyle.value = {
        height: `calc(100vh - ${bgHeight + 8}px)`
      }
    }
  }
}


onBeforeMount(() => {
  initCustomHeight()
})

watch(() => props.customHeight, (newVal) => {
  initCustomHeight()
})

const scrollState = ref({
  // 当前下拉刷新状态
  refreshStatus: false,
  // 是否正在操作
  isHandle: false
})
const emit = defineEmits(['onRefresh', 'scrollToUpper', 'scrollToLower'])
const refresherRefresh = (async () => {
  console.log('自定义下拉刷新', scrollState.value)
  // 是否正在操作);
  if (scrollState.value.isHandle) return
  scrollState.value.isHandle = true
  scrollState.value.refreshStatus = true

  emit('onRefresh')
  await sleep(300)
  scrollState.value.refreshStatus = false
  scrollState.value.isHandle = false
})


const scrollToUpper = (async () => {
  console.log('滚动到顶部');
  if (!props.scrollToUpperAllow) return
  if (scrollState.value.isHandle) return
  scrollState.value.isHandle = true
  /**刷新 */
  emit('scrollToUpper')
  await sleep(300)
  scrollState.value.isHandle = false
})


const scrollToLower = (async () => {
  console.log('滚动到底部');
  /**加载 */
  if (!props.scrollToLowerAllow) return
  if (scrollState.value.isHandle) return
  scrollState.value.isHandle = true

  emit('scrollToLower')
  await sleep(300)
  scrollState.value.isHandle = false
  console.log('滚动到底部22222');
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

  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
