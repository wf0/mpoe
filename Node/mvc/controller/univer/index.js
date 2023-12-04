/**
 * 规划 luckysheet  的数据存储方案
 *  1. 使用协同存储
 *
 *   workbook 表：
 * {
 *     "title": "Demo", //工作簿名称
 *     "lang": "ch", //语言
 *     "gridKey": "z123jjsahdj", //唯一key
 *     "data": "[]", //工作表配置 => 指向 worksheet 表
 *     "plugins": "[]", //插件
 *     "column": 60, //空表格默认的列数量
 *     "row": 84, //空表格默认的行数据量
 * }
 *
 *
 * worksheet 表：
 * {
 *     "worksheetID": "z123jjsahdj", // 表主键
 *     "gridKey": "z123jjsahdj", // 关联 workbook 表【外键】
 *     "name": "Cell", //工作表名称
 *     "index": 0, //工作表索引
 *     "status": 1, //激活状态
 *     "order": 0, //工作表的下标
 *     "hide": 0,//是否隐藏
 *     "row": 36, //行数
 *     "column": 18, //列数
 *     "defaultRowHeight": 19, //自定义行高
 *     "defaultColWidth": 73, //自定义列宽
 *     "celldata": [], //初始化使用的单元格数据  => 指向 celldata 表
 *     "config": {
 *         "merge":{}, //合并单元格
 *         "rowlen":{}, //表格行高
 *         "columnlen":{}, //表格列宽
 *         "rowhidden":{}, //隐藏行
 *         "colhidden":{}, //隐藏列
 *         "borderInfo":{}, //边框
 *         "authority":{}, //工作表保护
 *     },
 *     "scrollLeft": 0, //左右滚动条位置
 *     "scrollTop": 315, //上下滚动条位置
 *     "luckysheet_select_save": [], //选中的区域
 *     "calcChain": [],//公式链
 *     "isPivotTable":false,//是否数据透视表
 *     "pivotTable":{},//数据透视表设置
 *     "filter_select": {},//筛选范围
 *     "filter": null,//筛选配置
 *     "luckysheet_alternateformat_save": [], //交替颜色
 *     "luckysheet_alternateformat_save_modelCustom": [], //自定义交替颜色
 *     "luckysheet_conditionformat_save": {},//条件格式
 *     "frozen": {}, //冻结行列配置
 *     "chart": [], //图表配置
 *     "zoomRatio":1, // 缩放比例
 *     "image":[], //图片
 *     "showGridLines": 1, //是否显示网格线
 *     "dataVerification":{} //数据验证配置
 * }
 *
 *
 * celldata 表：
 * {
 *     "worksheetID": "z123jjsahdj", // 表外键
 *     "ct": { //单元格值格式
 *         "fa": "General",  //格式名称为自动格式
 *         "t": "n" //格式类型为数字类型
 *     },
 *     "v": 233, //内容的原始值为 233
 *     "m": 233, //内容的显示值为 233
 *     "bg": "#f6b26b", //背景为 "#f6b26b"
 *     "ff": 1, // 字体为 "Arial"
 *     "fc": "#990000", //字体颜色为 "#990000"
 *     "bl": 1, //字体加粗
 *     "it": 1, //字体斜体
 *     "fs": 9, //字体大小为 9px
 *     "cl": 1, //启用删除线
 *     "ht": 0, //水平居中
 *     "vt": 0, //垂直居中
 *     "tr": 2, //文字旋转 -45°
 *     "tb": 2, //文本自动换行
 *     "ps": { //批注
 *         "left": 92, //批注框左边距
 *         "top": 10, //批注框上边距
 *         "width": 91, //批注框宽度
 *         "height": 48, //批注框高度
 *         "value": "I am a comment", //批准内容
 *         "isshow": true //批注框为显示状态
 *     },
 *     "f": "=SUM(233)" //单元格是一个求和公式
 * }
 *
 * ### 实现的逻辑  fileid => worksheets(gridKey) =>   worksheets(gridKey/worksheetID) =>  celldatas(worksheetID)
 */

const { httpCode, getNanoid } = require("../../../util");
const { univerImpl } = require("../../serviceImpl");

/** 关键函数： fileid 获取初始化 luckysheet方法 */
exports.initLuckysheet = async (req, res, next) => {
  let { fileid } = req.query;

  if (!fileid) return httpCode(res);

  /**
   * 根据id查找数据库，组装数据返回
   * 刚建的文件，有可能没有，因此需要默认返回数据，并且将这么默认数据作为一条记录
   */

  // 1. 通过 fileid 查询 gridKey
  let bookInfo = await univerImpl.getWorkBookImpl(fileid);
  if (!bookInfo.length) return httpCode(res);
  let { gridKey } = bookInfo[0];

  // 2. 通过 gidKey 查询 sheet 数据 这里有可能有空值
  let sheetInfo = await univerImpl.getSheetDataByGridKeyImpl(gridKey);
  if (!sheetInfo.length) {
    // 如果没有，则创建，并返回空表格 【注意：此处只返回一个 sheet 页，不然浪费空间】
    // 创建记录供用户保存
    let index = await getNanoid();
    await univerImpl.createWorkSheetImpl({
      gridKey,
      name: "sheet 1",
      index, // 工作表索引 【唯一ID】
      status: 0, // 激活状态
      order: 0, // 工作表的下标
    });

    return res.json(JSON.stringify([{ name: "sheet 1", celldata: [] }]));
  }

  // 3. 通过 index 查询 celldata 数据
  let { index } = sheetInfo[0];
  let cellInfo = await univerImpl.getCellDataByIndexImpl(index);
  /** 数据可能是空，也可能是多个，但是注意  ctfa 、ctt 是需要构建成对象返回的，数据库做了扁平化存储 */
  if (!cellInfo || !cellInfo.length)
    return res.json(JSON.stringify([{ ...sheetInfo[0], celldata: [] }]));

  // 4. 组装数据
  let celldata = [];

  // 注意luckysheet 需要的数据格式
  cellInfo.forEach((i) =>
    celldata.push({ r: i.r, c: i.c, v: { ...i, ct: { fa: i.ctfa, t: i.ctt } } })
  );

  // 5. 返回数据
  return res.json(JSON.stringify([{ ...sheetInfo[0], celldata }]));
};

// ### WorkBook
// 创建表格  用户 创建 excel 时（createFile），需要同步 title、gridKey、column、row
exports.createWorkBook = async (req, res, next) => {
  // 这里先获取 fileid
  let { fileid } = req.body;
  if (!fileid) return httpCode(res); // 参数缺失
  //   创建 gridkey
  let gridKey = await getNanoid();
  let createRes = await univerImpl.createWorkBookImpl(gridKey, fileid);
  if (!createRes.affectedRows) return httpCode(res, 4001); // w文件创建失败
  return httpCode(res, 200, "文件创建成功", fileid);
};

// 获取基础信息 通过 fileid 获取 title、gridKey、column、row、lang
exports.getWorkBook = async (req, res, next) => {
  // 关联查询
  let { fileid } = req.body;
  if (!fileid) return httpCode(res); // 参数缺失
  let findRes = await univerImpl.getWorkBookImpl(fileid);
  return httpCode(res, 200, "获取Excel基础信息", findRes);
};

// 更新
exports.updateWorkBook = async (req, res, next) => {};

// ##### worksheet

// 创建
exports.createWorkSheet = async (req, res, next) => {};

// 获取
exports.getWorkSheet = async (req, res, next) => {};

// 更新
exports.updateWorkSheet = async (req, res, next) => {};

// 删除
exports.deleteWorkSheet = async (req, res, next) => {};

// ##### celldata

// 创建
exports.createCellData = async (req, res, next) => {};

// 获取
exports.getCellData = async (req, res, next) => {};

// 更新
exports.updateCellData = async (req, res, next) => {};

// 删除
exports.deleteCellData = async (req, res, next) => {};
