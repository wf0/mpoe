<template>
  <div class="editbox">
    <div class="editbox-left">
      <topVue @open="open" :socketuserlist="socketuserlist" :unread="unread" />
      <editVue />
    </div>
    <div class="editbox-right" v-show="messageDialog">
      <div class="editbox-right-top">文档交流区</div>
      <div class="editbox-right-main">
        <el-scrollbar height="100%">
          <div
            v-for="item in message"
            :key="item.userid"
            class="item"
            :class="item.userid === myinfo.userid ? 'my' : ''"
          >
            <div class="userimg_svg" v-html="item.userimg"></div>

            <div class="item-info">
              <div class="item-info-username">{{ item.username }}</div>
              <div class="item-info-content">
                {{ item.content }}
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="editbox-right-footer">
        <el-input v-model="input" @keydown.enter="send" />
      </div>
    </div>
    <!-- 消息中心抽屉 -->
  </div>
</template>

<script setup>
import topVue from "./components/top.vue";
import editVue from "@compo/Edit/index.vue";
import router from "@/router";
import {
  inject,
  onMounted,
  reactive,
  ref,
  getCurrentInstance,
  onBeforeMount,
} from "vue";
import { registerSockets, destroySockets } from "@/sockets/index.js";
import dayjs from "dayjs";
let messageDialog = ref(false);
let open = () => (
  (messageDialog.value = !messageDialog.value), (unread.value = 0)
);
let myinfo = JSON.parse(sessionStorage.getItem("user"));
let input = ref("");

/**
 * 初始化 socket 服务
 */
let socket = inject("socket");
let { proxy } = getCurrentInstance();
var socketuserlist = reactive([]);
// 定义数据类型(聊天窗口)
let message = reactive([]);
// 定义消息未读
let unread = ref(0);

let fileid = ref("");

let sockets = {
  // 用户加入编辑：处理用户列表
  join: (userlist) => {
    socketuserlist.splice(0);
    userlist.forEach((i) => socketuserlist.push(i));
  },

  message: (content) => {
    // 用户发送消息： 同步数据
    // console.log("# message #", content);
    message.push(content);
    // 还要处理未读消息
    if (!messageDialog.value) unread.value++;
    else unread.value = 0;

    // console.log(unread.value);
  },
};

// 发送消息
let send = () => {
  let { userimg, userid, username } = JSON.parse(
    sessionStorage.getItem("user")
  );
  let content = {
    userimg,
    userid,
    username,
    time: dayjs().unix(),
    content: input.value,
  };
  socket.io.emit("send", { fileid: fileid.value, content });
  input.value = "";
};

// 初始化 socket 服务
const initSocketServer = (fileid, user) => {
  socket.io.connect();
  socket.io.emit("init", { user, fileid });
};

onMounted(() => {
  fileid.value = window.location.hash.split("edit/")[1]; // 当前文件的fileid
  let user = JSON.parse(sessionStorage.getItem("user"));
  // 获取 proxy sockets
  initSocketServer(fileid.value, user);

  registerSockets(sockets, proxy, socket);
});

onBeforeMount(() => {
  destroySockets(sockets, proxy, socket);
});
</script>

<style lang="less" scoped>
.editbox {
  position: relative;
  height: 100%;
  display: flex;
  &-left {
    flex: auto;
  }
  &-right {
    z-index: 99;
    background-color: #fafbfc;
    height: calc(100% - 50px);
    position: absolute;
    right: 0;
    bottom: 0;
    margin-left: 5px;
    width: 300px;
    border: solid #cccccc 1px;
    animation: all 1 linear;
    display: flex;
    flex-direction: column;
    &-top {
      height: 36px;
      background-color: #d3dce6;
      display: flex;
      align-items: center;
      font-weight: 700;
    }
    &-main {
      padding: 5px 10px;
      flex: auto;
    }
    &-footer {
      border-radius: 5px;
      border-top: solid #d3dce6 1px;
      height: 36px;
    }
  }
  .edit {
    height: calc(100% - 50px);
  }
}

.item {
  margin: 5px 0;
  display: flex;
  &-info {
    &-content {
      border-radius: 5px;
      background-color: #faebd7;
      padding: 5px;
      // width: 250px;
      word-wrap: break-word;
    }
  }
}
.my {
  flex-direction: row-reverse;
  .item-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    &-content {
      background-color: #b2ebf2;
    }
  }
}
/deep/ .el-input {
  border: transparent solid 1px !important;
}
/deep/ .el-input__wrapper {
  border: transparent solid 1px !important;
  box-shadow: none;
}
</style>
