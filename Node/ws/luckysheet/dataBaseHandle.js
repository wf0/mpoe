// 协同数据存储
const { univerImpl, fileImpl } = require("../../mvc/serviceImpl");
const { getNanoid } = require("../../util/nanoid");

/**
 * ... 更多操作请参考： [https://dream-num.github.io/LuckysheetDocs/zh/guide/operate.html#%E5%8D%95%E5%85%83%E6%A0%BC%E5%88%B7%E6%96%B0]
 */
let that = null;

let wsfileid = "";

// 定义操作映射
let _vmap = {
  v: () => v.call(that),
  rv: () => rv.call(that),
  cg: () => cg.call(that),
  all: () => all.call(that),
  fc: () => fc.call(that),
  drc: () => drc.call(that),
  sha: () => sha.call(that),
  shc: () => shc.call(that),
  shd: () => shd.call(that),
  na: () => na.call(that),
};

exports.dataBaseHandle = (opts, fileid) => (
  (that = JSON.parse(opts)),
  (wsfileid = fileid),
  _vmap[that.t] && _vmap[that.t]()
);

// * v 单个单元格刷新
async function v() {
  console.log("v", this);
  // 获取cdid
  let cdid = await getNanoid();
  // 1. 先获取行列信息 当前sheet的index值
  let findRes = await univerImpl.findCellDataByRCImpl(this);

  // 2. 需要识别当前操作是否为删除单元格内容
  let { v, m, f } = this.v;
  if (!v && !m && !f) return univerImpl.deleteCellDataImpl(this);

  // 2. 判断当前行是否已经有数据
  findRes.length
    ? await univerImpl.updateCellDataImpl(this)
    : // 3. 有则更新、没有则新增
      await univerImpl.insertCellDataImpl(this, cdid);
}

// * rv 范围单元格刷新
async function rv() {
  console.log("rv", this);
}

// * cg config操作
async function cg() {
  console.log("cg", this);
}

// * all 通用保存
async function all() {
  console.log("all", this);
}

// * fc 函数链操作
async function fc() {
  console.log("fc", this);
}

// * drc 删除行或列
async function drc() {
  console.log("drc", this);
}

// * sha 新建sheet
async function sha() {
  console.log("sha", this);
}

// * shc 复制sheet
async function shc() {
  console.log("shc", this);
}

// * shd 删除sheet
async function shd() {
  console.log("shd", this);
}

// * na 修改工作簿名称(其实就是 files 表的filename)
async function na() {
  // 通过 wsfileid 修改 filename 即可 fileid, vid, newfilename, newfolderid, state
  await fileImpl.updateFilesImpl(wsfileid, null, this.v, null, null);
}
