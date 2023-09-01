// 引入mapper数据持久层类
const { fileMap } = require("../../mapper");

exports.findFilesImpl = async (userid, folderid) =>
  await fileMap.findFilesMap(userid, folderid);

exports.createFileImpl = async (
  userid,
  fileid,
  filename,
  filetype,
  filesuffix,
  fileownerfolderid
) =>
  await fileMap.createFileMap(
    userid,
    fileid,
    filename,
    filetype,
    filesuffix,
    fileownerfolderid
  );

exports.findFilesByFilenameImpl = async (
  userid,
  filename,
  filetype,
  filesuffix,
  fileownerfolderid
) =>
  await fileMap.findFilesByFilenameMap(
    userid,
    filename,
    filetype,
    filesuffix,
    fileownerfolderid
  );

exports.shearFileImpl = async (userid) => await fileMap.shearFileMap(userid);

exports.joinFileImpl = async (fsid, userid, fileid) =>
  await fileMap.joinFileMap(fsid, userid, fileid);

exports.findEditorByFileidImpl = async (userid, fileid) =>
  await fileMap.findEditorByFileidMap(userid, fileid);

exports.updateFileStateImpl = async (data) =>
  await fileMap.updateFileStateMap(data);

exports.findFilesByFileidImpl = async (fileid) =>
  await fileMap.findFilesByFileidMap(fileid);

// 更新信息
exports.updateFilesImpl = async (fileid, vid, newfilename, newfolderid) =>
  await fileMap.updateFilesMap(fileid, vid, newfilename, newfolderid);

exports.getFileContentImpl = async (fileid) =>
  await fileMap.getFileContentMap(fileid);
