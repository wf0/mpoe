module.exports = () => {
  const { WebSocketServer } = require("ws");

  console.log("Yjs-WS 服务初始化成功，连接地址：ws://localhost:8000");

  // 创建 yjs ws 服务
  const yjsws = new WebSocketServer({ port: 8000 });

  yjsws.on("connection", (conn, req) => {
    /**
     * 这里要控制相同文件的用户才广播事件 ,不给自己发送数据
     *  1. 参数 fileid 在req.url 中，
     *  2. 需要给用户添加自定义参数，需要与用户id绑定
     */
    console.log("yjs 客户端连接");
    conn.onmessage = (event) => {
      yjsws.clients.forEach((conn) => {
        console.log("yjsws", event.data);
        conn.send(event.data);
      });
    };
  });
};
