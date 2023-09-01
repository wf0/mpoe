// 数据持久层；引入 sql
const { query } = require("../../../mysql");

exports.createVersionMap = async (userid, fileid, content, vid) =>
  await query(
    `INSERT INTO versions(vid,fileid,content,lasteditor)VALUES('${vid}','${fileid}','${content}','${userid}')`
  );

exports.findVersionMap = async (vid) =>
  await query(`SELECT * FROM versions WHERE vid='${vid}'`);

exports.updateVersionMap = async (vid, content, fileid) =>
  await query(
    `UPDATE versions SET content='${content}' WHERE fileid='${fileid}' AND vid='${vid}'`
  );
