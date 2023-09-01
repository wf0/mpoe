// 初始化 socket 服务器
module.exports = (io) => {
  console.log("Socket Server is running...");
  let userlist = [];
  // 闭包环境可提供变量
  io.on("connection", (socket) => {
    console.log("用户连接...");
    console.log();

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
