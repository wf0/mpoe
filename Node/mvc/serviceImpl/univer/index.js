const { univerMap } = require("../../mapper");

exports.createWorkBookImpl = async (gridKey, fileid) =>
  await univerMap.createWorkBookMap(gridKey, fileid);

exports.getWorkBookImpl = async (fileid) =>
  await univerMap.getWorkBookMap(fileid);

exports.getSheetDataByGridKeyImpl = async (gridKey) =>
  await univerMap.getSheetDataByGridKeyMap(gridKey);

// 如果没有记录，则创建记录并保存
exports.createWorkSheetImpl = async (data) =>
  await univerMap.createWorkSheetMap(data);

exports.getCellDataByIndexImpl = async (index) =>
  await univerMap.getCellDataByIndexImpl(index);

/** 以下方法是协同数据存储 */
exports.findCellDataByRCImpl = async (data) =>
  await univerMap.findCellDataByRCMap(data);

exports.updateCellDataImpl = async (data) =>
  await univerMap.updateCellDataMap(data);

exports.insertCellDataImpl = async (data, cdid) =>
  await univerMap.insertCellDataMap(data, cdid);
