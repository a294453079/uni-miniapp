import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import uviewPlus from "uview-plus";
import pinia from "./stores"
import 'virtual:windi-components.css'
import 'virtual:windi-utilities.css'
export function createApp() {
  const app = createSSRApp(App);
  app.use(uviewPlus)
  // 如此配置即可
  // uni.$u.config.unit = 'rpx'
	return {
		app,
	};
}