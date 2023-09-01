// 数据持久层；引入 sql
const { query } = require("../../../mysql");

exports.findFilesMap = async (userid, folderid) =>
  folderid
    ? await query(
        `SELECT * FROM files WHERE OWNER ='${userid}' AND fileownerfolderid='${folderid}'`
      )
    : await query(
        `SELECT * FROM files WHERE OWNER ='${userid}' AND ISNULL(fileownerfolderid)`
      );

exports.createFileMap = async (
  userid,
  fileid,
  filename,
  filetype,
  filesuffix,
  fileownerfolderid
) =>
  fileownerfolderid
    ? await query(
        `INSERT INTO files(fileid,filename,filetype,filesuffix,OWNER,fileownerfolderid) 
         VALUES('${fileid}','${filename}','${filetype}','${filesuffix}','${userid}','${fileownerfolderid}')`
      )
    : await query(
        `INSERT INTO files(fileid,filename,filetype,filesuffix,owner) 
         VALUES('${fileid}','${filename}','${filetype}','${filesuffix}','${userid}')`
      );

exports.findFilesByFilenameMap = async (
  userid,
  filename,
  filetype,
  filesuffix,
  fileownerfolderid
) =>
  fileownerfolderid
    ? await query(
        `SELECT * FROM files WHERE filename='${filename}' AND filetype='${filetype}' AND filesuffix='${filesuffix}' AND owner='${userid}' AND fileownerfolderid="${fileownerfolderid}" `
      )
    : await query(
        `SELECT * FROM files WHERE filename='${filename}' AND filetype='${filetype}' AND filesuffix='${filesuffix}' AND owner='${userid}'`
      );

exports.shearFileMap = async (userid) =>
  await query(`SELECT *  FROM filestates AS fs,files AS fl 
    WHERE fs.state='1' AND fs.editor='${userid}' AND fl.fileid=fs.fileid`);

exports.joinFileMap = async (fsid, userid, fileid) =>
  await query(
    `INSERT INTO filestates(fsid,fileid,editor) VALUES('${fsid}','${fileid}','${userid}')`
  );

exports.findEditorByFileidMap = async (userid, fileid) =>
  await query(
    `SELECT * FROM filestates WHERE fileid='${fileid}' AND editor='${userid}'`
  );

exports.updateFileStateMap = async (data) =>
  data.state
    ? await query(
        `UPDATE filestates SET top='${data.top}',favor='${data.favor}',state='${data.state}' WHERE editor='${data.userid}' AND fileid='${data.fileid}'`
      )
    : await query(
        `UPDATE filestates SET top='${data.top}',favor='${data.favor}' WHERE editor='${data.userid}' AND fileid='${data.fileid}'`
      );

exports.findFilesByFileidMap = async (fileid) =>
  await query(`SELECT * FROM files WHERE fileid='${fileid}'`);

exports.updateFilesMap = async (fileid, vid, newfilename, newfolderid) => {
  if (vid)
    return await query(
      `UPDATE files SET currenthead='${vid}' WHERE fileid='${fileid}'`
    );
  if (newfilename)
    return await query(
      `UPDATE files SET filename='${newfilename}' WHERE fileid='${fileid}'`
    );
  if (newfolderid)
    return await query(
      `UPDATE files SET fileownerfolderid='${newfolderid}' WHERE fileid='${fileid}'`
    );
};

// 只取内容
exports.getFileContentMap = async (fileid) =>
  await query(
    `SELECT versions.content FROM files,versions WHERE files.fileid='${fileid}' AND files.currenthead=versions.vid`
  );
