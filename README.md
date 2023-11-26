# 多人协同编辑器开发 MPOE（Multi person online edit）

## 项目启动方式**【必看】**

> 1. *** 下列命令均是在项目根目录执行【根目录  D:\MPOE>  MPOE结尾】
> 2. *** 下列命令均是在项目根目录执行【根目录  D:\MPOE>  MPOE结尾】
> 3. *** 下列命令均是在项目根目录执行【根目录  D:\MPOE>  MPOE结尾】
> 4. 命令说明：
>    1. 执行的命令均是为大家封装好的，如果大家懂得原理，也可以自行操作
> 5. 依赖下载方式：
>    1. npm run installVue ：下载Vue相关依赖
>    2. npm run installNode ：下载 node 相关依赖
> 6. 启动方式：

>    1. 协同服务：
>
>       ​	1. npm run startServer y-webrtc（如果了解rtc的，外网是需要stun服务器做转发的，本应用不支持，因此，推荐使用 y-websocket的协同方式）
           2. 正常启动 node即可支持 y-websocket 协同服务，**推荐使用此方式**
>
>    2. （方式一）npm run node 
>
>       1.  上述方式启动的是Node服务器，端口为 http://localhost:5000 ，同时**运行的是Vue打包后的dist文件**
>
>    3. （方式二）npm run dev
>
>       1.  上述启动的是vue的开发环境，也可以使用
>       2.  调试后，请重新打包放在 node服务上
>
>    4. 几个注意事项：
>
>    5. 请确保数据库服务正常开启，在Mysql文价夹下，有当前文件的数据库表说明文件：README.md 以及项目数据库文件 mysql.sql
>
>    6. 文件上传的路径问题，mvc -> controller -> file -> uploadFile 中有一个mv()方法，传入的是当前执行命令的根路径，如果在协同编辑中文件上传出现问题，可以看看这里；
>
>    7. node采用较强的模块化思想，每个单独的模块都会独立导出 index.js ，因此，node有很多的 index.js，注意区分;
>
>    8. 重新打包后（vue项目包、luckysheet二开包），luckysheet 文件的处理：
>
>       1. 将luckysheet的dist放到node项目下，确保 index.html 引用正确的 luckysheet 即可。

## 项目地址

gitee: https://gitee.com/wfeng0/mpoe

## 文章地址

yjs+quill协同: http://t.csdn.cn/x7xhk

luckysheet协同：https://blog.csdn.net/weixin_47746452/article/details/134240905?spm=1001.2014.3001.5501

掘金：https://juejin.cn/post/7298170736480485376