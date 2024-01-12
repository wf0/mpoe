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
import { getExcelInfo_API } from "@/api/univer";
import router from "@/router";
// 做文件导入
import { exportFile_API } from "@/api/file";
// 文件导出
import { exportExcel } from "@/util/downloadFile";
import { ElMessage } from "element-plus";
import { Luckysheet_port } from "@/default.config.js";
const importFileRef = ref(null);

// 文件导入
const importFileHandle = (e) => {
  console.log("文件导入");
  let formData = new FormData();
  formData.append("file", e.target.files[0]);
  exportFile_API(formData).then(({ data }) => {
    let { info, sheets } = data;
    console.log(info.name);
    // luckysheet.setWorkbookName(info.name.toString());
    sheets.forEach((sheet) => {
      // sheet 便是每一个 sheet 页，需要根据实际的数量动态创建
      luckysheet.setSheetAdd({
        sheetObject: sheet,
        success: () => {
          console.log("success");
        },
      });
    });
    // 清空
    importFileRef.value.value = "";
  });
  // let { files } = e.target;
  // LuckyExcel.transformExcelToLucky(files[0], (exportJson, luckysheetfile) => {
  //   console.log('解析后exportJson',exportJson);
  //   // 【会丢失协同性】
  //   // luckysheet.create({
  //   //   container: "luckysheet", // luckysheet is the container id
  //   //   data: exportJson.sheets,
  //   //   title: exportJson.info.name,
  //   //   userInfo: exportJson.info.name.creator,
  //   // });
  //   let { info, sheets } = exportJson;
  //   luckysheet.setWorkbookName(info.name);
  //   sheets.forEach((sheet) => {
  //     // sheet 便是每一个 sheet 页，需要根据实际的数量动态创建
  //     luckysheet.setSheetAdd({
  //       sheetObject: sheet,
  //       success: () => {
  //         console.log("success");
  //       },
  //     });
  //   });
  //   // 清空
  //   importFileRef.value.value = "";
  // });
};

// 文件导出
const downloadFile = () =>
  exportExcel(luckysheet.getWorkbookName(), luckysheet.getAllSheets());

// 退出系统
const back = () => {
  luckysheet.wsclose();
  router.back();
};

// 辅助函数-D3转 {r:0,c:0}
function getCellRC(pos) {
  let str = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  // pos : D3 =>> ["D","3"]
  let arr = pos.split("");
  let r = 0,
    c = 0;
  arr.forEach((s) => {
    // Number('D') ==> NaN Number('3') ==> 3
    // Boolean(NaN) == false  Boolean(3) == true

    // 解析的是数字 表示的是 r
    if (!!Number(s)) return (r += s);

    // 解析的是非数字（DE12） 非数字表示是 c
    let index = str.findIndex((i) => i === s);
    c === 0 ? (c = index) : (c = 25 + index);
  });

  return { r: Number(r) - 1, c };
}

onMounted(async () => {
  let fileid = router.currentRoute.value.params.fileid;
  // 解析luckysheet的workbook基础信息
  let { code, data } = await getExcelInfo_API({ fileid });
  if (code !== 200 || !data || !data.length)
    return ElMessage.error("文件信息获取失败"), router.back();
  // 初始化表格
  var options = {
    container: "luckysheet", //luckysheet为容器id
    ...data[0],
    allowUpdate: true,
    loadUrl:
      import.meta.env.MODE === "development"
        ? "/baseURL/excel?fileid=" + fileid
        : "/excel?fileid=" + fileid,
    updateUrl: `ws://localhost:${Luckysheet_port}?fileid=${fileid}`, // 实现传参,

    hook: {
      sheetActivate(index) {
        // 将点击的这个事件发送给服务端
        luckysheet.sendMessage({
          t: "shs",
          i: null,
          v: index, // 要切换到的sheet页索引
        });
      },
    },
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
