const { versionMap } = require("../../mapper");
// 创建版本
exports.createVersionImpl = async (userid, fileid, content, vid) =>
  await versionMap.createVersionMap(userid, fileid, content, vid);

// 查找版本信息
exports.findVersionImpl = async (vid) => await versionMap.findVersionMap(vid);

// g更新版本内容
exports.updateVersionImpl = async (vid, content, fileid) =>
  await versionMap.updateVersionMap(vid, content, fileid);
