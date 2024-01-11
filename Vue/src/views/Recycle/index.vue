<template>
  <div class="box">
    <el-page-header :icon="ArrowLeft" @back="router.back()">
      <template #content>
        <span class="text-large font-600 mr-3"> 回收站 </span>
      </template>
      <div class="mt-4 text-sm font-bold box-main">
        <!-- 列表展示回收站的文件 -->
        <!-- @contextmenu.prevent.stop="(e) => showFileContentMenu(e, index)" -->
        <div
          class="box-main-item"
          v-for="(item, index) in pageList"
          :key="index"
        >
          <!-- 通过 data- 自定义属性实现底层元素拿到数据 -->
          <i
            :data-fileid="item.fileid"
            :data-filename="item.filename"
            :data-filesuffix="item.suffix || item.filesuffix"
            class="iconfont"
            :class="item.icon"
            :style="{ color: getFileIconColor(item.suffix, item.type) }"
          />
          <span>
            {{
              item.type === "folder"
                ? item.foldername
                : item.filename + "." + item.suffix
            }}
          </span>
        </div>
      </div>
    </el-page-header>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { getAllFiles_API } from "@/api/file";
import { ArrowLeft } from "@element-plus/icons-vue";
import router from "@/router";

let pageList = reactive([]);

// 文档类型动态颜色
function getFileIconColor(suffix, type) {
  if (suffix === "word") return "#0f90e3";
  if (suffix === "xlsx") return "#01a408";
  if (suffix === "pdf") return "#ea5454";
  if (suffix === "txt") return "rgba(0, 0, 0, 0.6)";
  if (suffix === "md") return "#5A96DB";
  if (type === "folder") return "#ffd153";
  return "";
}

const getFileTypeAndIcon = (i) => {
  if (i.folderid) {
    // 添加文件夹属性
    i.type = "folder";
    i.icon = "icon-24gf-folderOpen";
  }
  if (i.filesuffix === "md") {
    i.type = "markdown";
    i.icon = "icon-file-markdown1";
  }
  if (i.filesuffix === "txt") {
    i.type = "txt";
    i.icon = "icon-wenben1";
  }

  if (i.filesuffix === "xlsx") {
    i.type = "excel";
    i.icon = "icon-excel";
  }

  i.suffix = i.filesuffix;
};

onMounted(async () => {
  let { userid } = JSON.parse(sessionStorage.getItem("user"));
  // 请求 state =2 的文件
  let { code, msg, data } = await getAllFiles_API({ userid, state: 2 });
  pageList.length = 0;
  data.forEach((i) => {
    getFileTypeAndIcon(i);
    pageList.push(i);
  });
});
</script>

<style lang="less" scoped>
.box {
  padding: 20px;
  height: 100vh;
  overflow: hidden;
  /deep/.el-page-header {
    height: 100%;
  }
  /deep/.el-page-header__main {
    height: calc(100% - 24px);
  }
  &-main {
    height: 100%;
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    &-item {
      padding: 5px;
      flex-shrink: 0;
      cursor: pointer;
      margin: 10px;
      width: 100px;
      // height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;

      &:hover {
        background-color: #fafbfc;
        box-shadow: 0px 0px 20px 0px #ccc;
      }
      // 文件图标
      i {
        font-size: 64px;
        height: 80%;
      }
      // 文件名
      span {
        text-align: center;
        margin-top: 10px;
      }
      // 修改文件名输入框
      .el-input {
        margin-top: 10px;
      }
    }
  }
}
</style>
