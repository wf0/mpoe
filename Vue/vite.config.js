// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const path = require("path");
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    // 生产不需要开启代理
    proxy: {
      "/baseURL": {
        target: "http://localhost:5000/",
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
