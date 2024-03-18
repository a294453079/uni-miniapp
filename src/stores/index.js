import {
	appStore
} from "./modules/app.js"

const useStore = (instance)=>({
		app: appStore(instance),
})


export default useStore;
/**
 * 用法
 * 	import useStore from "@/store/index.js"
	const {
		app
	} = useStore();
	
	let app = app.appIndex
 */