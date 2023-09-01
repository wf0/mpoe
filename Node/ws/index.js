module.exports = () => {
  console.log("等待初始化 WS 服务...");
  // 搭建ws服务器
  const { WebSocketServer } = require("ws");
  const wss = new WebSocketServer({
    port: 9000,
  });

  console.log(" WS 服务初始化成功，连接地址：ws://localhost:9000");

  wss.on("connection", (ws, req) => {
    console.log("Yjs 客户端连接 ws 服务");
    // ws.send("我是服务端"); // 向当前客户端发送消息
  });
};
