<template>
  <div class="box">
    <div id="luckysheet"></div>
    <div class="btn">
      <el-button type="info" @click="back()">返回</el-button>
      <el-button @click="importFileRef.click()" type="primary">导入</el-button>
      <el-button @click="downloadFile">下载</el-button>
      <input
        type="file"
        ref="importFileRef"
        @change="importFileHandle"
        style="display: none"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import router from "@/router";
// 做文件导入
import LuckyExcel from "luckyexcel";

// 文件导出
import { exportExcel } from "./downloadFile";
const importFileRef = ref(null);

// 文件导入
const importFileHandle = (e) => {
  let { files } = e.target;
  LuckyExcel.transformExcelToLucky(files[0], (exportJson, luckysheetfile) => {
    // 【会丢失协同性】
    // luckysheet.create({
    //   container: "luckysheet", // luckysheet is the container id
    //   data: exportJson.sheets,
    //   title: exportJson.info.name,
    //   userInfo: exportJson.info.name.creator,
    // });

    let { info, sheets } = exportJson;

    luckysheet.setWorkbookName(info.name);

    sheets.forEach((sheet) => {
      // sheet 便是每一个 sheet 页，需要根据实际的数量动态创建
      luckysheet.setSheetAdd({
        sheetObject: sheet,
      });
    });
    // 清空
    importFileRef.value.value = "";
  });
};

// 文件导出
const downloadFile = () =>
  exportExcel(luckysheet.getWorkbookName(), luckysheet.getAllSheets());

// 退出系统
const back = () => {
  luckysheet.wsclose();
  router.back();
};

onMounted(async () => {
  // 初始化表格
  var options = {
    container: "luckysheet", //luckysheet为容器id
    /**
     * 有个注意点，要想开启共享编辑，必须满足以下3个条件：
     * allowUpdate 为true
     * 配置了 loadUrl
     * 配置了 updateUrl
     */
    allowUpdate: true,
    loadUrl:
      import.meta.env.MODE === "development" ? "/baseURL/excel" : "/excel",
    updateUrl:
      "ws://localhost:9000?fileid=" + router.currentRoute.value.params.fileid, // 实现传参,
    // showinfobar: false,
  };
  luckysheet.create(options);
});
</script>

<style lang="less" scoped>
.box {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
#luckysheet {
  margin: 0px;
  padding: 0px;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
}

.btn {
  position: absolute;
  right: 0;
  top: 10px;
  z-index: 99;
}
/deep/.luckysheet_info_detail_save,
/deep/.luckysheet_info_detail_update,
/deep/.luckysheet_info_detail_back {
  display: none;
}
</style>
