<template>
  <div class="word">
    <!-- 菜单栏 -->
    <div class="word-menu">
      <menuVue @iconClick="iconClickHandle" />
    </div>
    <el-scrollbar class="word-editor">
      <!-- 目录 -->
      <div class="word-editor-directory"><directoryVue /></div>
      <!-- 编辑器内容区 -->
      <div class="word-editor-dom"></div>
      <!-- 侧边栏 支持批注 聊天 -->
      <div class="word-editor-sidebar"><sidebarVue /></div>
    </el-scrollbar>
    <div class="word-footer">
      <footerVue :footerInfo="footerInfo" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useEditor } from "@/hooks/useEditor";
import menuVue from "./components/menu.vue";
import footerVue from "./components/footer.vue";
import sidebarVue from "./components/sidebar.vue";
import directoryVue from "./components/directory.vue";

var { instance, data, options, websocket, iconClickHandle } = useEditor();

// 需要传递多个信息
let footerInfo = reactive({
  pageScaleNumber: 1,
  total: 0,
});

onMounted(async () => {
  // 请求 data 开启协同
  // 初始化 canvas-editor
  instance = new CanvasEditor(
    document.querySelector(".word-editor-dom"),
    data,
    options,
    websocket
  );

  // 供全局拿取instance
  Reflect.set(window, "__instance__", instance);
  Reflect.set(window, "instance", instance);

  // 监听页面缩放变化
  instance.listener.pageScaleChange = (payload) => {
    footerInfo.pageScaleNumber = payload;
  };
});
</script>

<style lang="less" scoped>
.word {
  background-color: #e0e5e9;
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  &-menu {
    min-height: 50px;
  }
  &-editor {
    position: relative;
    height: calc(100vh - 60px);
    overflow: hidden;
    /deep/.el-scrollbar__view {
      display: flex;
      position: relative;
    }
    &-directory,
    &-sidebar {
      width: 20vw;
      height: calc(100% - 120px);
      // background-color: red;
      flex: 1;
      position: fixed;
      top: 85px;
    }
    &-sidebar {
      right: 0;
    }
    &-dom {
      z-index: 999;
      display: flex;
      justify-content: center;
      flex: 3;
      height: auto;
    }
  }
  &-footer {
    padding: 0 10px;
    height: 30px;
    display: flex;
    align-items: center;
    border-top: solid #ccc 1px;
  }
}
</style>
