// canvas-editor 相关API
export const useEditor = () => {
  // 菜单栏点击事件
  function iconClickHandle(payload, instance) {
    if (!payload || !instance || !payload.icon) return;

    const { icon, value, reword } = payload;

    console.log(icon, value);

    const iconHandleMap = {
      // 保存
      "icon-baocun": () => {},
      "icon-dayin": () => instance.command.executePrint(),
      // 历史记录
      "icon-lishi": () => {},
      "icon-chexiao": () => instance.command.executeUndo(),
      "icon-zhongzuo": () => instance.command.executeRedo(),
      // 格式刷
      "icon-geshishua": () => {},
      "icon-fuzhi": () => instance.command.executeCopy(),
      "icon-niantie": () => instance.command.executePaste(),
      "icon-jianqie": () => instance.command.executeCut(),
      "icon-zihaojia": () => instance.command.executeSizeAdd(),
      "icon-zihaojian": () => instance.command.executeSizeMinus(),
      "icon-cuti": () => instance.command.executeBold(),
      "icon-italic": () => instance.command.executeItalic(),
      "icon-zitixiahuaxian": () => instance.command.executeUnderline(),
      "icon-strikethrough": () => instance.command.executeStrikeout(),
      // 高亮
      "icon-icon_tuchuxianshi": () => {},
      // 字体颜色
      "icon-zitiyanse": () => {},
      // 主动搜索-输入框
      "icon-search": () => instance.command.executeSearch(value),
      // 查找上一处
      "icon-presearch": () => instance.command.executeSearchNavigatePre(),
      // 查找下一处
      "icon-nextsearch": () => instance.command.executeSearchNavigateNext(),
      // 替换
      "icon-replace": () => instance.command.executeReplace(reword),
      // 关闭查找
      "icon-search-close": () => instance.command.executeSearch(""),
      pageScaleAdd: () => instance.command.executePageScaleAdd(),
      pageScaleMinus: () => instance.command.executePageScaleMinus(),
      pageScale: () => instance.command.executePageScale(value),
      closeWebSocket: () => instance.command.closeWebSocket(),
      // 字号 font-size
      "font-size": () => instance.command.executeSize(value),
      // 标题
      "title-level": () => instance.command.executeTitle(value),
    };
    iconHandleMap[icon] && iconHandleMap[icon]();
  }

  return { iconClickHandle };
};
