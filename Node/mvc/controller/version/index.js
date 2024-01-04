const { httpCode, getNanoid, logger } = require("../../../util");
// 引入文件 impl
const { fileImpl, versionImpl } = require("../../serviceImpl");

const dayjs = require("dayjs");
// 创建版本
exports.createVersion = async (req, res, next) => {
  let { userid, fileid, content } = req.body;
  if (!userid || !fileid || !content) return httpCode(res); // 参数缺失

  let vid = await getNanoid();

  //  mysql version(vid fileid content lasteditor)
  // 进入创建过程（先判断是否需要创建:指的是 files 表中 currenthead 字段是否有值）
  let findRes = await fileImpl.findFilesByFileidImpl(fileid);

  if (findRes[0].currenthead) {
    /**
     *  1. 已经存在版本，则需要判断版本的创建时间与当前时间比较，是否超过版本控制时限
     *    超过：则创建新版本，同时，更新files 指向
     *    未超过：则只需要更新版本内容即可
     */
    let overtime = 60 * 60 * 10; // 定义超时时间 10分钟
    // let overtime = 60; // 测试模拟超过情况

    // 查找版本信息
    let versionRes = await versionImpl.findVersionImpl(findRes[0].currenthead);
    // 判断时间是否超过时限
    let difftime = dayjs().unix() - dayjs(versionRes[0].createtime).unix(); // 差值是秒
    if (difftime > overtime) {
      // 如果超过了这个时长，则需要创建新的版本了，不然就执行更新就行了
      logger.warn("超过时长，创建新版本");
      let createRes = await versionImpl.createVersionImpl(
        userid,
        fileid,
        content,
        vid
      );
      // 需要拿到刚才创建的 vid 传给下一个 中间件
      if (!createRes.affectedRows) return httpCode(res, 6001);
      req.version = { vid, vfileid: fileid }; // 娶个别名，不然下一个中间件命名冲突
      return next(); // 进入更新文件信息
    }
    // 更新版本内容
    logger.info("未超过时长，更新版本内容");
    let updateRes = await versionImpl.updateVersionImpl(
      findRes[0].currenthead,
      content,
      fileid
    );

    if (updateRes.affectedRows) return httpCode(res, 200, "已更新文件内容");

    return httpCode(res, 6002); // 版本更新失败
  }

  // 不然就是文件还没有版本跟踪，则需要创建第一个版本
  let createRes = await versionImpl.createVersionImpl(
    userid,
    fileid,
    content,
    vid
  );
  // 需要拿到刚才创建的 vid 传给下一个 中间件
  if (!createRes.affectedRows) return httpCode(res, 6001);
  req.version = { vid, vfileid: fileid }; // 娶个别名，不然下一个中间件命名冲突
  next(); // 进入更新文件信息
};
