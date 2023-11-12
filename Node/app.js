// node 采用模块化，接口形式为 SSM 三层结构，controller + serviceImpl + xmlMapper
console.log(" ### 开始初始化 node 方法 ###  ");

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  allowEIO3: true,
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 初始化 express 中间件 express.urlencoded、express.json
require("./meddlewear").initExpressMeddleWear(app, express);

// 初始化数据库
require("./mysql").initSQL();

// 初始化 socket服务
require("./socket")(io);

// 初始化 WS 服务
require("./ws")();
require("./ws/yjsServer")();

// 引入路由模块注册函数，实现 router/index.js 导入注册，不需在 index.js 中写过多路由函数
require("./router")(app);

// 初始化 http 监听端口
require("./base.config").initServeListen(http);
