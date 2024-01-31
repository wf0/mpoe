# 多人协同编辑器项目说明

## 项目目录结构

> + Mysql
>   + 数据库 database.sql
>   + README.md 数据库表结构说明
> + Node
>   + 后台服务应用
> + Vue
>   + 前端应用
> + .gitignore
> + LICENSE
> + package-lock.json
> + package.json
> + README.md



## 项目端口说明

~~~javascript
/** node/base.config.js*/
// 业务端口
const server_port = 5000;

// ws 统一端口
const ws_port = 9000;

/** vue项目地址说明 */
// ws 协同服务地址
export const ws_server_url = "ws://localhost:9000";

// node http 服务地址
export const http_server_url = "http://localhost:5000";

// socket.io 服务地址
export const socket_server_url = "http://localhost:5000";

地址已经给大家封装好了，直接修改上面的地址即可。
~~~



## 项目启动方式**【必看】**

> 1. *** 下列命令均是在项目根目录执行【根目录  D:\MPOE>  MPOE结尾】
>
> 2. *** 下列命令均是在项目根目录执行【根目录  D:\MPOE>  MPOE结尾】
>
> 3. *** 下列命令均是在项目根目录执行【根目录  D:\MPOE>  MPOE结尾】
>
> 4. node 版本说明：**本应用基于 node v14**,其他版本如若报错，可以自行搭建其他版本的应用
>
> 5. 命令说明：
>
>    1. 执行的命令均是为大家封装好的，如果大家懂得原理，也可以自行操作
>
> 6. 依赖下载方式：
>
>    1. npm run installVue ：下载Vue相关依赖
>    2. npm run installNode ：下载 node 相关依赖
>
> 7. 启动方式：
>
>    1. 协同服务：
>
>       ```javascript
>       1. npm run startServer y-webrtc
>       (了解rtc的都知道,外网是需要stun服务器做转发的,本应用不支持,推荐使用 y-websocket的协同方式)
>       
>       2. 正常启动 node 即可支持 y-websocket 协同服务,但是本应用没有关联文件（更多个性化需要大家自行实现）**推荐使用此方式**
>       ```
>
>    2. （方式一）npm run node
>
>       1. 上述方式启动的是Node服务器，地址为 [http://localhost:5000](http://localhost:5000) ，该方式**运行的是Vue打包后的dist文件**
>
>    3. （方式二）npm run dev
>
>       1. 上述启动的是vue的开发环境，也可以使用
>       2. 调试后，请重新打包放在 node服务上
>
>    4. 几个注意事项：
>
>       1. 请确保数据库服务正常开启，在Mysql文价夹下，有当前文件的数据库表说明文件：README.md 以及项目数据库文件 mysql.sql
>
>       2. 文件上传的路径问题，mvc -> controller -> file -> uploadFile 中有一个mv()方法，传入的是当前执行命令的根路径，如果在协同编辑中文件上传出现问题，可以看看这里；
>
>       3. node采用较强的模块化思想，每个单独的模块都会独立导出 index.js ，因此，node有很多的 index.js，注意区分;
>
>       4. 重新打包后（vue项目包、luckysheet二开包），luckysheet 文件的处理：
>       5. 将luckysheet的dist放到node项目下，确保 index.html 引用正确的 luckysheet 即可。



## 打包后文件处理

```javascript
1. 打包命令
    npm run build
    
2. 生成 dist 目录，放置到 node/public 下

3. 检查并调整script引用地址为node结构下的luckysheet地址
    <!-- 引入 luck Sheet（下列两个地址需要重新定位，确保文件引入正确） -->
    <script src="../libs/luckysheet/plugins/js/plugin.js"></script>
    <script src="../libs/luckysheet/luckysheet.umd.js"></script>

4. 打包后，public 下的libs目录会一起打包到 dist 中，luckysheet 如果没有复制到node中，则引的是当前目录下的 libs 即可
```

## 其他说明


## 项目地址

gitee: [https://gitee.com/wfeng0/mpoe](https://gitee.com/wfeng0/mpoe)



## 文章地址

yjs+quill协同: [https://blog.csdn.net/weixin_47746452/article/details/132402713?spm=1001.2014.3001.5501](https://blog.csdn.net/weixin_47746452/article/details/132402713?spm=1001.2014.3001.5501)

luckysheet协同：[https://blog.csdn.net/weixin_47746452/article/details/134240905?spm=1001.2014.3001.5501](https://blog.csdn.net/weixin_47746452/article/details/134240905?spm=1001.2014.3001.5501)

掘金：[https://juejin.cn/post/7298170736480485376](https://juejin.cn/post/7298170736480485376)



## B站视频

B站：[https://www.bilibili.com/video/BV1Sj41117v4/?spm_id_from=333.999.0.0&vd_source=604a25c77e296b4ce29b1e6e6cf03ea6](https://www.bilibili.com/video/BV1Sj41117v4/?spm_id_from=333.999.0.0&vd_source=604a25c77e296b4ce29b1e6e6cf03ea6)