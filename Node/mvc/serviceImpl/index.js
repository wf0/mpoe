// 导出所有的 service 实现类
const userImpl = require("./user");
const fileImpl = require("./file");
const folderImpl = require("./folder");
const versionImpl = require("./version");
module.exports = { userImpl, folderImpl, fileImpl, versionImpl };
