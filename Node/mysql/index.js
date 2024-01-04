// 引入 mysql
const mysql = require("mysql");
const { sql_config } = require("../base.config.js");
const { logger } = require("../util");

let conn = null;

const initSQL = () => {
  try {
    conn = mysql.createConnection({
      port: sql_config.port,
      host: sql_config.host,
      database: sql_config.database,
      password: sql_config.password,
      user: sql_config.user,
    });

    // 连接数据库
    conn.connect((err) => {
      if (err) return logger.error("数据库连接失败 ==>", err);
      logger.info("连接数据库成功！");
    });
  } catch (error) {
    logger.error("连接数据库失败 ==>", error);
  }
};

const query = (sql) => {
  logger.info(sql);
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    } catch (err) {
      reject(err);
      logger.error(err);
    }
  });
};

module.exports = { initSQL, query };
