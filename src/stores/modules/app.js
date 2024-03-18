import {
	defineStore
} from 'pinia'
export const appStore = defineStore('app', {
	unistorage: true, // 是否持久化到内存
	state: () => {
		return {
			// 测试
			appIndex: 999,
		}
	},
	actions: {}
})