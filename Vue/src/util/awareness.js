/**
 * 创建光标信息
 * @param {Object} { username, doc, provider }
 * @returns awareness
 */
export function createAwareness({ username, doc, provider }) {
  if (!doc && !provider)
    return new Error(
      "Failed to create awareness,pleace afferented doc or procider into the function. "
    );
  // 如果已经通过 webrtc、websocket 的形式同步数据，则直接从同步数据中获取，不然自己创建
  let { awareness } = provider || {
    awareness: new awarenessProtocol.Awareness(doc),
  };
  // 定义16进制的随机数
  let _R = Math.random().toString(16).split(".")[1];

  // 定义随机颜色
  let color = "#" + _R.slice(0, 6);

  let userInfo = { name: username || `用户_${_R.slice(0, 3)}`, color };

  awareness.setLocalStateField("user", userInfo);

  return awareness;
}
