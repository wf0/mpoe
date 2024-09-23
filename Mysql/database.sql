/*
SQLyog Professional v12.09 (64 bit)
MySQL - 5.5.40 : Database - mpoe
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`mpoe` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `mpoe`;

/*Table structure for table `celldatas` */

DROP TABLE IF EXISTS `celldatas`;

CREATE TABLE `celldatas` (
  `cdid` varchar(255) NOT NULL COMMENT '表主键',
  `index` varchar(255) NOT NULL COMMENT '表外键',
  `r` int(255) NOT NULL COMMENT '行',
  `c` int(255) NOT NULL COMMENT '列',
  `ctfa` varchar(255) DEFAULT NULL COMMENT '格式名称为自动格式 (要构建成对象)',
  `ctt` varchar(255) DEFAULT NULL COMMENT '格式类型为数字类型 (要构建成对象)',
  `v` longtext COMMENT '内容的原始值为',
  `m` longtext COMMENT '内容的显示值为',
  `bg` varchar(255) DEFAULT NULL COMMENT '背景为',
  `ff` varchar(255) DEFAULT NULL COMMENT '字体为',
  `fc` varchar(255) DEFAULT NULL COMMENT '字体颜色为',
  `bl` int(255) DEFAULT '0' COMMENT '字体加粗',
  `it` int(255) DEFAULT '0' COMMENT '字体斜体',
  `fs` varchar(255) DEFAULT NULL COMMENT '字体大小为',
  `cl` int(255) DEFAULT '0' COMMENT '启用删除线',
  `ht` int(255) DEFAULT '0' COMMENT '水平居中',
  `vt` int(255) DEFAULT '0' COMMENT '垂直居中',
  `tr` int(255) DEFAULT '0' COMMENT '文字旋转',
  `tb` int(255) DEFAULT '0' COMMENT '文本自动换行',
  `f` longtext COMMENT '单元格是一个求和公式'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `configs` */

DROP TABLE IF EXISTS `configs`;

CREATE TABLE `configs` (
  `cid` varchar(255) DEFAULT NULL COMMENT '主键',
  `index` varchar(255) DEFAULT NULL COMMENT '关联的 index',
  `type` varchar(255) DEFAULT NULL COMMENT 'config 类型 【merge、】',
  `key` varchar(255) DEFAULT NULL COMMENT 'merge key 【merge 专用字段】',
  `value` longtext COMMENT 'merge value 【merge 专用字段】'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Table structure for table `files` */

DROP TABLE IF EXISTS `files`;

CREATE TABLE `files` (
  `index` int(255) NOT NULL AUTO_INCREMENT COMMENT '序列',
  `fileid` varchar(255) NOT NULL COMMENT '文件id',
  `filename` varchar(255) DEFAULT NULL COMMENT '文件全名（包括后缀）',
  `filetype` varchar(255) DEFAULT NULL COMMENT '文件类型',
  `filesuffix` varchar(255) DEFAULT NULL COMMENT '文件后缀',
  `owner` varchar(255) DEFAULT NULL COMMENT '拥有者（指向userid）',
  `state` int(10) DEFAULT '1' COMMENT '1：正常、2：回收站、3：作废',
  `fileownerfolderid` varchar(255) DEFAULT NULL COMMENT '文件所属文件夹id',
  `currenthead` varchar(255) DEFAULT NULL COMMENT '当前指针',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`fileid`),
  KEY `index` (`index`),
  KEY `owner` (`owner`),
  KEY `currenthead` (`currenthead`),
  KEY `fileownerfolderid` (`fileownerfolderid`),
  CONSTRAINT `files_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `users` (`userid`),
  CONSTRAINT `files_ibfk_2` FOREIGN KEY (`fileownerfolderid`) REFERENCES `folders` (`folderid`)
) ENGINE=InnoDB AUTO_INCREMENT=232 DEFAULT CHARSET=utf8;

/*Table structure for table `filestates` */

DROP TABLE IF EXISTS `filestates`;

CREATE TABLE `filestates` (
  `fsid` varchar(255) NOT NULL COMMENT '表主键',
  `fileid` varchar(255) DEFAULT NULL COMMENT '文件id',
  `editor` varchar(255) DEFAULT NULL COMMENT '可编辑者',
  `favor` varchar(10) DEFAULT NULL COMMENT '是否收藏 0/1',
  `top` varchar(10) DEFAULT NULL COMMENT '是否置顶 0/1',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`fsid`),
  KEY `fileid` (`fileid`),
  KEY `editor` (`editor`),
  CONSTRAINT `filestates_ibfk_1` FOREIGN KEY (`fileid`) REFERENCES `files` (`fileid`),
  CONSTRAINT `filestates_ibfk_2` FOREIGN KEY (`editor`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `folders` */

DROP TABLE IF EXISTS `folders`;

CREATE TABLE `folders` (
  `index` int(255) NOT NULL AUTO_INCREMENT COMMENT '序列',
  `folderid` varchar(255) NOT NULL COMMENT '文件夹id',
  `foldername` varchar(255) DEFAULT NULL COMMENT '文件夹名称',
  `parentfolderid` varchar(255) DEFAULT NULL COMMENT '父级文件夹id',
  `owner` varchar(255) DEFAULT NULL COMMENT '拥有者',
  `state` int(255) DEFAULT '1' COMMENT '1：正常、2：回收站、3：作废',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`folderid`),
  KEY `index` (`index`),
  KEY `owner` (`owner`),
  KEY `parentfolderid` (`parentfolderid`),
  CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `users` (`userid`),
  CONSTRAINT `folders_ibfk_2` FOREIGN KEY (`parentfolderid`) REFERENCES `folders` (`folderid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `index` int(255) NOT NULL AUTO_INCREMENT COMMENT '序列',
  `userid` varchar(255) NOT NULL COMMENT '用户id',
  `username` varchar(255) DEFAULT NULL COMMENT '用户名',
  `userimg` longtext COMMENT '用户头像',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `vip` tinyint(1) DEFAULT '0' COMMENT '是否vip',
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`userid`),
  KEY `index` (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8;

/*Table structure for table `versions` */

DROP TABLE IF EXISTS `versions`;

CREATE TABLE `versions` (
  `index` int(255) NOT NULL AUTO_INCREMENT COMMENT '序列',
  `vid` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '版本号',
  `fileid` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '指向文件id',
  `content` longtext CHARACTER SET utf8 COMMENT '数据库存储、minio文件服务器',
  `lasteditor` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '最后编辑者',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`vid`),
  KEY `index` (`index`),
  KEY `lasteditor` (`lasteditor`),
  KEY `fileid` (`fileid`),
  CONSTRAINT `versions_ibfk_1` FOREIGN KEY (`lasteditor`) REFERENCES `users` (`userid`),
  CONSTRAINT `versions_ibfk_2` FOREIGN KEY (`fileid`) REFERENCES `files` (`fileid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `workbooks` */

DROP TABLE IF EXISTS `workbooks`;

CREATE TABLE `workbooks` (
  `gridKey` varchar(255) CHARACTER SET utf8mb4 NOT NULL COMMENT '唯一key',
  `lang` varchar(255) CHARACTER SET utf8mb4 DEFAULT 'zh' COMMENT '语言',
  `column` int(255) DEFAULT '60' COMMENT '空表格默认的列数量',
  `row` int(255) DEFAULT '84' COMMENT '空表格默认的行数据量',
  `fileid` varchar(255) DEFAULT NULL COMMENT '关联的文件',
  KEY `fileid` (`fileid`),
  KEY `gridKey` (`gridKey`(191)),
  CONSTRAINT `workbooks_ibfk_1` FOREIGN KEY (`fileid`) REFERENCES `files` (`fileid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `worksheets` */

DROP TABLE IF EXISTS `worksheets`;

CREATE TABLE `worksheets` (
  `index` varchar(255) NOT NULL COMMENT '工作表索引,唯一主键',
  `gridKey` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '外键',
  `name` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '工作表名称',
  `status` int(255) DEFAULT NULL COMMENT '激活状态',
  `order` int(255) DEFAULT NULL COMMENT '工作表的下标',
  `hide` int(255) DEFAULT '0' COMMENT '是否隐藏',
  `row` int(255) DEFAULT '36' COMMENT '行数',
  `column` int(255) DEFAULT '26' COMMENT '列数',
  `defaultRowHeight` int(255) DEFAULT '19' COMMENT '自定义行高',
  `defaultColWidth` int(255) DEFAULT '73' COMMENT '自定义列宽',
  KEY `gridKey` (`gridKey`(191)),
  KEY `worksheetid` (`gridKey`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
