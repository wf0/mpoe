// 导出Quill实体类
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css"; // 使用了 snow 主题色
import { entitiestoUtf16 } from "@/util/utf16";

export class myQuill {
  constructor(selector) {
    // 使用 cursors 插件
    Quill.register("modules/cursors", QuillCursors);

    // 初始化 quill 文档操作对象
    this.quill = new Quill(selector, {
      modules: {
        cursors: true, // 开启插件
        // 配置菜单栏* 项目中没有配置，自己写了一个，通过API调用实现富文本编辑
        // toolbar: [],
      },
      // theme: "snow", // 是否启用工具栏
      placeholder: "请输入内容...",
    });
  }

  // 获取焦点
  focus() {
    this.quill.focus();
  }

  // 撤销
  undo() {
    this.quill.history.undo();
  }

  // 重做
  redo() {
    this.quill.history.redo();
  }

  // 清空
  clear() {
    this.quill.setText("\n");
    // 重新获取焦点
    this.focus();
  }

  // 插入文字
  insertText(_t) {
    // 获取当前光标
    let { index } = this.quill.getSelection(true);
    this.quill.insertText(index, _t);
  }

  // 获取当前光标位置
  getCurrentCursor() {
    return this.quill.getSelection(true).index;
  }

  // 格式化
  format(opt, color) {
    // 将加粗\斜体\删除线\下划线\颜色等操作 封装一个函数,因此,就需要先获取样式,才能判断是否已经有样式
    // 还需要获取用户的选择,可能是给某些字符添加样式
    // 获取用户选择 ** 这里需要传递参数,不然会导致焦点移出编辑器,选中失效
    var range = this.quill.getSelection(true);

    if (!range) return console.warn("User cursor is not in editor");
    let { index, length } = range; // index 是当前光标的索引,length 表示当前选择的长度
    // 获取样式 检索给定范围内文本的所用格式(加粗 斜体都是块作用域,是需要指定长度的,因此,用户没有选择,则默认不作用,不像标题等,是行作用域)
    let { bold, italic, strike, underline } = this.quill.getFormat(
      index,
      length
    );
    // "icon-cuti": bold,
    // "icon-italic": italic,
    // "icon-strikethrough": strike,
    // "icon-zitixiahuaxian": underline,
    // "icon-zitiyanse": color,
    // 拿到用户操作的映射,判断有没有当前属性,没有则添加,有,则删除
    if (opt === "icon-cuti")
      this.quill.formatText(index, length, "bold", !bold);
    if (opt === "icon-italic")
      this.quill.formatText(index, length, "italic", !italic);
    if (opt === "icon-strikethrough")
      this.quill.formatText(index, length, "strike", !strike);
    if (opt === "icon-zitixiahuaxian")
      this.quill.formatText(index, length, "underline", !underline);
    if (opt === "color") this.quill.formatText(index, length, "color", color);
  }

  // 添加嵌入式内容
  insertEmbed(index, type, value) {
    this.quill.insertEmbed(index || this.getCurrentCursor(), type, value);
  }

  // 获取当前编辑器的 detail 数据格式
  getDetail() {
    // 检索编辑器的内容，格式化返回一个Delta对象。
    return this.quill.getContents();
  }

  // 初始化文本编辑器
  init(data) {
    // 处理数据(最大程度还原数据)
    let _T = data
      .replace(/[\r]/g, "#r#")
      .replace(/[\n]/g, "#n#")
      .replace(/[\t]/g, "#t#");
    let detail = JSON.parse(_T);
    /**
     * 需要先处理特殊字符，不然转不了JSON
     * 然后再根据特性，转回来，不然该换行的地方没有换行
     * emoji 转码
     */
    detail.forEach((i, index) => {
      i.insert = entitiestoUtf16(
        i.insert
          .toString()
          .replace(/#n#/g, "\n")
          .replace(/#r#/g, "\r")
          .replace(/#t#/g, "\t")
      );
    });
    this.quill.setContents(detail);
  }
}
