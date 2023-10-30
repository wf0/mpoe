import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { QuillBinding } from "y-quill";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import dayjs from "dayjs";
export class myYjs {
  // 需要传入绑定对象
  constructor(quill, roomName, username) {
    // A Yjs document holds the shared data
    this.ydoc = new Y.Doc();

    // Define a shared text type on the document（这个是拿到需要协同的 Delta 数据）
    const ytext = this.ydoc.getText("quill");

    /**
     *  A Yjs Doc connected to room "quill-demo-room" already exists!
     * WebrtcProvider 第一个参数是房间名，需要动态传递，通过该变量区分不同的文档协同，因此初始化的时候需要传递参数
     *
     */
    // 20231030  ** 新增 y-webrtc 方式
    this.provider = new WebrtcProvider(roomName, this.ydoc, {
      signaling: ["wss://y-webrtc-ckynwnzncc.now.sh", "ws://localhost:4444"],
    });
    // this.provider = new WebsocketProvider(
    //   "ws://localhost:9000",
    //   roomName,
    //   this.ydoc
    // );

    this.provider.on("status", (event) => {
      console.log("WebsocketProvider Status ", event.status); // logs "connected" or "disconnected"
      // 如果监听到短线,则启用离线模式  offline
      if (event.status === "disconnect")
        this.persistence = new IndexeddbPersistence(roomName, this.ydoc);
      // dosomething offline (需要处理光标)
    });

    //   绑定 quill与YJS
    const binding = new QuillBinding(
      ytext,
      quill.quill,
      this.createAwareness(username)
    );
  }

  // 创建自己的光标信息
  createAwareness(name) {
    let { awareness } = this.provider;
    let _d = dayjs().unix().toString(); // 1692605552
    // 定义随机颜色
    let color = "#" + Math.random().toString(16).split(".")[1].slice(0, 6);
    awareness.setLocalStateField("user", {
      name: name || `用户：${_d.slice(6, 9)}`, // 默认取时间戳最后三位
      color,
    });
    return awareness;
  }
}
