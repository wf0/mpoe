// 初始化 socket 服务器
const socketIO = require("socket.io");

module.exports = (http) => {
  const io = socketIO(http, {
    allowEIO3: true,
    cors: {
      origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  console.log("Socket Server is running...");

  let userlist = []; // 闭包环境可提供变量

  io.on("connection", (socket) => {
    console.log("用户连接...");

    socket.on("init", ({ user, fileid }) => {
      // 加入群聊
      console.log("用户加入房间", fileid);
      socket.join(fileid);
      let find = userlist.find((i) => i.userid === user.userid);
      if (!find) userlist.push({ ...user, socketid: socket.id });
      io.to(fileid).emit("join", userlist);
    });

    socket.on("send", ({ fileid, content }) => {
      console.log("用户触发 send 事件");
      io.to(fileid).emit("message", content);
    });
  });

  io.on("disconnect", (socket) => {
    console.log("a user disconnect");
    let index = userlist.findIndex((i) => i.socketid === socket.id);
    userlist.splice(index, 1);
    io.to(fileid).emit("join", userlist);
  });
};
