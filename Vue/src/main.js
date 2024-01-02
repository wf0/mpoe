import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { setTheme } from "./util/theme";
import router from "./router";
import store from "./store";
// 引入 socket.io
import VueSocketIO from "vue-socket.io";
import { server_port } from "@/default.config";
setTheme("bjl");

/* SocketIOClient.Socket, */
const socket = new VueSocketIO({
  debug: false, // debug调试，生产建议关闭
  connection: `http://localhost:${server_port}`,
  //   关闭自动连接
  options: {
    autoConnect: false,
    //autoConnect 通常与 this.$socket.connect()结合使用，表示手动连接socket服务器
  },
});
createApp(App)
  .use(ElementPlus)
  .provide("socket", socket) // 传递 socket 对象
  .use(router)
  .use(store)
  .mount("#app");
