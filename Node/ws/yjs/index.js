const { logger, unzip } = require("../../util");

exports.yjsHandle = (wss, conn, req) => {
  /**
   * 这里要控制相同文件的用户才广播事件 ,不给自己发送数据
   *  1. 参数 fileid 在req.url 中，
   *  2. 需要给用户添加自定义参数，需要与用户id绑定
   */
  logger.info("yjs 客户端连接");

  conn.onmessage = (event) => {
    wss.clients.forEach((conn) => {
      if (conn.type !== "yjs") return;
      conn.send(event.data);
    });
  };

  conn.on("close", (conn) => {
    logger.warn("yjs 用户关闭连接");
  });
};
