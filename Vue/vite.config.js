// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { server_port } from "./src/default.config";
const path = require("path");
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    // 生产不需要开启代理
    proxy: {
      "/baseURL": {
        target: `http://localhost:${server_port}/`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/baseURL/, ""),
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
      {
        find: "@views",
        replacement: path.resolve(__dirname, "src/views"),
      },
      {
        find: "@compo",
        replacement: path.resolve(__dirname, "src/components"),
      },
      {
        find: "@el",
        replacement: path.resolve(__dirname, "src/el-components"),
      },
    ],
  },
});
