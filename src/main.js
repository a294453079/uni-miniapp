import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import uviewPlus from "uview-plus";
import 'virtual:windi-components.css'
import 'virtual:windi-utilities.css'
import * as Pinia from 'pinia';
export function createApp() {
  const app = createSSRApp(App);
  const store = Pinia.createPinia();	
  app.use(store)
  app.use(uviewPlus)
  // 如此配置即可
  // uni.$u.config.unit = 'rpx'
	return {
    app,
    Pinia
	};
}