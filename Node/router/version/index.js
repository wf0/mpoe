// 用户模块的相关路由 => controller  因此需要引入实现类
const router = require("express").Router();

// 引入版本控制层
const { versionCtrl, fileCtrl } = require("../../mvc/controller");

/**
 * 版本控制说明
 *  1. 客户端一定是永远调用一个接口,因从需要处理是否处于创建状态,
 *  2. 根据files 表的 currenthead 当前指针 是否为空 判断是否是第一次创建
 *      createVersion 中可以直接 next 跳过创建过程
 *  3. 更新版本还需要控制时间
 *  4. 更新版本的同时,还需要更新文件表信息 currenthead 字段
 */

// 更新版本(有一定的时间周期,不然一个文件会有很多版本)
router.post("/updateVersion", versionCtrl.createVersion, fileCtrl.updateFiles);

exports.versionRouter = router;
