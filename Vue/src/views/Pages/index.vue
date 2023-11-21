<template>
  <div
    class="pages"
    @click="hiddenContentMenu"
    @contextmenu.prevent.stop="contextmenuHandle"
  >
    <!-- 右键菜单 -->
    <contentmenu
      v-if="showContentMenuInCurrent"
      ref="contentmenuRef"
      @create="createHandle"
      @close="close"
    />
    <!-- 文件及文件夹右键菜单 -->
    <fileContentMenu ref="filecontentmenuRef" />
    <!-- 文档列表 -->
    <div class="pages-list">
      <!-- 文件夹面包屑 -->
      <div v-if="pagelistbread.length" class="pages-list-filesbread">
        <el-icon @click="goback"><ArrowLeftBold /></el-icon>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="(item, index) in pagelistbread"
            :key="index"
          >
            {{ item.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 文档列表 -->
      <div class="pages-list-files">
        <div
          @dblclick="gotoEdit(index, item)"
          @contextmenu.prevent.stop="showFileContentMenu"
          class="pages-list-files-item"
          v-for="(item, index) in pagelist.filter(
            (i) =>
              !searchKeyWord ||
              (i.filename || i.foldername).includes(searchKeyWord)
          )"
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
          <template v-if="!item.changeflag">
            <span
              v-if="item.type === 'folder'"
              @dblclick.stop="changefilename(item)"
            >
              {{ item.foldername }}
            </span>
            <span v-else @dblclick.stop="changefilename(item)">
              {{ item.filename + "." + item.suffix }}
            </span>
          </template>
          <el-input
            v-else
            ref="inputRef"
            @blur="confirmChangeFileName"
            @keydown.enter="inputEnterHandle"
            v-model="newfilename"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Contentmenu from "@compo/Contentmenu/index.vue";
import fileContentMenu from "./components/filecontentmenu.vue";
import router from "@/router";
import { getAllFiles_API, updateFile_API } from "@/api/file";
import { inject, nextTick, onMounted, reactive, ref, watch } from "vue";
import store from "@/store";
import { ElMessage } from "element-plus";
import { ArrowLeftBold } from "@element-plus/icons-vue";
// 文档列表
var pagelist = reactive([]);
// 修改文件名输入框Ref
const inputRef = ref(null);
// 输入框绑定的值
let newfilename = ref("");
// 右键菜单 Ref
let contentmenuRef = ref(null);
let filecontentmenuRef = ref(null);

// 定义文件夹的面包屑
let pagelistbread = reactive([]);
let searchKeyWord = ref("");
/** 监听 搜索关键字 */
watch(
  () => store.state.searchKeyWord,
  (e) => (searchKeyWord.value = e),
  { immediate: false, deep: true }
);

// 头部创建文件回调
watch(
  () => store.state.topCreateData,
  (e) => createHandle(e),
  { immediate: false, deep: true }
);

// 文档类型动态颜色
const getFileIconColor = (suffix, type) => {
  if (suffix === "word") return "#0f90e3";
  if (suffix === "xlsx") return "#01a408";
  if (suffix === "pdf") return "#ea5454";
  if (suffix === "txt") return "rgba(0, 0, 0, 0.6)";
  if (suffix === "md") return "#5A96DB";
  if (type === "folder") return "#ffd153";
  return "";
};

// 双击前往编辑页，需要传参
const gotoEdit = (i, item) => {
  if (item.type === "folder") {
    // 处理面包屑
    pagelistbreadHandle(item);

    // 双击进入文件夹查看文件
    return router.replace({
      query: {
        folderid: item.folderid,
        fromPath: router.currentRoute.value.query.folderid,
      },
    });
  }
  // 如果是 excel 则跳转到 excel 页面
  router.push({
    path:
      item.filesuffix === "xlsx"
        ? `/excel/${item.fileid}`
        : `/edit/${item.fileid}`,
    query: item,
  });
};

const pagelistbreadHandle = (item) => {
  // 修改文件夹面包屑
  pagelistbread.push({
    name: item.foldername,
  });
  sessionStorage.setItem("pagelistbread", JSON.stringify(pagelistbread));
};

// 文件面包屑返回按钮
const goback = () => {
  pagelistbread.pop();
  router.replace({
    query: {
      folderid: router.currentRoute.value.query.fromPath,
    },
  });
};

const changefilename = async (item) => {
  pagelist.forEach((i) => (i.changeflag = false));
  item.changeflag = true;
  await nextTick();
  inputRef.value[0].focus();
  // 执行 onblur 事件  confirmChangeFileName
};

// 输入框离开焦点
const confirmChangeFileName = async () => {
  let fileid = "";
  let folderid = "";
  // 两件事，先隐藏输入框，然后发送请求，最后清空 newfilename
  pagelist.forEach((i) => {
    // i.changeflag =true 通过该变量找到修改文件名的文件，还需要将新的文件名赋给该文件
    if (i.changeflag) {
      fileid = i.fileid;
      folderid = i.folderid;
      i.filename = newfilename.value || i.filename; // 如果没有输入内容，则继续使用原来的文件名
      i.changeflag = false;
    }
  });

  // 发送请求修改文件名
  if (newfilename.value) {
    // 根据文件类型执行更新
    let res = fileid
      ? await updateFile_API({ fileid, newfilename: newfilename.value })
      : { code: 0, msg: "暂未实现文件夹更新" };
    if (res.code === 200) ElMessage.success(res.msg);
    else ElMessage.error(res.msg);
  }

  newfilename.value = "";
};
const inputEnterHandle = () => inputRef.value[0].blur();

// 是否显示右键菜单
let showContentMenuInCurrent = ref(false);
// 显示右键菜单
const contextmenuHandle = async (e) => {
  showContentMenuInCurrent.value = true;
  await nextTick();
  contentmenuRef.value.showContentMenu(e);
  filecontentmenuRef.value.hiddenContentMenu();
};

// 官博右键菜单
const close = () => {
  showContentMenuInCurrent.value = false;
};

// 隐藏菜单
const hiddenContentMenu = () => {
  contentmenuRef.value && contentmenuRef.value.hiddenContentMenu();
  filecontentmenuRef.value.hiddenContentMenu();
};

// 显示文件及文件夹右键菜单
const showFileContentMenu = (e) => (
  filecontentmenuRef.value.showContentMenu(e),
  contentmenuRef.value && contentmenuRef.value.hiddenContentMenu()
);

// 创建文件夹回调
const createHandle = ({ name, id, type, suffix }) => {
  if (type === "folder") {
    // 向页面添加文件夹
    return pagelist.push({
      type: "folder",
      foldername: name,
      folderid: id,
      icon: "icon-24gf-folderOpen",
    });
  }
  // iconmap
  let iconmap = {
    md: "icon-file-markdown1",
    txt: "icon-wenben1",
    xlsx: "icon-excel",
  };
  // 添加文件类型
  pagelist.push({
    type,
    fileid: id,
    filename: name,
    suffix,
    icon: iconmap[suffix],
  });
};

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

watch(
  router.currentRoute,
  async (val) => {
    if (val.path != "/home/pages") return;
    pagelist.length = 0;
    let { userid } = JSON.parse(sessionStorage.getItem("user"));
    let { folderid } = val.query;
    if (!folderid) {
      // 清空文件面包屑
      pagelistbread.length = 0;
      sessionStorage.setItem("pagelistbread", []);
    }
    /**
     * 获取路由参数，实现获取指定问价夹的文件信息
     * 如果 folderid不存在，则默认取没有父级的文件夹和文件，
     * 不然则取执行父级的问价夹及文件
     */
    let res = await getAllFiles_API({ userid, folderid });
    console.log("getAllFiles_API", res);
    if (res.code !== 200) return ElMessage.error(res.msg);

    res.data.length &&
      res.data.forEach((i) => {
        getFileTypeAndIcon(i);
        pagelist.push(i);
      });
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  let plb = sessionStorage.getItem("pagelistbread");
  plb && JSON.parse(plb).forEach((i) => pagelistbread.push(i));
});
</script>

<style lang="less" scoped>
.pages {
  position: relative;
  overflow: hidden;
  &-list {
    height: 100%; // 加这个属性是为了右键菜单能够获取 e.target 的位置坐标与 page 一致
    &-filesbread {
      display: flex;
      align-items: center;
      vertical-align: middle;
      .el-icon {
        cursor: pointer;
        margin-right: 10px;
        color: #606266;
      }
    }
    &-files {
      height: 100%;
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
}
</style>
