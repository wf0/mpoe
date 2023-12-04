module.exports = () => {
  console.log("等待初始化 WS 服务...");
  // 搭建ws服务器
  const { WebSocketServer } = require("ws");

  const wss = new WebSocketServer({ port: 9000 });

  const { unzip } = require("../util/pako");

  const { wshandle, exit } = require("./eventHandle");

  const { dataBaseHandle } = require("./dataBaseHandle");

  console.log(" WS 服务初始化成功，连接地址：ws://localhost:9000");

  wss.on("connection", (ws, req) => {
    let id = Math.random().toString().split(".")[1].slice(0, 3);
    // 解析当前绑定的文件
    let fileid = req.url.toString().split("?")[1].split("?")[0].split("=")[1];
    // 需要添加自定义属性
    ws.wid = id;
    ws.fileid = fileid; // 标记 fileid  还
    ws.wname = "user_" + id;
    console.log("luckysheet 用户连接");
    ws.on("message", (data) => {
      // _this.websocket.send("rub"); 处理 rub 心跳包的数据
      try {
        // 用户每次编辑，都会触发 data 事件，因此，在这里实现协同数据存储
        dataBaseHandle(unzip(data));
        // wss.clients 所有的客户端
        wss.clients.forEach((conn) => {
          if (conn.fileid !== ws.fileid) return; // 如果与我当前操作文件不一致，则不发送消息给你
          if (conn.wid === ws.wid) return;
          // 使得 this 指向当前连接对象 ,并且保证，操作对象始终是当前用户
          wshandle.call(conn, { id: ws.wid, name: ws.wname }, unzip(data));
        });
      } catch (error) {
        console.log(error);
      }
    });

    ws.on("close", () => {
      try {
        console.log("luckysheet 协同用户关闭连接");

        // 实现用户退出
        wss.clients.forEach((conn) => {
          if (conn.wid === ws.wid) return;
          // 使得 this 指向当前连接对象(这里也是需要统一操作对象)
          exit.call(conn, ws.wid);
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
};
