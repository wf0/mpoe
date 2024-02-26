// 菜单栏
<template>
  <div class="menu" @click="showFileSelect = false">
    <div class="menu-top">
      <!-- 文件 -->
      <span @click.stop="showFileSelect = !showFileSelect">
        <i class="iconfont icon-santiaoxian" /> 文件
        <i class="iconfont icon-xiangxiazhankai" />
        <!-- 文件下拉框 -->
        <div class="fileSelete" v-if="showFileSelect">新建保存打开退出等</div>
      </span>
      <!-- 分割线 -->
      <span><i class="iconfont icon-anjianfengexian"></i></span>

      <!-- 保存、打印、撤销、重做 -->
      <span
        v-for="item in menuIconList"
        :key="item.icon"
        @click="emit('iconClick', { icon: item.icon })"
        :title="item.title"
      >
        <i class="iconfont" :class="item.icon"></i>
      </span>

      <span><i class="iconfont icon-anjianfengexian"></i></span>
      <!-- 文字部分 -->
      <span
        @click="active = index"
        v-for="(text, index) in menuTextList"
        :key="index"
        :class="{ active: active === index }"
        class="text"
      >
        {{ text }}
      </span>

      <span><i class="iconfont icon-anjianfengexian"></i></span>
      <!-- Canvas-AI -->
      <span> <img class="imgAI" src="@/assets/ai.png" alt="" />Canvas AI </span>

      <!-- 云、分享 -->
      <span class="rightIcon">
        <i class="iconfont icon-yunfuwu" title="云服务"></i>
        <el-button type="primary" size="small">分享</el-button>
        <el-button size="small" @click="router.go(-1)">返回</el-button>
      </span>
    </div>
    <div class="menu-icon">
      <!-- 这个要根据上面的文字进行动态变化 -->
      <div v-if="active === 0">
        <i
          v-for="i in active1.slice(0, 6)"
          :key="i.icon"
          @click="emit('iconClick', { icon: i.icon })"
          :title="i.title"
          class="iconfont"
          :class="i.icon"
        />

        <!-- 字体 -->
        <el-select
          v-model="fontFamilyValue"
          size="small"
          style="width: 100px; margin-right: 10px"
        >
          <el-option-group
            v-for="group in fontFamily"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              :style="{ 'font-family': item.value }"
              v-for="item in group.list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-option-group>
        </el-select>

        <!-- 字号 -->
        <el-select
          v-model="fontSizeValue"
          size="small"
          style="width: 80px; margin-right: 10px"
        >
          <el-option
            v-for="item in fontSize"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <!-- 字体的效果展示 -->
        <i
          v-for="i in active1.slice(6)"
          @click="emit('iconClick', { icon: i.icon })"
          :key="i.icon"
          :title="i.title"
          class="iconfont"
          :class="i.icon"
        />

        <!-- 行间距 -->
        <i class="iconfont icon-hangjianju" />

        <!-- 查找替换 -->
        <i class="iconfont icon-sousuotihuan" @click="emit('show_sap')" />

        <!-- 标题 -->
        <el-select
          v-model="titleLevelValue"
          size="small"
          style="width: 80px; margin-right: 10px"
        >
          <el-option
            :style="{ fontSize: item.value }"
            v-for="item in titleLevel"
            :key="item.value"
            :label="item.label"
            :value="item.level"
          />
        </el-select>
      </div>
      <div v-if="active === 1">空白页</div>
      <div v-if="active === 2">2</div>
      <div v-if="active === 3">3</div>
      <div v-if="active === 4">4</div>
      <div v-if="active === 5">5</div>
      <div v-if="active === 6">6</div>
      <div v-if="active === 7">7</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import router from "../../../router";
import {
  menuIconList,
  menuTextList,
  active1,
  fontFamily,
  fontSize,
  titleLevel,
} from "../config";

// 所有的icon 都需要经过instance.command.xxx API 调用，因此，应该回传参数 实现对应功能
const emit = defineEmits(["iconClick", "show_sap"]);

// 是否显示文件下拉框
let showFileSelect = ref(false);

// 激活的文字index
let active = ref(0);

// 字体
let fontFamilyValue = ref("宋体");

// 字号
let fontSizeValue = ref(14);

// 标题
let titleLevelValue = ref("none");

watch(fontFamilyValue, (value) =>
  emit("iconClick", { icon: "font-family", value })
);
watch(fontSizeValue, (value) =>
  emit("iconClick", { icon: "font-size", value })
);
</script>

<style lang="less" scoped>
.menu {
  width: 100%;
  height: 100%;
  padding: 10px;
  padding-top: 0px;
  & > div {
    position: relative;
    padding: 5px;
    display: flex;
    align-items: center;
    span {
      cursor: pointer;
      position: relative;
      margin-right: 10px;
      display: flex;
      align-items: center;
    }
  }
  &-top {
    .fileSelete {
      z-index: 9;
      background-color: #fff;
      position: absolute;
      border-radius: 5px;
      padding: 10px;
      left: -5px;
      top: 25px;
      min-width: 200px;
      min-height: 300px;
    }
    .text {
      padding-bottom: 2px;
      margin: 0 15px !important;
    }
    .active {
      font-weight: 800;
      color: #3a5fde;
      border-bottom: solid #3a5fde 2px;
    }
    .imgAI {
      width: 18px;
      height: 16px;
      margin-right: 5px;
    }
    .icon-anjianfengexian {
      cursor: default !important;
    }
    .rightIcon {
      position: absolute !important;
      margin-right: 0 !important;
      right: 0;
      & > * {
        margin-left: 10px;
      }
    }
  }
  &-icon {
    margin-bottom: 10px;
    padding: 10px !important;
    background-color: #fff;
    border-radius: 5px;
    div {
      height: 20px;
      display: flex;
      align-items: center;
      i {
        margin-right: 10px;
        cursor: pointer;
        font-size: 22px;
      }
    }
  }
}
</style>
