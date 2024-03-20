import {
	appStore
} from "./modules/app.js"

const useStore = ()=>({
		appStore: appStore(),
})


export default useStore;
/**
 * 用法
 * 	import useStore from "@/store/index.js"
	const {
		appStore
	} = useStore();
	
	let app = appStore.appIndex
 */