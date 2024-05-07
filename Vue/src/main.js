import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { setTheme } from "./util/theme";
import router from "./router";
import store from "./store";
// 引入 socket.io
import VueSocketIO from "vue-socket.io";
import { socket_server_url } from "/default.config";
setTheme("bjl");

/* SocketIOClient.Socket, */
const socket = new VueSocketIO({
  debug: false, // debug调试，生产建议关闭
  connection: socket_server_url,
  options: { autoConnect: false },
});
createApp(App)
  .use(ElementPlus)
  .provide("socket", socket) // 传递 socket 对象
  .use(router)
  .use(store)
  .mount("#app");
