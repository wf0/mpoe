luckysheet 的协同文件操作 
if (type == "shs") {
    console.log("切换sheet页");
    sheetmanage.setSheetShow(value);
} 



/**
 * 导出 websocket 的关闭方法：
 * luckysheet.wsclose() 进行调用
 */
export function wsclose() {
  console.log("调用自定义方法 server.closeWebSocket()");
  server.closeWebSocket();
}

/**
 * 导出 websocket 的pako 加密方法：
 * luckysheet.gzipMessage() 进行调用
 */
export function gzipMessage(d) {
  console.log("调用自定义方法 server.gzipMessage()");
  return server.gzipMessage(d);
}

/**
 * 导出 websocket 的 ws send 主动发送方法：
 * luckysheet.wsclose() 进行调用
 */
export function sendMessage(d) {
  console.log("调用自定义方法 server.sendMessage()");
  server.sendMessage(d);
}


  // 添加关闭事件
  closeWebSocket: function () {
    let _this = this;
    if ("WebSocket" in window) {
      _this.websocket.close();
    } else console.error("## closeWebSocket", locale().websocket.support);
  },

  // 添加加密消息事件
  gzipMessage: function (d) {
    return pako.gzip(encodeURIComponent(JSON.stringify(d)), { to: "string" });
  },

  // 添加主动发送事件
  sendMessage: function (d) {
    let _this = this;
    let msg = pako.gzip(encodeURIComponent(JSON.stringify(d)), {
      to: "string",
    });
    if (_this.websocket != null) {
      _this.websocket.send(msg);
    }
  },