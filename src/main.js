import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import uviewPlus from "uview-plus";
import 'virtual:windi-components.css'
import 'virtual:windi-utilities.css'
import { createPinia } from 'pinia'
// import  PiniaPluginPersistedstate  from "pinia-plugin-persistedstate";//pinia持久化插件 持久化方式2
import { createUnistorage } from "pinia-plugin-unistorage";//持久化方式1
export function createApp() {
  const app = createSSRApp(App);
  // const pinia = createPinia();	持久化方式2
  // app.use(pinia.use(PiniaPluginPersistedstate))//持久化方式2
  const pinia = createPinia()
	pinia.use(createUnistorage())
  app.use(pinia);

  app.use(uviewPlus)
  // 如此配置即可
  // uni.$u.config.unit = 'rpx'
	return {
    app,
    pinia
	};
}