<template>
  <div>
    <p v-for="(item, index) in pageList" :key="index">{{ item.filename }}.{{ item.filesuffix }}</p>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { getAllFiles_API } from "@/api/file";
let { userid } = JSON.parse(sessionStorage.getItem("user"));
let pageList = reactive([]);
onMounted(async () => {
  // 请求 state =2 的文件
  let { code, msg, data } = await getAllFiles_API({ userid, state: 2 });
  pageList.length = 0;
  data.forEach((i) => pageList.push(i));
});
</script>

<style lang="less" scoped></style>
