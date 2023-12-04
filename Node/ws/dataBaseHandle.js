// 协同数据存储
const { univerImpl } = require("../mvc/serviceImpl");
const { getNanoid } = require("../util/nanoid");

/**
 * 解析 t 操作类型：
 * v 单个单元格刷新
 * rv 范围单元格刷新
 * cg config操作
 * all 通用保存
 * fc 函数链操作
 * drc 删除行或列
 * sha 新建sheet
 * shc 复制sheet
 * shd 删除sheet
 * na 修改工作簿名称
 * ... 更多操作请参考： [https://dream-num.github.io/LuckysheetDocs/zh/guide/operate.html#%E5%8D%95%E5%85%83%E6%A0%BC%E5%88%B7%E6%96%B0]
 */
let that = null;

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

exports.dataBaseHandle = (opts) => (
  (that = JSON.parse(opts)), _vmap[that.t] && _vmap[that.t]()
);

async function v() {
  // 获取cdid
  let cdid = await getNanoid();
  // 1. 先获取行列信息 当前sheet的index值
  let findRes = await univerImpl.findCellDataByRCImpl(this);
  // 2. 判断当前行是否已经有数据
  findRes.length
    ? await univerImpl.updateCellDataImpl(this)
    : // 3. 有则更新、没有则新增
      await univerImpl.insertCellDataImpl(this, cdid);
}
async function rv() {}
async function cg() {}
async function all() {}
async function fc() {}
async function drc() {}
async function sha() {}
async function shc() {}
async function shd() {}
async function na() {}
