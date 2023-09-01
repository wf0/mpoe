// 导出所有的控制层
const userCtrl = require("./user");
const fileCtrl = require("./file");
const folderCtrl = require("./folder");
const versionCtrl = require("./version");

module.exports = {
  userCtrl,
  folderCtrl,
  fileCtrl,
  versionCtrl,
};
