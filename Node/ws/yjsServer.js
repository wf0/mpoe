const { yjs_port } = require("../base.config");
const { logger } = require("../util");
module.exports = () => {
  const { WebSocketServer } = require("ws");

  // 创建 yjs ws 服务
  const yjsws = new WebSocketServer({ port: yjs_port });

  logger.success(`Yjs-WS 服务初始化成功，连接地址：ws://localhost:${yjs_port}`);

  yjsws.on("connection", (conn, req) => {
    /**
     * 这里要控制相同文件的用户才广播事件 ,不给自己发送数据
     *  1. 参数 fileid 在req.url 中，
     *  2. 需要给用户添加自定义参数，需要与用户id绑定
     */
    logger.info("yjs 客户端连接");
    conn.onmessage = (event) => {
      yjsws.clients.forEach((conn) => {
        conn.send(event.data);
      });
    };

    conn.on("close", (conn) => {
      logger.warn("yjs 用户关闭连接");
    });
  });
};
