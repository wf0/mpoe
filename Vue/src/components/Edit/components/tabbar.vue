<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <i
        v-for="item in toolbarList[0]"
        :key="item.icon"
        class="iconfont"
        :class="item.icon"
        :title="item.title"
        @click="iconClick(item.icon)"
      />

      <!-- 颜色弹窗     { icon: "icon-zitiyanse", title: "字体颜色" }, -->
      <i class="iconfont icon-zitiyanse">
        <div class="colorBox">
          <input v-model="color" type="color" />
        </div>
      </i>
      <i
        v-for="item in toolbarList[1]"
        :key="item.icon"
        class="iconfont"
        :class="item.icon"
        :title="item.title"
        @click="iconClick(item.icon)"
      />
      <!-- emoji -->
      <i class="iconfont icon-emoji emoji" title="emoji">
        <!-- emoji -->
        <div class="emoji-box">
          <el-scrollbar height="150px">
            <span
              @click="chooseEmoji(emoji)"
              v-for="emoji in emojilist"
              :key="emoji"
              >{{ emoji }}</span
            >
          </el-scrollbar>
        </div>
      </i>
    </div>
    <div class="toolbar-right">
      <i
        v-for="item in toolbarList[2]"
        :key="item.icon"
        class="iconfont"
        :class="item.icon"
        :title="item.title"
        @click="iconClick(item.icon)"
      />
    </div>

    <!-- 文件上传 -->
    <input
      @change="upload"
      type="file"
      style="display: none"
      name="file"
      id="file"
      ref="uploadRef"
      accept="image/*"
    />
  </div>
</template>

<script setup>
import emojilist from "@/util/emoji.js";
import { myQuill } from "../Quill";
import { myYjs } from "../Yjs";
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import router from "@/router";
import { tabbarConfig } from "./config";
import {
  editUploadFile_API,
  saveFile_API,
  getFileContent_API,
} from "@/api/file";
import { utf16toEntities } from "@/util/utf16";
import { ElMessage } from "element-plus";

import { http_server_url } from "/default.config";
// 定义Quill对象
let quill = reactive({});

// 文件上传 ref
const uploadRef = ref("");

// yanse
let color = ref("");

watch(color, (val) => quill.format("color", val));

// 定义toolbar 列表
const toolbarList = reactive(tabbarConfig);

// 图标点击事件
const iconClick = (icon) => {
  // 不是所有icon都需要触发 iconclick事件
  switch (icon) {
    // 撤销
    case "icon-chexiao":
      quill.undo();
      break;

    // 重做
    case "icon-zhongzuo":
      quill.redo();
      break;

    // 清空
    case "icon-cachu":
      quill.clear();
      break;

    // 格式化
    case "icon-cuti":
    case "icon-italic":
    case "icon-strikethrough":
    case "icon-zitixiahuaxian":
      quill.format(icon);
      break;

    // 保存
    case "icon-baocun":
      // 调用接口实现数据保存
      saveFile(JSON.stringify(quill.getDetail()));
      break;

    // 文件上传
    case "icon-tupian":
      uploadRef.value.click();
      break;

    // 进入全屏
    case "icon-24gl-fullScreenEnter2":
      document.querySelector(".header").style.display = "none";
      toolbarList[2].pop();
      toolbarList[2].push({
        icon: "icon-a-122-tuichuquanping",
        title: "退出全屏",
      });
      break;

    //  退出全屏 document.exitFullscreen()
    case "icon-a-122-tuichuquanping":
      document.querySelector(".header").style.display = "flex";
      toolbarList[2].pop();
      toolbarList[2].push({
        icon: "icon-24gl-fullScreenEnter2",
        title: "进入全屏",
      });
      break;

    default:
      break;
  }
};

// 保存文件
const saveFile = async (c) => {
  // c 中包含emoji表情，需要做进制转换，不然数据库不能保存
  let content = utf16toEntities(JSON.stringify(JSON.parse(c).ops).toString());
  // userid  fileid content
  let fileid = router.currentRoute.value.params.fileid;
  let { userid } = JSON.parse(sessionStorage.getItem("user"));

  let res = await saveFile_API({ fileid, userid, content });
  if (res.code !== 200) return ElMessage.error(res.msg);
  ElMessage.success(res.msg);
};

// emoji
const chooseEmoji = (emoji) => quill.insertText(emoji);

// 文件上传
const upload = async (e) => {
  // 创建的本地浏览文件，无法实现 quill 中的url请求，需要借助服务器
  // let url = window.URL.createObjectURL(files[0]);
  // quill.insertEmbed(0, "image", url);

  let { files } = e.target;
  let form = new FormData();
  form.append("file", files[0]);
  let res = await editUploadFile_API(form);
  // 上传成功后，直接拿到地址，添加到编辑器中
  if (res.code !== 200) return ElMessage.error(res.msg);
  quill.insertEmbed(null, "image", http_server_url + res.data);
};

const handleEditContent = async (fileid) => {
  let { ops } = quill.getDetail();
  // 如果同步后编辑器内容还是空，则加载版本内容
  if (ops[0].insert !== "\n") return;
  // 请求版本内容
  let res = await getFileContent_API({ fileid });
  if (res.code === 200) quill.init(res.data);
};

const winEvent = (e) => {
  if (e.code === "KeyS" && e.keyCode === 83) {
    e.preventDefault();
    e.returnValue = false; // 阻止直接保存网页
    // 调用保存
    saveFile(JSON.stringify(quill.getDetail()));
  }
};

onMounted(() => {
  let { fileid } = router.currentRoute.value.params;
  let { username } = JSON.parse(sessionStorage.getItem("user"));
  // 获取dom需要在mounted后
  quill = new myQuill("#edit");
  if (import.meta.env.MODE === "development") window.quill = quill;
  // 获取焦点
  quill.focus();

  // 处理编辑器内容  获取 版本信息
  setTimeout(() => handleEditContent(fileid), 100); // 这个定时器一定是需要的哈，因此网络同步数据是需要时间的，不然永远获取的都是空,也可以写在Yjs 的链接 y-websocket之后

  // 初始化YJS
  let yjs = new myYjs(quill, fileid, username);

  // 实现 Ctrl+S 保存
  // window.addEventListener("keydown", winEvent);
});
</script>

<style lang="less" scoped>
.toolbar {
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  i {
    cursor: pointer;
    margin: 0 5px;
  }
}
.emoji {
  position: relative;
  &:hover {
    .emoji-box {
      display: flex;
    }
  }
  &-box {
    width: 200px;
    z-index: 999;
    display: none;
    position: absolute;
    border: solid #ccc 1px;
    left: 0;
    top: 100%;
    background-color: #fafbfc;
    padding: 5px;
    span {
      margin: 3px;
    }
  }
}

.icon-zitiyanse {
  position: relative;
  .colorBox {
    z-index: 999;
    border: solid #ccc 1px;
    left: 0;
    top: 100%;
    background-color: #fafbfc;
    display: none;
    position: absolute;
    padding: 5px;
  }
  &:hover .colorBox {
    display: block;
  }
}
</style>
