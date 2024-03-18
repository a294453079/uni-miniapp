import {
	appStore
} from "./modules/app.js"

const useStore = () => ({
	app: appStore(),
});

export default useStore;
/**
 * 用法
 * 	import useStore from "@/store/index.js"
	const {
		app
	} = userStore();
	
	let app = app.appIndex
 */