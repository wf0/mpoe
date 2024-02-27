// 文件夹相关控制层
const { httpCode, getNanoid } = require("../../../util");
const { fileImpl } = require("../../serviceImpl");
const dayjs = require("dayjs");
const path = require("path");
// 创建文件
exports.createFile = async (req, res, next) => {
  /**
   * - fileid 文件id（系统自动生成） - nanoid生成
    - filename 文件名
    - filetype 文件类型 【txt、word、excel、pdf、markdown】
    - filesuffix 文件后缀
    - owner 拥有者
    - fileownerfolderid 文件所属文件夹id
   */
  let { userid, filename, filetype, filesuffix, fileownerfolderid } = req.body;
  if (!userid || !filename || !filetype || !filesuffix) return httpCode(res);
  let findRes = await findFilesByFilename(
    userid,
    filename,
    filetype,
    filesuffix,
    fileownerfolderid
  );
  if (findRes) return httpCode(res, 4002); // 禁止创建同名文件

  let fileid = await getNanoid();
  let mapRes = await fileImpl.createFileImpl(
    userid,
    fileid,
    filename,
    filetype,
    filesuffix,
    fileownerfolderid
  );
  if (!mapRes.affectedRows) return httpCode(res, 4001); // w文件创建失败
  if (filetype !== "excel") return httpCode(res, 200, "文件创建成功", fileid);
  req.body.fileid = fileid;
  next(); // next 是需要添加 excel 的 workbook
};

// 更新文件信息
exports.updateFiles = async (req, res, next) => {
  /**
   * 更新文件信息：文件名、文件所属文件夹id、当前版本号
   */
  let { fileid, newfilename, newfolderid } = req.body;
  if (req.version) {
    var { vid, vfileid } = req.version;
  }
  let updateRes = await fileImpl.updateFilesImpl(
    vfileid || fileid,
    vid,
    newfilename,
    newfolderid
  );
  if (updateRes && updateRes.affectedRows)
    return httpCode(res, 200, "文件更新成功");
};

// 放入回收站
exports.putFileToRecycle = async (req, res, next) => {
  let { fileid, userid } = req.body;
  if (!fileid || !userid) return httpCode(res); // 参数缺失
  if (!(await isOwnerFile(fileid, userid))) return httpCode(res, 7001); // 无权限删除
  // 执行更新操作
  let stateRes = await fileImpl.updateFilesImpl(fileid, null, null, null, 2); // 设置 files 基础信息表 state 为 2
  if (stateRes.affectedRows === 1) return httpCode(res, 200, "已放入回收站");
  httpCode(res, 7002);
};

// 删除文件
exports.deleteFile = async (req, res, next) => {
  /**
   * 1. 先确认文件所属是否本人，不允许删除非本人的文件
   * 2. 先删除 versions
   * 3. 再删除 filestate
   * 4. 最后删除基础表 files
   */
  let { fileid, userid } = req.body;
  if (!fileid || !userid) return httpCode(req); // 参数缺失
  if (!isOwnerFile(fileid, userid)) return httpCode(res, 7001); // 无权限删除
};

// 导出查找文件
exports.findFiles = async (req, res, next) => {
  /**
   * 判断是否存在 folderid
   * 如果 folderid 不存在，则表示查找一级文件，指的是 fileownerfolderid ='' 的文件
   * 不然就是查找 fileownerfolderid = folderid 的文件
   * 将结果放在 body 上，往后还需要找文件夹使用一起返回
   */
  let { userid, folderid, state } = req.body;
  if (!userid) return httpCode(res); // 参数缺失
  let result = [];

  //   处理查找文件逻辑
  let mapRes = await fileImpl.findFilesImpl(userid, folderid, state);
  let _res = JSON.parse(JSON.stringify(mapRes));
  _res.forEach((i) => delete i.index);
  result = _res.map((i) => i);
  // 将参数传递到下一个路由
  req.body.result = result;
  req.body.state = state;
  next();
};

// 根据指定ID查找文件
exports.findFileById = async (req, res, next) => {
  let { userid, fileid } = req.body;
  if (!userid || !fileid) return httpCode(res); // 参数缺失
  let result = {};
  // 查找文件
  let fileRes = await fileImpl.findFileByIdImpl(userid, fileid);
  let _res = JSON.parse(JSON.stringify(fileRes));
  _res.forEach((i) => delete i.index);
  result = _res.map((i) => i)[0];
  // 返回数据
  return httpCode(res, 200, "文件查找成功", result);
};

// 上传文件
exports.uploadFile = async (req, res, next) => {
  if (req.files === null)
    return res.status(400).json({ code: 400, msg: "no file uploaded" });
  // 不然转存数据
  let { file } = req.files;
  let newfilename = file.md5 + "." + file.name.split(".")[1];
  let newpath = path.join(process.cwd(), "/public/images/") + newfilename;
  // 移动文件到第一参数指定位置 若有错误 返回500
  file.mv(newpath, (err) => {
    if (err) return res.status(500).json({ msg: "文件上传失败" });
    return httpCode(res, 200, "文件上传成功", `/static/${newfilename}`);
  });
};

// 与我共享
exports.shearFile = async (req, res, next) => {
  /**
   * filestates 表中 editor=userid and state=1  1：正常、2：回收站、3：作废
   * 需要联合查询，拿到文件的基本信息
   */
  let { userid } = req.body;
  if (!userid) return httpCode(res); // 参数缺失
  let mapRes = await fileImpl.shearFileImpl(userid);
  // 进行参数缺省
  let dataArr = JSON.parse(JSON.stringify(mapRes));
  dataArr.forEach((i) => {
    delete i.fsid;
    delete i.index;
    i.createtime = dayjs(i.createtime).format("YYYY-MM-DD");
    // delete i.createtime;
    delete i.currenthead;
    delete i.state;
    delete i.fileownerfolderid;
  });
  return httpCode(res, 200, "查找成功", dataArr);
};

// 加入文件
exports.joinFile = async (req, res, next) => {
  let { userid, fileid } = req.body;
  if (!userid || !fileid) return httpCode(res); // 参数缺失

  // 先看看是否已经存在
  let findRes = await findEditorByFileid(userid, fileid);
  if (findRes) return httpCode(res, 5002);

  // 需要 fsid
  let fsid = await getNanoid();
  let mapRes = await fileImpl.joinFileImpl(fsid, userid, fileid);
  if (mapRes.affectedRows) return httpCode(res, 200, "加入成功");
  return httpCode(res, 5001);
};

// 更新文件状态
exports.updateFileState = async (req, res, next) => {
  let { userid, fileid, top, favor, state } = req.body;
  if (!userid || !fileid) return httpCode(res); // 参数缺失
  /**
   * state 非必须 为删除时的操作
   */
  let data = { userid, fileid, top, favor, state };
  let mapRes = await fileImpl.updateFileStateImpl(data);
  if (mapRes.affectedRows) return httpCode(res, 200, "更新成功");
};

// 通过 fileid 查找文件表基础信息
exports.findFilesByFileid = async (req, res, next) => {};

// 获取文件内容
exports.getFileContent = async (req, res, next) => {
  let { fileid } = req.body;
  if (!fileid) return httpCode(res); // 参数缺失

  let findRes = await fileImpl.getFileContentImpl(fileid);
  if (findRes[0]?.content)
    return httpCode(res, 200, "查找成功", findRes[0].content);
  return httpCode(res, 6003);
};

// 辅助函数
const findFilesByFilename = async (
  userid,
  filename,
  filetype,
  filesuffix,
  fileownerfolderid
) => {
  let mapRes = await fileImpl.findFilesByFilenameImpl(
    userid,
    filename,
    filetype,
    filesuffix,
    fileownerfolderid
  );
  if (!mapRes.length) return null;
  // 不然删除index folderid
  let res = JSON.parse(JSON.stringify(mapRes[0]));
  delete res.index;
  return res;
};

// 辅助函数
const findEditorByFileid = async (userid, fileid) => {
  let mapRes = await fileImpl.findEditorByFileidImpl(userid, fileid);
  if (!mapRes.length) return null;
  return mapRes[0];
};
const isOwnerFile = async (fileid, userid) => {
  let findRes = await fileImpl.findFilesByFileidImpl(fileid);
  return findRes[0].owner == userid;
};
