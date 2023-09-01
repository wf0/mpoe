<template>
  <el-dialog
    @close="cancel"
    v-model="dialogVisible"
    title="邀请加入编辑"
    width="30%"
  >
    <span class="username">{{ username }}</span>
    <el-divider />
    <span>
      邀请你加入 <el-link type="primary">{{ filename }}</el-link>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm"> 加入 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import router from "../../router";
import { joinFile_API } from "@/api/file";

let dialogVisible = ref(true);

let cancel = () => {
  dialogVisible.value = false;
  router.push("/");
};
let fileid = ref("");
let username = ref("");
let filename = ref("");

let confirm = async () => {
  let { userid } = JSON.parse(sessionStorage.getItem("user"));
  // 获取router信息，发请求
  let res = await joinFile_API(userid, fileid.value);
  if (res.code !== 200) return ElMessage.error(res.msg);
  ElMessage.success(res.msg);
  router.push("/");
};

onMounted(() => {
  // 获取参数
  fileid.value = router.currentRoute.value.params.fileid;
  filename.value = router.currentRoute.value.query.filename;
  username.value = router.currentRoute.value.query.username;
  console.log(router);
});
</script>

<style lang="less" scoped>
.username {
  font-weight: 700;
}
</style>
