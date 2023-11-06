// lucySheet 操作接口
const router = require("express").Router();

router.post("/", (req, res, next) => {
  //   console.log("lucySheet");
  let sheetData = [
    //status为1的sheet页，重点是需要提供初始化的数据celldata
    {
      name: "Cell",
      index: "sheet_01",
      order: 0,
      status: 1,
      celldata: [
        {
          r: 0,
          c: 0,
          v: { v: "", m: "", ct: { fa: "General", t: "n" } },
        },
      ],
    },
  ];
  res.json(JSON.stringify(sheetData));
});

exports.excelRouter = router;
