// node 服务器 基础配置

// server PORT
const server_port = 5000;

// mysql
const sql_config = {
  port: 3306,
  host: "localhost",
  database: "mpoe",
  user: "root",
  password: "root",
};

// JWT 加密字符串
const JSON_WEB_TOKEN_SECRET =
  "17c13348-9dbd5d-407e682-2890d69-47f8606-8a668f-3caaa9bb-a6eac08d-dfbeb1d";

// 方法监听函数
const initServeListen = (http) => {
  http.listen(server_port || 5000, () => {
    console.log(
      `Node Serve is running at http://localhost:${server_port || 5000}.`
    );
  });
};

module.exports = {
  server_port,
  sql_config,
  JSON_WEB_TOKEN_SECRET,
  initServeListen,
};
