import {
	userInfoStore
} from "./modules/userInfo.js"

const useStore = ()=>({
		userInfoStore: userInfoStore(),
})


export default useStore;
/**
 * 用法
 * 	import useStore from "@/store/index.js"
	const {
		userStore
	} = useStore();
	
	let app = userStore.appIndex
 */