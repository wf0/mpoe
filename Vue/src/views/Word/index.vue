<template>
  <div class="word">
    <!-- 菜单栏 -->
    <div class="word-menu">
      <menuVue @iconClick="iconClickHandle" @show_sap="showsap = true" />
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
    <!-- 查找替换 -->
    <div class="word-search" v-if="showsap">
      <searchVue
        ref="searchRef"
        @iconClick="iconClickHandle"
        @close="showsap = false"
      />
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import { useEditor } from "@/hooks/useEditor";
import menuVue from "./components/menu.vue";
import footerVue from "./components/footer.vue";
import sidebarVue from "./components/sidebar.vue";
import directoryVue from "./components/directory.vue";
import searchVue from "./components/search.vue";
import { ws_server_url as url } from "/default.config";

var { instance, data, options, iconClickHandle } = useEditor();

// 搜索组件 Ref
let searchRef = ref(null);

// 是否显示查找替换 由menu决定
let showsap = ref(false);

// 需要传递多个信息
let footerInfo = reactive({
  pageScaleNumber: 1,
  total: 0,
});

onMounted(async () => {
  // 协同相关配置 解决初始加载会报错问题
  let { username, userid } = JSON.parse(sessionStorage.getItem("user"));
  let roomname = window.location.hash.split("word/")[1]; // 当前文件的fileid

  // 初始化 canvas-editor
  instance = new CanvasEditor(
    document.querySelector(".word-editor-dom"),
    data,
    options,
    { url, username, userid, roomname }
  );

  // 供全局拿取instance
  Reflect.set(window, "__instance__", instance);
  // 这个是配合 canvas-editor 的API调用，后续可以删除
  Reflect.set(window, "instance", instance);

  // 监听页面缩放变化
  instance.listener.pageScaleChange = (payload) => {
    footerInfo.pageScaleNumber = payload;
  };

  // 注册快捷键[Ctrl+F Ctrl+P]
  instance.register.shortcutList([
    {
      key: "f", // ctrl + F
      mod: true,
      isGlobal: true,
      callback: async (command) => {
        // 显示搜索框
        showsap.value = true;
        await nextTick();
        // 获取当前用户输入
        const text = command.getRangeText();
        //  调用组件方法
        searchRef.value.shortcutCtrlF(text);
      },
    },
    {
      key: "p", // ctrl + P
      mod: true,
      isGlobal: true,
      callback: async (command) => {
        command.executePrint();
      },
    },
  ]);
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

  &-search {
    z-index: 9999;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;
    position: absolute;
    right: 50px;
    top: 90px;
  }
}
</style>
