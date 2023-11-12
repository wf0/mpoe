import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { QuillBinding } from "y-quill";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import * as awarenessProtocol from "y-protocols/awareness.js";
import dayjs from "dayjs";

/**
 * 导出封装的 Yjs 类
 */
export class myYjs {
  // 需要传入绑定对象
  constructor(quill, roomName, username) {
    // A Yjs document holds the shared data
    this.ydoc = new Y.Doc();

    // Define a shared text type on the document（这个是拿到需要协同的 Delta 数据）
    const ytext = this.ydoc.getText("quill");

    /**
     * 【协同实现的三种方案：】
     *  1. y-webrtc 仅限于内网使用，外网需要自己搭建 stun 服务
     *  2. y-websocket 未攻克技术难点
     *  3. 组合式API自定义协同实现
     *
     */

    // 【方案一】 20231030  ** 新增 y-webrtc 方式 【仅限于内网使用】
    // const provider = new WebrtcProvider(roomName, this.ydoc, {
    //   signaling: ["ws://localhost:4444"],
    // });

    // 【方案二】 websocket 方式实现协同
    const provider = new WebsocketProvider(
      "ws://localhost:8000",
      roomName,
      this.ydoc
    );

    /**
     * 【方案三】 组合式API实现
     * 事件监听：
     * beforeTransaction beforeObserverCalls afterTransaction update updateV2 subdocs destroy
     * 目前使用 YText 数据，支持 Y.Map Y.Array Y.Text ...
     * 【Document Updates YJS文档API】： applyUpdate encodeStateAsUpdate encodeStateVector logUpdate
     * 【Alternative Update API 替代更新API】 mergeUpdates encodeStateVectorFromUpdate diffUpdate （可在还没连接的情况下进行数据同步）
     *  Y.applyUpdate(doc2, update) 应用当前更新
     *  Y.encodeStateAsUpdate  将文档状态编码为可应用于远程文档的单个更新消息
     */

    /**
     * 创建光标信息 => 这个是直接同步到 quill 中的，因此没有 api 可以操作，但是在 绑定的 quill 中，可以直接同步显示
     *  光标信息其实就是 quill 中的 dom
     * 注意：【如果是webrtc、websocket 的形式，则传递 provider 不然传递的是 doc，自己创建】
     */
    new QuillBinding(
      ytext,
      quill.quill,
      // 创建光标方式二选一： 1 webrtc、websocket 传 provider 2 组合式API 传 doc
      createAwareness({ username, provider })
      // createAwareness({ username, doc: this.ydoc })
    );
  }
}

// 创建光标信息
function createAwareness({ username, doc, provider }) {
  if (!doc && !provider)
    return new Error(
      "Failed to create awareness,pleace afferented doc or procider into the function. "
    );

  // 如果已经通过 webrtc、websocket 的形式同步数据，则直接从同步数据中获取，不然自己创建
  let { awareness } = provider || {
    awareness: new awarenessProtocol.Awareness(doc),
  };
  let _d = dayjs().unix().toString(); // 1692605552
  // 定义随机颜色
  let color = "#" + Math.random().toString(16).split(".")[1].slice(0, 6);
  awareness.setLocalStateField("user", {
    name: username || `用户_${_d.slice(6, 9)}`, // 默认取时间戳最后三位
    color,
  });
  return awareness;
}
