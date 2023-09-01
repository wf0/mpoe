# Multi Person Online Editor 项目数据库设计

## 用户 users

    - userid 用户id - nanoid生成
    - username 用户名
    - userimg 用户头像 - 自动生成 svg 后期可更换，更换后是服务器地址
    - password 密码（md5）
    - vip 是否vip
  
## 文件 files

    - fileid 文件id（系统自动生成） - nanoid生成
    - filename 文件名
    - filetype 文件类型 【txt、word、excel、pdf、markdown】
    - filesuffix 文件后缀
    - owner 拥有者
    - fileownerfolderid 文件所属文件夹id
    - currenthead 当前指针【通过指针指向文件版本历史记录】
    - createtime 创建时间

## 文件夹 folders

    - folderid 文件夹id 【表主键】
    - foldername 文件夹名称
    - parentfolderid 父级文件夹【通过该字段，可以构成树结构】
    - owner 拥有者（文件夹创建者）
    - createtime 创建时间

## 版本历史 versions

    - vid 版本id
    - fileid 指向的文件
    - createtime 创建时间
    - content 版本内容
    - lasteditor 最后编辑者

## 文件状态 filestate （在本项目中使用该表实现文件共享编辑）

    - fsid 表主键
    - fileid 文件id
    - editor 用户id 可编辑者【加入编辑的人，指向 userid，可引入成员管理概念】
    - favor 是否收藏
    - top 是否置顶
    - state  文件状态 【1：正常、2：回收站、3：作废，回收站可以恢复，作废的可以通过vip恢复，提供云端文件功能】
    - cratetime 加入时间
