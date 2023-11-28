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
) ENGINE=InnoDB AUTO_INCREMENT=176 DEFAULT CHARSET=utf8;

/*Data for the table `files` */

insert  into `files`(`index`,`fileid`,`filename`,`filetype`,`filesuffix`,`owner`,`state`,`fileownerfolderid`,`currenthead`,`createtime`) values (171,'1R59BcVZNfsA3NqU_3ARH','测试修改','markdown','md','1',2,NULL,'ljvDZAmZNZgPwC9CjQY6s','2023-11-20 09:57:56'),(173,'ePEpG5AVTMivmeNE0EHyq','000','markdown','md','1',2,NULL,'AvlHWd77eV9LK7sRSbIoB','2023-11-20 10:41:51'),(174,'FGz6tOXcF6Ec5JMgrYwpl','999','markdown','md','1',2,NULL,'37XsSkpcDQ31PnybWArL7','2023-11-21 11:00:12'),(175,'h8vBG1v9Bpxx4vGByB2EC','123','excel','xlsx','1',1,NULL,NULL,'2023-11-21 11:07:12'),(172,'YsHITAP-nmPV2rn3-Xhfp','061','markdown','md','1',2,NULL,'J-Q3yyHfViP-ZGlNgjli1','2023-11-20 10:01:27'),(170,'ZHZstNyYAg5IFSTwCWgcJ','057','markdown','md','1',2,NULL,'V644tEkN6Dvx3cAtq6D6g','2023-11-20 09:56:13');

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

/*Data for the table `filestates` */

/*Table structure for table `folders` */

DROP TABLE IF EXISTS `folders`;

CREATE TABLE `folders` (
  `index` int(255) NOT NULL AUTO_INCREMENT COMMENT '序列',
  `folderid` varchar(255) NOT NULL COMMENT '文件夹id',
  `foldername` varchar(255) DEFAULT NULL COMMENT '文件夹名称',
  `parentfolderid` varchar(255) DEFAULT NULL COMMENT '父级文件夹id',
  `owner` varchar(255) DEFAULT NULL COMMENT '拥有者',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`folderid`),
  KEY `index` (`index`),
  KEY `owner` (`owner`),
  KEY `parentfolderid` (`parentfolderid`),
  CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `users` (`userid`),
  CONSTRAINT `folders_ibfk_2` FOREIGN KEY (`parentfolderid`) REFERENCES `folders` (`folderid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `folders` */

insert  into `folders`(`index`,`folderid`,`foldername`,`parentfolderid`,`owner`,`createtime`) values (1,'JL95MDyyg4yIYi7yX9Y2g','123',NULL,'1','2023-11-21 15:17:48');

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
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8;

/*Data for the table `users` */

insert  into `users`(`index`,`userid`,`username`,`userimg`,`password`,`vip`,`createtime`) values (73,'1','用户_hC7NM','<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 231 231\"><path d=\"M33.83,33.83a115.5,115.5,0,1,1,0,163.34,115.49,115.49,0,0,1,0-163.34Z\" style=\"fill:#0079b1;\"/><path d=\"m115.5 51.75a63.75 63.75 0 0 0-10.5 126.63v14.09a115.5 115.5 0 0 0-53.729 19.027 115.5 115.5 0 0 0 128.46 0 115.5 115.5 0 0 0-53.729-19.029v-14.084a63.75 63.75 0 0 0 53.25-62.881 63.75 63.75 0 0 0-63.65-63.75 63.75 63.75 0 0 0-0.09961 0z\" style=\"fill:#542e02;\"/><path d=\"M61.11,205.59l3.49,3.69-6.26,6.6A115.45,115.45,0,0,0,72,222.51v-22a115.19,115.19,0,0,0-10.85,5.1Z\" style=\"fill:#efedee;\"/><path d=\"M93.24,228.85V199l-4-4A114.43,114.43,0,0,0,72,200.49v22a114.43,114.43,0,0,0,21.28,6.34Z\" style=\"fill:#ec0033;\"/><path d=\"m159 222.51v-22a114.63 114.63 0 0 0-17.25-5.51l-4 4v29.86a114.16 114.16 0 0 0 21.25-6.35z\" style=\"fill:#ec0033;\"/><path d=\"m169.89 205.59-3.49 3.69 6.26 6.6a115.45 115.45 0 0 1-13.66 6.63v-22a115.19 115.19 0 0 1 10.85 5.1z\" style=\"fill:#efedee;\"/><path d=\"M115.5,219.62A28.5,28.5,0,0,1,87.25,195c2.93-.74,5.92-1.36,8.94-1.87a19.41,19.41,0,0,0,38.62,0c3,.51,6,1.13,8.94,1.87a28.49,28.49,0,0,1-28.25,24.63Z\" style=\"fill:#f2ff05;\"/><path d=\"m32.902 67.662c-0.36295 1.7227-6.2342 30.695 5.6133 52.596 4.5843 8.4743 9.0081 13.239 12.75 15.893a67.7 67.7 0 0 1-3.4688-21.35 67.7 67.7 0 0 1 2.332-17.658c-4.4914-2.4646-10.868-6.9012-13.834-13.52-4.1626-9.285-3.6155-14.673-3.3926-15.961zm165.19 0c0.22292 1.2882 0.77005 6.6759-3.3926 15.961-2.9664 6.6183-9.3426 11.055-13.834 13.52a67.7 67.7 0 0 1 2.332 17.658 67.7 67.7 0 0 1-3.4688 21.35c3.7419-2.6532 8.1657-7.4183 12.75-15.893 11.847-21.9 5.9762-50.873 5.6133-52.596z\" style=\"fill:#acfffd;\"/><path d=\"m115.73 13.191c-7.3787-0.13351-13.509 5.7888-13.631 13.168-0.10128 5.8827 3.4508 10.518 8.0566 12.52 1.061 0.46115 2.1869 0.78009 3.3418 0.95703v8.4291c0.66778-0.02035 1.3358-0.03077 2.0039-0.03125 0.66547-9e-5 1.3309 0.0097 1.9961 0.0293v-8.4115c2.6002-0.38406 5.1586-1.5484 7.3086-3.625 4.2322-4.0878 4.9991-9.8755 3.1582-14.549-1.8407-4.6726-6.3502-8.3834-12.232-8.4863z\" style=\"fill:#acfffd;\"/><path d=\"m83.527 103.98v10h10v-10h-10zm53.945 0v10h10v-10h-10z\" style=\"fill:#000;\"/><path d=\"m56.621 94.906v11.688h5.3418v6.4922h5.3418v6.1055h5.3223v6.2324h26.846v-6.2324h5.3047v-6.1055h5.1445v-6.0039h11.154v6.0039h5.1446v6.1055h5.3066v6.2324h26.846v-6.2324h5.3203v-6.1055h5.3438v-6.4922h5.3418v-11.688z\" style=\"fill:none;\"/><path d=\"m67.387 100.65v5.9394h5.1992v-5.9394zm5.1992 5.9394v6.4922h5.4238v-6.4922zm5.4238 0h5.1992v-5.9394h-5.1992zm5.1992 0v6.4922h5.4258v-6.4922zm5.4258 6.4922v6.1055h5.1426v-6.1055zm-10.625 0v6.1055h5.1445v-6.1055zm48.281-12.432v5.9394h5.1992v-5.9394zm5.1992 5.9394v6.4922h5.4238v-6.4922zm5.4238 0h5.1992v-5.9394h-5.1992zm5.1992 0v6.4922h5.4258v-6.4922zm5.4258 6.4922v6.1055h5.1426v-6.1055zm-10.625 0v6.1055h5.1445v-6.1055z\" style=\"fill:none;\"/><path d=\"m94.19 136.84h42.632a3.7801 3.78 0 0 1 3.7802 3.78v3.22a15.231 15.23 0 0 1-15.211 15.16h-19.781a15.251 15.25 0 0 1-15.221-15.16v-3.22a3.8002 3.8 0 0 1 3.7802-3.78z\" style=\"fill:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;stroke:#000;\"/><path d=\"m130.96 136.84v21.16m-30.911-21.16v21.16m10.34-21.16v22.16m10.31-22.2v22.2\" style=\"fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;stroke:#000;\"/></svg>','c4ca4238a0b923820dcc509a6f75849b',0,'2023-09-06 10:47:03'),(74,'2','用户_apKcr','<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 231 231\"><path d=\"M33.83,33.83a115.5,115.5,0,1,1,0,163.34,115.49,115.49,0,0,1,0-163.34Z\" style=\"fill:#00d2a3;\"/><path d=\"m115.5 51.75a63.75 63.75 0 0 0-10.5 126.63v14.09a115.5 115.5 0 0 0-53.729 19.027 115.5 115.5 0 0 0 128.46 0 115.5 115.5 0 0 0-53.729-19.029v-14.084a63.75 63.75 0 0 0 53.25-62.881 63.75 63.75 0 0 0-63.65-63.75 63.75 63.75 0 0 0-0.09961 0z\" style=\"fill:#755227;\"/><path d=\"m141.74 195a114.93 114.93 0 0 1 37.912 16.45l0.07 0.05c-1.17 0.79-2.3601 1.55-3.5601 2.29a115.55 115.55 0 0 1-120.95 0.21q-2.0001-1.23-4.0002-2.54a114.79 114.79 0 0 1 38.002-16.5 116.21 116.21 0 0 1 15.791-2.49v-14.57c1.32 0.22 2.6501 0.39 4.0002 0.51 2.0001 0.19 4.0002 0.28 6.1202 0.29a64.333 64.33 0 0 0 8.8804-0.62c0.67003-0.09 1.3401-0.2 2.0001-0.31v14.69a118 118 0 0 1 15.741 2.54z\" style=\"fill:#000;\"/><path d=\"m79.292 212a3.4601 3.46 0 0 0 3.8902 5.07 3.3801 3.38 0 0 0 2.1001-1.61 3.4701 3.47 0 0 0-1.2801-4.72 3.4201 3.42 0 0 0-2.6201-0.34 3.5101 3.51 0 0 0-2.0901 1.6zm60.122 0.46a3.4901 3.49 0 0 0 1.21 4.7h0.06a3.4601 3.46 0 0 0 4.7202-1.27l0.07-0.13a3.4601 3.46 0 0 0-1.34-4.6 3.4601 3.46 0 0 0-2.5801-0.32 3.5301 3.53 0 0 0-2.1001 1.61zm9.8004 5.7 5.8602 5.87c-1.39 0.5-2.7901 1-4.2102 1.44l-4.4802-4.47a7.5203 7.52 0 0 1-1.9401 0.81 7.8303 7.83 0 0 1-6.0002-0.79 7.8703 7.87 0 0 1-2.9201-10.69v-0.07a7.8903 7.89 0 0 1 10.77-2.88l0.12 0.07a7.8603 7.86 0 0 1 2.7901 10.62v0.07zm-37.701-2.36-9.5004 9.51v4.9c-1.35-0.16-2.6801-0.33-4.0002-0.54v-6l0.58002-0.58 10.1-10.09a7.8703 7.87 0 1 1 2.8401 2.86zm7.3203-5.91a3.4601 3.46 0 1 0-1.6101 2.1 3.3801 3.38 0 0 0 1.6101-2.1zm-29.741 7.82 3.0901 3.1 0.59002 0.59v7.36c-1.3401-0.26-2.6801-0.55-4.0002-0.87v-4.84l-2.5101-2.51a7.5203 7.52 0 0 1-1.9401 0.81 7.8803 7.88 0 1 1 1.9101-14.43 7.8703 7.87 0 0 1 2.8901 10.75z\" style=\"fill:#fff;\"/><path d=\"m57.534 142.03c-6.9383-31.75-0.57294-52.577 14.174-62.344 22.562-12.283 62.082-12.222 83.484-1.8846 21.348 11.177 22.124 37.396 18.498 63.733 8.1279-14.155 13.164-31.598 14.085-48.902 1.0828-11.795-1.1756-18.866-7.4833-27.972-26.465-37.685-103.45-31.56-129.66-2.8372-7.8504 9.4615-9.6006 17.478-9.275 26.667 1.0024 18.667 6.9688 38.508 16.18 53.54z\" style=\"fill:#ff9809;\"/><path d=\"m111.26 3.0423c-6.013 0.1128-12.629 2.6924-15.291 7.9082-1.1676 3.2383-1.6758 6.2069-1.6758 8.8926 0.89228-0.2661 1.8005-0.5164 2.7266-0.7441 3.7502-1.0672 7.4851-1.7135 11.129-1.9981 1.1007-0.086 2.1953-0.1391 3.2773-0.1601h2e-3c5.6969-0.1133 11.09 0.6603 15.904 2.0527 0.0552-3.042-0.70696-5.9824-2.1738-8.5-1.8411-3.1599-4.7033-5.5568-8.4297-6.8262-1.6883-0.4952-3.5163-0.662-5.4688-0.625zm3.0664 17.449c-0.69317-0.01-1.3919-0.01-2.0938 0h-2e-3c-1.1591 0.019-2.3326 0.064-3.5117 0.1386-3.9035 0.246-7.9025 0.8061-11.92 1.7285-15.159 3.0075-26.469 9.9279-22.068 19.682 22.891-8.7773 52.315-10.403 76.023-2.2129 2.1414-9.5529-14.939-19.081-36.428-19.34z\" style=\"fill:#ff9809;\"/><path d=\"m165.62 16.981c-0.8575 0-1.9406 0.54389-3.3476 1.3574-7.3382 4.7652-13.452 10.867-19.516 18.363 9.2734 2.1825 17.903 5.6706 25.213 10.604 1.1512-9.1263 1.9137-18.503 0.055-26.996-0.57-2.4184-1.3017-3.3267-2.4043-3.3281zm-104.09 1.6934c-1.1026 0-1.8342 0.91165-2.4043 3.3301-1.8794 8.5869-1.0806 18.078 0.092 27.299 7.0559-4.6638 15.687-8.3667 25.111-10.984-6.043-7.4601-12.139-13.537-19.451-18.285-1.407-0.81353-2.4901-1.3605-3.3477-1.3594z\" style=\"fill:none;\"/><path d=\"m162.45 16.686c-2.3175 2e-3 -4.6276 0.57608-6.8926 1.668-8.4768 6.0155-11.113 13.349-10.133 19.787 10.323 2.7077 19.762 7.0658 27.346 13.279 9.848-4.9363 11.32-17.137 4.6152-25.852-4.7104-6.1222-9.8371-8.8878-14.936-8.8828zm-97.318 4.1387c-2.4569 0.0556-5.1642 0.54474-8.1172 1.5176-13.487 4.4433-19.06 21.215-3.6484 31.84 7.2476-6.0694 16.961-10.896 27.892-14.229 0.2193-3.3241-0.3201-7.0817-1.8691-11.236-2.8049-4.8445-7.2233-7.721-13.221-7.8906-0.3408-0.01-0.6861-0.01-1.0371-2e-3z\" style=\"fill:none;\"/><path d=\"m145.38 95.628c-5.1601 2.2597-11.03 2.2597-16.19 0m-47.29 1.75c5.1755-2.2694 11.065-2.2694 16.24 0\" style=\"fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:5.9998px;stroke:#795548;\"/><path d=\"m90.016 106.28c-4.4506-0.0105-6.6902 5.3657-3.5508 8.5195 3.1394 3.1539 8.5252 0.93887 8.5352-3.5117 0.0063-2.7522-2.2204-4.9898-4.9727-4.9961l-0.011719-0.01172zm47.281 0c-4.4506-0.0105-6.6902 5.3657-3.5508 8.5195 3.1394 3.1539 8.5252 0.93887 8.5352-3.5117 6e-3 -2.7522-2.2204-4.9898-4.9727-4.9961l-0.01171-0.01172z\" style=\"fill:#000;\"/><path d=\"m97.06 144.59a20.15 20.15 0 0 0 36.88 4.53z\" style=\"fill:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.9999px;stroke:#000;\"/></svg>','c81e728d9d4c2f636f067f89cc14862c',0,'2023-09-06 10:47:59'),(75,'3','用户_NTX5k','<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 231 231\"><path d=\"M33.83,33.83a115.5,115.5,0,1,1,0,163.34,115.49,115.49,0,0,1,0-163.34Z\" style=\"fill:#00a58c;\"/><path d=\"m115.5 51.75a63.75 63.75 0 0 0-10.5 126.63v14.09a115.5 115.5 0 0 0-53.729 19.027 115.5 115.5 0 0 0 128.46 0 115.5 115.5 0 0 0-53.729-19.029v-14.084a63.75 63.75 0 0 0 53.25-62.881 63.75 63.75 0 0 0-63.65-63.75 63.75 63.75 0 0 0-0.09961 0z\" style=\"fill:#f8d9ad;\"/><path d=\"m141.75 195c13.563 3.1499 26.439 8.7409 38 16.5-38.873 26.001-89.587 26.001-128.46 0 11.561-7.7591 24.437-13.35 38-16.5 8.4869 8.8011 26.21 25.619 26.21 25.619s17.603-16.972 26.25-25.619z\" style=\"fill:#000;\"/><path d=\"m109 230.81 1.6836-14.33h9.6328l1.6836 14.33c-2.16 0.12-4.33 0.19-6.51 0.19s-4.35-0.07-6.51-0.19z\" style=\"fill:#ff0000;\"/><path d=\"m124.17 210.6h-17.349v5.53a3.8828 3.29 0 0 0 3.8828 3.29h9.583a3.8828 3.29 0 0 0 3.8828-3.29z\" style=\"fill:#ff0000;\"/><path d=\"m140.57 190.36-25.066 20.245c5.9686 3.2455 11.597 7.0814 16.8 11.45 1.5989 1.3338 3.9762 1.1189 5.31-0.48 0.21005-0.25749 0.38802-0.53956 0.52999-0.84l10.826-23.805-4-6c-0.90256-1.351-2.7298-1.7137-4.08-0.81-0.11612 0.0786-0.22641 0.16549-0.33 0.26z\" style=\"fill:#7d7d7d;\"/><path d=\"m90.434 190.36 25.066 20.245c-5.9686 3.2455-11.597 7.0814-16.8 11.45-1.5989 1.3338-3.9762 1.1189-5.31-0.48-0.21005-0.25749-0.38802-0.53956-0.52999-0.84l-10.826-23.805 4-6c0.90256-1.351 2.7298-1.7137 4.08-0.81 0.11612 0.0786 0.22641 0.16549 0.33 0.26z\" style=\"fill:#7d7d7d;\"/><path d=\"m69.834 33.826c-8.2001-0.0626-16.444 2.6753-23.152 7.7038-8.5298 6.9899-12.159 19.61-12.329 32.68-0.2041 15.476 1.6092 34.752 1.7464 51.915 0.10414 13.047 0.53485 25.984-2.9197 33.995-2.4994 5.81-9.0955 9.6006-16.196 12.311 7.9599 2.8301 25.009 2.8094 33.58 1.5393 10.8-1.59 17.238-6.5294 17.159-22.699-0.0911-15.93-1.3894-29.23-1.559-45.83-0.3208-11.983-1.569-24.291 4.9774-33.987 4.2139-6.1265 10.452-10.521 17.116-13.588 3.9292-1.8575 8.0384-3.3083 12.263-4.3297-6.8718-13.574-18.732-19.618-30.687-19.709z\" style=\"fill:#00eaff;\"/><path d=\"m90.8 76.246c11.918-17.125 31.996-23.218 49.743-17.488 11.81 3.9496 20.692 13.389 22.313 28.237 0.51051 6.2098 0.63413 12.445 0.37007 18.67-0.23973 11.2-0.72946 23.82-1.0995 34.08-0.82005 22.43 0.0593 35.1 24.589 36.3 8.5635 0.32122 17.137-0.22845 25.59-1.6405h-0.0198c-10.74-3.3799-17.98-15.609-19.3-26.289-1.29-10.41-0.6098-23.43-0.7898-38.091-0.1701-14.96 1.0398-29.819 0.28008-42.089-1.414-22.777-14.947-38.505-34.126-45.152-27.813-7.35-51.083 0.091-61.672 17.343-5.4698 8.9112-7.7413 20.07-5.8788 36.121z\" style=\"fill:none;\"/><path d=\"m91.72 97.36v11.4m47.56-11.4v11.4\" style=\"fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:7.9999px;stroke:#000;\"/><path d=\"m100.19 152.09c2.8726 4.0616 9.8095 4.7232 15.119-0.45432 5.0656 4.5134 11.167 5.6898 15.495 0.31458\" style=\"fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:5.8949;stroke:#111;\"/><path d=\"m109.67 135.53c-0.9758 0.0743-2.05 0.45327-3.1485 0.99414-4.3235 2.1399-7.3862 4.2557-10.639 7.1406-0.6251 0.5715 0.1168 0.77785 1.4238 0.87304 5.6967 0.0536 14.384 0.41404 15.098-0.875 1.9251-2.0788 1.7969-5.3303-0.1816-7.3008-0.701-0.67533-1.5769-0.90632-2.5527-0.83203zm11.656 0c-0.9758-0.0743-1.8517 0.1567-2.5527 0.83203-1.9785 1.9705-2.1067 5.222-0.1817 7.3008 0.7142 1.289 9.401 0.9286 15.098 0.875 1.307-0.0952 2.0489-0.30154 1.4238-0.87304-3.2524-2.8849-6.3151-5.0007-10.639-7.1406-1.0985-0.54087-2.1727-0.91985-3.1485-0.99414z\" style=\"fill:#633b1d;\"/></svg>','eccbc87e4b5ce2fe28308fd9f2a7baf3',0,'2023-11-06 16:58:22');

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
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4;

/*Data for the table `versions` */

insert  into `versions`(`index`,`vid`,`fileid`,`content`,`lasteditor`,`createtime`) values (83,'37XsSkpcDQ31PnybWArL7','FGz6tOXcF6Ec5JMgrYwpl','[{\"insert\":\" 加<u>**粗**</u>\r\",\"attributes\":{\"header\":1}},{\"insert\":\"\r\"},{\"insert\":\" 123~~1***231231231\\***23~~123\r\",\"attributes\":{\"header\":1}},{\"insert\":\"\r\"},{\"insert\":\"1**123\r\",\"attributes\":{\"header\":null}},{\"insert\":\"\r\"},{\"insert\":\"2**123**\r\",\"attributes\":{\"header\":null}},{\"insert\":\"\r\"},{\"insert\":\"3** 123 123**\r\"},{\"insert\":\"\r\"},{\"insert\":\"4**123 123 123 123 123 **\r\",\"attributes\":{\"header\":null}},{\"insert\":\"\r\"},{\"insert\":\"5 ** 123 123 123**\r\"},{\"insert\":\"\r\"},{\"insert\":\"成功的只有**紧跟着文字，不能有空格，并且有结束/* * 无所谓 **\r\",\"attributes\":{\"header\":null}},{\"insert\":\"\r\"},{\"insert\":\" 二~~级标~~题\r\",\"attributes\":{\"header\":2}},{\"insert\":\"\r\"},{\"insert\":\" 三级标题\r\",\"attributes\":{\"header\":3}},{\"insert\":\"\r\"},{\"insert\":\" 四级\r\",\"attributes\":{\"header\":4}},{\"insert\":\"\r\"},{\"insert\":\" 五**级**\r\",\"attributes\":{\"header\":5}},{\"insert\":\"\r\"},{\"insert\":\" 六**级**\r\",\"attributes\":{\"header\":6}},{\"insert\":\"\r\"},{\"insert\":\" 七级\r\",\"attributes\":{\"header\":7}},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"```\r\"},{\"insert\":\"\r\"},{\"insert\":\"```\r\"},{\"insert\":\"\r\"},{\"insert\":\"$$\r\"},{\"insert\":\"\r\"},{\"insert\":\"$$\r\"},{\"insert\":\"\r\"},{\"insert\":\"> 123\r\"},{\"insert\":\"\r\"},{\"insert\":\"- [ ] \r\"},{\"insert\":\"\r\"},{\"insert\":\"[123]: www.baidu.com	#[s]#百度#[s]#\r\"},{\"insert\":\"\r\"},{\"insert\":\"[^]: \r\"},{\"insert\":\"\r\"},{\"insert\":\"------\r\"},{\"insert\":\"\r\"},{\"insert\":\"[TOC]\r\"},{\"insert\":\"\r\"},{\"insert\":\"1**23123了喀***什角动量*<u>喀什</u>*较大爱`神的箭安徽`省贷记卡~~还是大~~数据肯<!--定会按时打-->卡圣诞节卡刷道具卡忽视了电话卡*\r\",\"attributes\":{\"header\":null}},{\"insert\":\"\r\"},{\"insert\":\"卡刷道具卡忽视了电[卡刷道具卡忽视了电卡]()刷道具卡忽视了电卡刷道具卡忽视了电卡刷道具卡忽视了电卡刷道具卡忽视了电卡刷道具卡忽视了电\r\",\"attributes\":{\"header\":null}},{\"insert\":\"\"}]','1','2023-11-21 11:00:13'),(82,'AvlHWd77eV9LK7sRSbIoB','ePEpG5AVTMivmeNE0EHyq','[{\"insert\":\" 加<u>**粗**</u>\r\",\"attributes\":{\"header\":1}},{\"insert\":\"\r\"},{\"insert\":\" 123~~1***231231231\\***23~~123\r\",\"attributes\":{\"header\":1}},{\"insert\":\"\r\"},{\"insert\":\"1**123\r\",\"attributes\":{\"header\":0}},{\"insert\":\"\r\"},{\"insert\":\"2**123**\r\",\"attributes\":{\"header\":0}},{\"insert\":\"\r\"},{\"insert\":\"3** 123 123**\r\"},{\"insert\":\"\r\"},{\"insert\":\"4**123 123 123 123 123 **\r\",\"attributes\":{\"header\":0}},{\"insert\":\"\r\"},{\"insert\":\"5 ** 123 123 123**\r\"},{\"insert\":\"\r\"},{\"insert\":\"成功的只有**紧跟着文字，不能有空格，并且有结束/* * 无所谓 **\r\",\"attributes\":{\"header\":0}},{\"insert\":\"\r\"},{\"insert\":\" 二~~级标~~题\r\",\"attributes\":{\"header\":2}},{\"insert\":\"\r\"},{\"insert\":\" 三级标题\r\",\"attributes\":{\"header\":3}},{\"insert\":\"\r\"},{\"insert\":\" 四级\r\",\"attributes\":{\"header\":4}},{\"insert\":\"\r\"},{\"insert\":\" 五**级**\r\",\"attributes\":{\"header\":5}},{\"insert\":\"\r\"},{\"insert\":\" 六**级**\r\",\"attributes\":{\"header\":6}},{\"insert\":\"\r\"},{\"insert\":\" 七级\r\",\"attributes\":{\"header\":7}},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"```\r\"},{\"insert\":\"\r\"},{\"insert\":\"```\r\"},{\"insert\":\"\r\"},{\"insert\":\"$$\r\"},{\"insert\":\"\r\"},{\"insert\":\"$$\r\"},{\"insert\":\"\r\"},{\"insert\":\"> 123\r\"},{\"insert\":\"\r\"},{\"insert\":\"- [ ] \r\"},{\"insert\":\"\r\"},{\"insert\":\"[123]: www.baidu.com	#[s]#百度#[s]#\r\"},{\"insert\":\"\r\"},{\"insert\":\"[^]: \r\"},{\"insert\":\"\r\"},{\"insert\":\"------\r\"},{\"insert\":\"\r\"},{\"insert\":\"[TOC]\r\"},{\"insert\":\"\r\"},{\"insert\":\"1**23123了喀***什角动量*<u>喀什</u>*较大爱`神的箭安徽`省贷记卡~~还是大~~数据肯<!--定会按时打-->卡圣诞节卡刷道具卡忽视了电话卡*\r\",\"attributes\":{\"header\":0}},{\"insert\":\"\r\"},{\"insert\":\"卡刷道具卡忽视了电[卡刷道具卡忽视了电卡]()刷道具卡忽视了电卡刷道具卡忽视了电卡刷道具卡忽视了电卡刷道具卡忽视了电卡刷道具卡忽视了电\r\",\"attributes\":{\"header\":0}},{\"insert\":\"\"}]','1','2023-11-20 10:41:51'),(81,'J-Q3yyHfViP-ZGlNgjli1','YsHITAP-nmPV2rn3-Xhfp','[{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"3** 123 123**\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"5 ** 123 123 123**\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"```\r\"},{\"insert\":\"\r\"},{\"insert\":\"```\r\"},{\"insert\":\"\r\"},{\"insert\":\"$$\r\"},{\"insert\":\"\r\"},{\"insert\":\"$$\r\"},{\"insert\":\"\r\"},{\"insert\":\"> 123\r\"},{\"insert\":\"\r\"},{\"insert\":\"- [ ] \r\"},{\"insert\":\"\r\"},{\"insert\":\"[123]: www.baidu.com	#[s]#百度#[s]#\r\"},{\"insert\":\"\r\"},{\"insert\":\"[^]: \r\"},{\"insert\":\"\r\"},{\"insert\":\"------\r\"},{\"insert\":\"\r\"},{\"insert\":\"[TOC]\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\"}]','1','2023-11-20 10:01:27'),(80,'ljvDZAmZNZgPwC9CjQY6s','1R59BcVZNfsA3NqU_3ARH','[{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"3** 123 123**\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"5 ** 123 123 123**\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"```\r\"},{\"insert\":\"\r\"},{\"insert\":\"```\r\"},{\"insert\":\"\r\"},{\"insert\":\"$$\r\"},{\"insert\":\"\r\"},{\"insert\":\"$$\r\"},{\"insert\":\"\r\"},{\"insert\":\"> 123\r\"},{\"insert\":\"\r\"},{\"insert\":\"- [ ] \r\"},{\"insert\":\"\r\"},{\"insert\":\"[123]: www.baidu.com	#[s]#百度#[s]#\r\"},{\"insert\":\"\r\"},{\"insert\":\"[^]: \r\"},{\"insert\":\"\r\"},{\"insert\":\"------\r\"},{\"insert\":\"\r\"},{\"insert\":\"[TOC]\r\"},{\"insert\":\"\r\"},{\"insert\":\"\r\"},{\"insert\":\"\"}]','1','2023-11-20 09:57:56'),(79,'V644tEkN6Dvx3cAtq6D6g','ZHZstNyYAg5IFSTwCWgcJ','[]','1','2023-11-20 09:56:13');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
