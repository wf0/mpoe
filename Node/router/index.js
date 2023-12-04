const { userRouter } = require("./user");
const { fileRouter } = require("./file");
const { folderRouter } = require("./folder");
const { versionRouter } = require("./version");
const { indexRouter } = require("./home");
const { excelRouter } = require("./univer");
module.exports = (app) => {
  app.use(indexRouter);
  app.use("/user", userRouter);
  app.use("/file", fileRouter);
  app.use("/folder", folderRouter);
  app.use("/version", versionRouter);
  app.use("/excel", excelRouter);
};
