<template>
  <div class="top" @click.stop="hiddenContentMenu">
    <div class="top-left">
      <el-button type="primary" @click.stop="showContentMenu">
        <i class="iconfont icon-xinjian"></i>
        <span>新建</span>
      </el-button>

      <el-button text @click.stop="inputRef.click()">
        <i class="iconfont icon-daoru"></i>
        <span>导入</span>
      </el-button>

      <el-button text @click="toTemplate">
        <i class="iconfont icon-duqumoban"></i>
        <span>模板</span>
      </el-button>

      <el-button text>
        <i class="iconfont icon-gongneng"></i>
        <span>工具箱</span>
      </el-button>
    </div>
    <div class="top-right">
      <div class="top-right-vip">
        <el-link type="danger">
          <i class="iconfont icon-zuanshi"></i>
          <span>{{ advertisement }}</span>
        </el-link>
      </div>
      <div class="top-right-message" style="margin-right: 20px">
        <el-badge :value="''" class="item">
          <i class="iconfont icon-xiaoxizhongxin"></i>
        </el-badge>
      </div>

      <div class="top-right-user">
        <dropdown :list="optList" @command="commandhandle">
          <template #content>
            <div class="userimg_svg" v-html="userSvg" v-if="userSvg" />
            <el-avatar
              v-else
              shape="square"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
            <i class="iconfont icon-tipvip" v-if="vipuser"></i>
          </template>
        </dropdown>
      </div>
    </div>

    <!-- 系统设置抽屉 -->
    <!-- <settings
      :visible="settingsOption"
      @drawerClose="settingsOption.show = false"
    /> -->

    <!-- 右键菜单 -->
    <contentmenu
      v-if="showContentMenuInCurrent"
      ref="contentmenuRef"
      @close="close"
    />

    <!-- 定义 隐藏 input -->
    <input
      type="file"
      @change="fileChange"
      style="display: none"
      accept="*"
      ref="inputRef"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import dropdown from "@el/DropdownPageTop/index.vue";
import router from "@/router";
// import settings from "./components/settings.vue";
import contentmenu from "@compo/Contentmenu/index.vue";

const advertisement = ref("【双十一】超值活动，会员低至0.5元/天！");

let vipuser = ref(true);

let userSvg = ref("");

const optList = reactive([
  {
    name: "个人中心",
    command: "user",
    icon: "icon-zhanghao",
  },
  {
    name: "系统设置",
    command: "setting",
    icon: "icon-shezhi-xianxing",
  },
  {
    name: "项目地址",
    command: "gitee",
    icon: "icon-github-fill",
  },
  {
    name: "退出系统",
    command: "exit",
    icon: "icon-tuichu",
  },
]);

const settingsOption = reactive({
  show: false,
});

const commandhandle = (command) => {
  switch (command) {
    case "user":
      router.push("/user");
      break;

    case "gitee":
      window.open("https://gitee.com/wfeng0/mpoe");
      break;
    case "setting":
      settingsOption.show = true;
      break;
    case "exit":
      sessionStorage.clear();
      router.push("/login");
      break;
  }
};
const toTemplate = () => router.push("/template");

// 菜单Ref
let contentmenuRef = ref(null);
// 是否显示菜单
let showContentMenuInCurrent = ref(false);

// 显示菜单
const showContentMenu = async () => {
  showContentMenuInCurrent.value = true;
  await nextTick();
  contentmenuRef.value.showContentMenu({ x: 320, y: 50 }, true);
};

const close = () => (showContentMenuInCurrent.value = false);

// 导入文件
let inputRef = ref(null);

const fileChange = (e) => {
  const { files } = e.target;
  console.log("filechange", files);
  /**
   * 根据文件类型进行文件读取
   */
};

// mounted
onMounted(() => {
  let user = JSON.parse(sessionStorage.getItem("user"));
  vipuser.value = user.vip;
  userSvg.value = user.userimg;
});
</script>

<style lang="less" scoped>
.top {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 5px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  i {
    margin-right: 5px;
  }

  &-right {
    display: flex;
    align-items: center;
    & > div {
      cursor: pointer;
      margin: 0 5px;
    }
    &-setting,
    &-message {
      i {
        font-size: 20px;
      }
    }

    &-user {
      position: relative;
      i {
        position: absolute;
        right: -20px;
        top: 0;
        font-size: 24px;
        color: #f56c6c;
      }
    }
  }
}
</style>
